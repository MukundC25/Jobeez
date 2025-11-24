"""
Lightweight FastAPI backend with lazy loading and mock data fallback
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Jobeez API (Lite)",
    description="AI-Powered Resume Parser and Job Matcher - Lightweight Version",
    version="1.0.0-lite"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple Pydantic models
class Contact(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class Skill(BaseModel):
    name: str
    category: Optional[str] = None

class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

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

class JobListing(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str] = None
    description: str
    skills: List[str] = []
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None

class JobMatch(BaseModel):
    job: JobListing
    match_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    match_reasoning: str

# Mock data store
mock_resumes = {}
mock_jobs = [
    {
        "id": "job-1",
        "title": "Senior Full Stack Developer",
        "company": "Tech Giants Inc.",
        "location": "San Francisco, CA (Remote)",
        "description": "We are looking for an experienced Full Stack Developer with React and Node.js expertise.",
        "skills": ["React", "Node.js", "JavaScript", "TypeScript", "MongoDB"],
        "salary_min": 120000,
        "salary_max": 180000
    },
    {
        "id": "job-2",
        "title": "Frontend Developer",
        "company": "Innovative Startup",
        "location": "Remote",
        "description": "Join our team to build cutting-edge web applications with modern frameworks.",
        "skills": ["React", "JavaScript", "CSS", "HTML", "Redux"],
        "salary_min": 90000,
        "salary_max": 130000
    },
    {
        "id": "job-3",
        "title": "Python Backend Developer",
        "company": "AI Solutions",
        "location": "Boston, MA",
        "description": "Help us build scalable backend systems using Python and FastAPI.",
        "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
        "salary_min": 110000,
        "salary_max": 160000
    },
    {
        "id": "job-4",
        "title": "Machine Learning Engineer",
        "company": "Data Corp",
        "location": "New York, NY",
        "description": "Build and deploy ML models for production systems.",
        "skills": ["Python", "TensorFlow", "PyTorch", "Machine Learning", "Docker"],
        "salary_min": 130000,
        "salary_max": 190000
    },
    {
        "id": "job-5",
        "title": "DevOps Engineer",
        "company": "Cloud Services Ltd",
        "location": "Remote",
        "description": "Manage cloud infrastructure and CI/CD pipelines.",
        "skills": ["AWS", "Docker", "Kubernetes", "Python", "Terraform"],
        "salary_min": 115000,
        "salary_max": 165000
    }
]

@app.get("/")
async def root():
    return {
        "message": "Welcome to Jobeez API (Lite Version)",
        "version": "1.0.0-lite",
        "docs": "/docs",
        "features": ["Fast startup", "Mock data", "Lazy loading ready"]
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Jobeez API Lite",
        "version": "1.0.0-lite"
    }

@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume - returns mock data for now"""
    try:
        # Generate a simple ID
        resume_id = f"resume-{len(mock_resumes) + 1}"
        
        # Create mock resume data
        mock_resume = {
            "id": resume_id,
            "name": "John Doe",
            "contact": {
                "email": "john.doe@example.com",
                "phone": "+1-234-567-8900",
                "linkedin": "https://linkedin.com/in/johndoe",
                "github": "https://github.com/johndoe"
            },
            "summary": "Experienced software developer with expertise in full-stack development, specializing in React, Node.js, and Python. Passionate about building scalable applications.",
            "skills": [
                {"name": "JavaScript", "category": "technical"},
                {"name": "React", "category": "technical"},
                {"name": "Node.js", "category": "technical"},
                {"name": "Python", "category": "technical"},
                {"name": "FastAPI", "category": "technical"},
                {"name": "MongoDB", "category": "technical"},
                {"name": "Docker", "category": "technical"},
                {"name": "Problem Solving", "category": "soft"}
            ],
            "experience": [
                {
                    "company": "Tech Company",
                    "title": "Senior Software Developer",
                    "start_date": "Jan 2020",
                    "end_date": "Present",
                    "description": "Led development of microservices architecture. Mentored junior developers. Improved system performance by 40%."
                },
                {
                    "company": "Startup Inc",
                    "title": "Full Stack Developer",
                    "start_date": "Jun 2018",
                    "end_date": "Dec 2019",
                    "description": "Built RESTful APIs and responsive frontends. Implemented CI/CD pipelines."
                }
            ],
            "education": [
                {
                    "institution": "University of Technology",
                    "degree": "Bachelor of Science",
                    "field_of_study": "Computer Science",
                    "start_date": "2014",
                    "end_date": "2018"
                }
            ]
        }
        
        mock_resumes[resume_id] = mock_resume
        
        return {
            "id": resume_id,
            "message": "Resume uploaded successfully",
            "resume": mock_resume
        }
    except Exception as e:
        logger.error(f"Error uploading resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/resume/{resume_id}")
async def get_resume(resume_id: str):
    """Get resume by ID"""
    if resume_id not in mock_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    return mock_resumes[resume_id]

@app.get("/api/resume/{resume_id}/improvement")
async def get_resume_improvement(resume_id: str):
    """Get improvement suggestions for resume"""
    if resume_id not in mock_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return {
        "missing_skills": ["TypeScript", "AWS", "Kubernetes"],
        "improvement_score": 15.5,
        "formatting_suggestions": [
            "Add quantifiable achievements with metrics",
            "Include relevant certifications",
            "Add a professional summary at the top"
        ],
        "content_suggestions": [
            "Expand on leadership experience",
            "Add more technical project details",
            "Include open-source contributions if any"
        ]
    }

@app.get("/api/jobs")
async def get_jobs(skip: int = 0, limit: int = 10):
    """Get job listings with pagination"""
    return {
        "jobs": mock_jobs[skip:skip + limit],
        "total": len(mock_jobs),
        "skip": skip,
        "limit": limit
    }

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    """Get specific job by ID"""
    for job in mock_jobs:
        if job["id"] == job_id:
            return job
    raise HTTPException(status_code=404, detail="Job not found")

@app.get("/api/matching/{resume_id}/jobs")
async def match_resume_to_jobs(resume_id: str, limit: int = 10):
    """Match resume to jobs - simple keyword matching"""
    if resume_id not in mock_resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume = mock_resumes[resume_id]
    resume_skills = {skill["name"].lower() for skill in resume["skills"]}
    
    # Calculate matches
    matches = []
    for job in mock_jobs:
        job_skills = {skill.lower() for skill in job["skills"]}
        matched = resume_skills.intersection(job_skills)
        missing = job_skills - resume_skills
        
        if matched:
            match_score = (len(matched) / len(job_skills)) * 100
            matches.append({
                "job": job,
                "match_score": round(match_score, 1),
                "matched_skills": list(matched),
                "missing_skills": list(missing),
                "match_reasoning": f"You have {len(matched)} out of {len(job_skills)} required skills. Strong match for this position!"
            })
    
    # Sort by match score
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "matches": matches[:limit],
        "total": len(matches)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9765)
