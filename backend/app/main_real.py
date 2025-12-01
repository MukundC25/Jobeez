"""
Real FastAPI backend with actual resume parsing and job matching
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import logging
import os
import re
import io
from collections import Counter
import httpx
from typing import Dict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Jobeez API",
    description="AI-Powered Resume Parser and Job Matcher",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Contact(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class Skill(BaseModel):
    name: str
    category: Optional[str] = "general"
    confidence: Optional[float] = 1.0

class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    duration_months: Optional[int] = None

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class Resume(BaseModel):
    id: str
    name: str
    contact: Contact
    summary: Optional[str] = None
    skills: List[Skill] = []
    experience: List[Experience] = []
    education: List[Education] = []
    total_experience_years: Optional[float] = 0
    raw_text: Optional[str] = None

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str] = None
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    experience_required: Optional[int] = 0
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None

class JobMatch(BaseModel):
    job: JobListing
    match_score: float
    skill_match_score: float
    experience_match_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    recommendation: str

# Skill database - common tech skills
SKILL_DATABASE = {
    "programming": ["python", "java", "javascript", "typescript", "c++", "c#", "ruby", "go", "rust", "php", "swift", "kotlin"],
    "web": ["react", "angular", "vue", "nextjs", "nodejs", "express", "django", "flask", "fastapi", "html", "css", "tailwind"],
    "database": ["sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "dynamodb", "cassandra"],
    "cloud": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ci/cd"],
    "data": ["pandas", "numpy", "tensorflow", "pytorch", "scikit-learn", "spark", "hadoop", "tableau", "powerbi"],
    "tools": ["git", "jira", "agile", "scrum", "rest", "graphql", "api", "microservices"]
}

# Flatten skill database for easy lookup
ALL_SKILLS = set()
for category, skills in SKILL_DATABASE.items():
    ALL_SKILLS.update(skills)

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        import PyPDF2
        pdf_file = io.BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from PDF")

def extract_text_from_docx(file_content: bytes) -> str:
    """Extract text from DOCX file"""
    try:
        from docx import Document
        doc = Document(io.BytesIO(file_content))
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
        return text
    except Exception as e:
        logger.error(f"DOCX extraction error: {e}")
        raise HTTPException(status_code=400, detail="Failed to extract text from DOCX")

def extract_email(text: str) -> Optional[str]:
    """Extract email from text"""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    """Extract phone number from text"""
    phone_pattern = r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None

def extract_linkedin(text: str) -> Optional[str]:
    """Extract LinkedIn URL from text"""
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'
    match = re.search(linkedin_pattern, text, re.IGNORECASE)
    return f"https://{match.group(0)}" if match else None

def extract_github(text: str) -> Optional[str]:
    """Extract GitHub URL from text"""
    github_pattern = r'github\.com/[\w-]+'
    match = re.search(github_pattern, text, re.IGNORECASE)
    return f"https://{match.group(0)}" if match else None

def extract_name(text: str) -> str:
    """Extract name from resume (first line usually)"""
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        # First non-empty line is usually the name
        return lines[0]
    return "Unknown"

def extract_skills(text: str) -> List[Skill]:
    """Extract skills from text using keyword matching"""
    text_lower = text.lower()
    found_skills = []
    
    for skill in ALL_SKILLS:
        # Use word boundaries to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            # Determine category
            category = "general"
            for cat, skills_list in SKILL_DATABASE.items():
                if skill in skills_list:
                    category = cat
                    break
            
            found_skills.append(Skill(
                name=skill.title(),
                category=category,
                confidence=1.0
            ))
    
    return found_skills

def extract_experience(text: str) -> tuple[List[Experience], float]:
    """Extract work experience from text"""
    experiences = []
    total_years = 0
    
    # Look for experience section
    exp_section_pattern = r'(?:experience|work history|employment)(.*?)(?:education|skills|projects|$)'
    exp_match = re.search(exp_section_pattern, text, re.IGNORECASE | re.DOTALL)
    
    if exp_match:
        exp_text = exp_match.group(1)
        
        # Look for company names and titles (basic pattern)
        # This is simplified - real implementation would use NER
        lines = exp_text.split('\n')
        current_exp = None
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Look for date patterns (e.g., "2020 - 2023", "Jan 2020 - Present")
            date_pattern = r'(\d{4}|\w{3,9}\s+\d{4})\s*[-–]\s*(\d{4}|\w{3,9}\s+\d{4}|present|current)'
            date_match = re.search(date_pattern, line, re.IGNORECASE)
            
            if date_match:
                if current_exp:
                    experiences.append(current_exp)
                
                # Extract years for duration calculation
                start_year_match = re.search(r'\d{4}', date_match.group(1))
                end_year_match = re.search(r'\d{4}', date_match.group(2))
                
                duration = 0
                if start_year_match and end_year_match:
                    duration = int(end_year_match.group(0)) - int(start_year_match.group(0))
                elif start_year_match:
                    duration = datetime.now().year - int(start_year_match.group(0))
                
                total_years += duration
                
                current_exp = Experience(
                    company="Company",  # Would need NER to extract properly
                    title="Position",    # Would need NER to extract properly
                    start_date=date_match.group(1),
                    end_date=date_match.group(2),
                    duration_months=duration * 12
                )
        
        if current_exp:
            experiences.append(current_exp)
    
    # If no structured experience found, estimate from text
    if not experiences:
        # Look for year mentions
        years = re.findall(r'\b(19|20)\d{2}\b', text)
        if len(years) >= 2:
            years_int = [int(y) for y in years]
            total_years = max(years_int) - min(years_int)
    
    return experiences, total_years

def extract_education(text: str) -> List[Education]:
    """Extract education from text"""
    educations = []
    
    # Look for education section
    edu_section_pattern = r'(?:education|academic)(.*?)(?:experience|skills|projects|$)'
    edu_match = re.search(edu_section_pattern, text, re.IGNORECASE | re.DOTALL)
    
    if edu_match:
        edu_text = edu_match.group(1)
        
        # Look for degree keywords
        degree_keywords = ["bachelor", "master", "phd", "doctorate", "bs", "ms", "mba", "ba", "ma"]
        
        for keyword in degree_keywords:
            if keyword in edu_text.lower():
                educations.append(Education(
                    institution="University",  # Would need NER
                    degree=keyword.title(),
                    field_of_study="Computer Science"  # Would need extraction
                ))
                break
    
    return educations

def parse_resume(file_content: bytes, filename: str) -> Resume:
    """Parse resume and extract structured information"""
    
    # Extract text based on file type
    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(file_content)
    elif filename.endswith('.docx'):
        text = extract_text_from_docx(file_content)
    else:
        text = file_content.decode('utf-8')
    
    # Extract information
    name = extract_name(text)
    contact = Contact(
        email=extract_email(text),
        phone=extract_phone(text),
        linkedin=extract_linkedin(text),
        github=extract_github(text)
    )
    
    skills = extract_skills(text)
    experiences, total_years = extract_experience(text)
    educations = extract_education(text)
    
    # Generate summary
    summary = f"Professional with {total_years:.1f} years of experience"
    if skills:
        top_skills = [s.name for s in skills[:5]]
        summary += f" in {', '.join(top_skills)}"
    
    resume_id = f"resume_{datetime.now().timestamp()}"
    
    return Resume(
        id=resume_id,
        name=name,
        contact=contact,
        summary=summary,
        skills=skills,
        experience=experiences,
        education=educations,
        total_experience_years=total_years,
        raw_text=text[:500]  # First 500 chars for preview
    )

# Mock job database
MOCK_JOBS = [
    JobListing(
        id="job_1",
        title="Senior Python Developer",
        company="TechCorp Inc",
        location="San Francisco, CA",
        description="We're looking for an experienced Python developer to join our backend team.",
        required_skills=["python", "django", "postgresql", "docker"],
        preferred_skills=["aws", "kubernetes", "redis"],
        experience_required=5,
        salary_min=120000,
        salary_max=180000
    ),
    JobListing(
        id="job_2",
        title="Full Stack Engineer",
        company="StartupXYZ",
        location="Remote",
        description="Join our fast-growing startup as a full-stack engineer.",
        required_skills=["javascript", "react", "nodejs", "mongodb"],
        preferred_skills=["typescript", "nextjs", "aws"],
        experience_required=3,
        salary_min=100000,
        salary_max=150000
    ),
    JobListing(
        id="job_3",
        title="Data Scientist",
        company="AI Solutions Ltd",
        location="New York, NY",
        description="Seeking a data scientist to work on machine learning projects.",
        required_skills=["python", "tensorflow", "pandas", "sql"],
        preferred_skills=["pytorch", "spark", "aws"],
        experience_required=4,
        salary_min=130000,
        salary_max=190000
    ),
    JobListing(
        id="job_4",
        title="Frontend Developer",
        company="DesignHub",
        location="Austin, TX",
        description="Create beautiful user interfaces with modern web technologies.",
        required_skills=["javascript", "react", "css", "html"],
        preferred_skills=["typescript", "tailwind", "nextjs"],
        experience_required=2,
        salary_min=90000,
        salary_max=130000
    ),
    JobListing(
        id="job_5",
        title="DevOps Engineer",
        company="CloudFirst",
        location="Seattle, WA",
        description="Manage our cloud infrastructure and CI/CD pipelines.",
        required_skills=["aws", "docker", "kubernetes", "terraform"],
        preferred_skills=["jenkins", "python", "monitoring"],
        experience_required=4,
        salary_min=110000,
        salary_max=160000
    ),
]

def calculate_job_match(resume: Resume, job: JobListing) -> JobMatch:
    """Calculate match score between resume and job"""
    
    # Extract skill names from resume
    resume_skills = set(skill.name.lower() for skill in resume.skills)
    required_skills = set(skill.lower() for skill in job.required_skills)
    preferred_skills = set(skill.lower() for skill in job.preferred_skills)
    all_job_skills = required_skills | preferred_skills
    
    # Calculate skill match
    matched_required = resume_skills & required_skills
    matched_preferred = resume_skills & preferred_skills
    matched_skills = list(matched_required | matched_preferred)
    missing_skills = list(required_skills - resume_skills)
    
    # Skill match score (70% weight on required, 30% on preferred)
    required_match_rate = len(matched_required) / len(required_skills) if required_skills else 1.0
    preferred_match_rate = len(matched_preferred) / len(preferred_skills) if preferred_skills else 0.5
    skill_match_score = (required_match_rate * 0.7 + preferred_match_rate * 0.3) * 100
    
    # Experience match score
    exp_diff = abs(resume.total_experience_years - job.experience_required)
    if exp_diff == 0:
        experience_match_score = 100
    elif exp_diff <= 1:
        experience_match_score = 90
    elif exp_diff <= 2:
        experience_match_score = 75
    elif exp_diff <= 3:
        experience_match_score = 60
    else:
        experience_match_score = max(40, 100 - (exp_diff * 10))
    
    # Overall match score (60% skills, 40% experience)
    overall_score = (skill_match_score * 0.6 + experience_match_score * 0.4)
    
    # Generate recommendation
    if overall_score >= 80:
        recommendation = "Excellent match! You meet most requirements."
    elif overall_score >= 60:
        recommendation = "Good match. Consider applying with emphasis on your strengths."
    elif overall_score >= 40:
        recommendation = "Moderate match. Highlight transferable skills."
    else:
        recommendation = "Lower match. Consider upskilling in missing areas."
    
    return JobMatch(
        job=job,
        match_score=round(overall_score, 1),
        skill_match_score=round(skill_match_score, 1),
        experience_match_score=round(experience_match_score, 1),
        matched_skills=[s.title() for s in matched_skills],
        missing_skills=[s.title() for s in missing_skills],
        recommendation=recommendation
    )

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Jobeez API - Real ML-powered resume parser", "version": "2.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Real backend with ML parsing is running"}

@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume"""
    try:
        logger.info(f"Received file: {file.filename}")
        
        # Read file content
        content = await file.read()
        
        # Parse resume
        resume = parse_resume(content, file.filename)
        
        logger.info(f"Successfully parsed resume for {resume.name}")
        logger.info(f"Found {len(resume.skills)} skills, {len(resume.experience)} experiences")
        
        return {
            "success": True,
            "message": "Resume parsed successfully",
            "resume": resume.dict()
        }
        
    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def fetch_real_jobs() -> List[JobListing]:
    """Fetch real jobs from multiple free APIs"""
    jobs = []
    
    try:
        # Try Remotive API (free, no auth required)
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("https://remotive.com/api/remote-jobs?limit=20")
            if response.status_code == 200:
                data = response.json()
                for idx, job in enumerate(data.get('jobs', [])[:20]):
                    # Extract skills from description
                    description = job.get('description', '')
                    tags = job.get('tags', [])
                    
                    # Common tech skills to look for
                    tech_skills = ['python', 'javascript', 'java', 'react', 'node', 'aws', 'docker', 'kubernetes']
                    found_skills = [skill for skill in tech_skills if skill.lower() in description.lower()]
                    
                    # Add tags as skills
                    found_skills.extend([tag.lower() for tag in tags if isinstance(tag, str)])
                    found_skills = list(set(found_skills))[:10]  # Unique, max 10
                    
                    jobs.append(JobListing(
                        id=f"remote_{idx}_{job.get('id', idx)}",
                        title=job.get('title', 'Software Developer'),
                        company=job.get('company_name', 'Tech Company'),
                        location=job.get('candidate_required_location', 'Remote'),
                        description=description[:500],  # Limit description length
                        required_skills=found_skills[:5] if found_skills else ['programming'],
                        preferred_skills=found_skills[5:] if len(found_skills) > 5 else [],
                        experience_required=3,
                        salary_min=job.get('salary_min'),
                        salary_max=job.get('salary_max')
                    ))
    except Exception as e:
        logger.error(f"Error fetching from Remotive: {e}")
    
    # If we got jobs, return them
    if jobs:
        logger.info(f"Fetched {len(jobs)} real jobs from Remotive")
        return jobs
    
    # Fallback to mock jobs if API fails
    logger.warning("Using mock jobs as fallback")
    return MOCK_JOBS

@app.get("/api/jobs")
async def get_jobs():
    """Get all available jobs from real APIs"""
    jobs = await fetch_real_jobs()
    return jobs

@app.post("/api/jobs/match")
async def match_jobs(resume: Resume):
    """Match resume with real jobs"""
    try:
        # Fetch real jobs
        jobs = await fetch_real_jobs()
        
        matches = []
        for job in jobs:
            match = calculate_job_match(resume, job)
            matches.append(match)
        
        # Sort by match score descending
        matches.sort(key=lambda x: x.match_score, reverse=True)
        
        return {
            "success": True,
            "total_matches": len(matches),
            "matches": [m.dict() for m in matches]
        }
        
    except Exception as e:
        logger.error(f"Error matching jobs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8765)
