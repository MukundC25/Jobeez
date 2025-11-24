from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
from ..services.resume_parser import ResumeParser
from ..services.job_scraper import JobScraper
from ..services.job_matcher import JobMatcher
import os
from datetime import datetime
import shutil
from pathlib import Path

router = APIRouter()
resume_parser = ResumeParser()
job_scraper = JobScraper()
job_matcher = JobMatcher()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse uploaded resume and extract information.
    
    Args:
        file: Uploaded resume file (PDF or DOCX)
        
    Returns:
        Dictionary containing parsed resume information
    """
    # Validate file type
    if not file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF or DOCX file."
        )
    
    try:
        # Save uploaded file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = UPLOAD_DIR / f"{timestamp}_{file.filename}"
        
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse resume
        parsed_data = resume_parser.parse_resume(str(file_path))
        
        # Clean up uploaded file
        file_path.unlink()
        
        return {
            "status": "success",
            "data": parsed_data
        }
        
    except Exception as e:
        # Clean up file if it exists
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing resume: {str(e)}"
        )

@router.get("/jobs")
async def get_jobs(
    keywords: Optional[List[str]] = Query(None),
    location: Optional[str] = Query(None),
    sources: List[str] = Query(['mock']),  # Default to mock data
    max_jobs: int = Query(50, ge=1, le=100)
):
    """
    Get job listings from specified sources.
    
    Args:
        keywords: List of job keywords to search for
        location: Location to search in
        sources: List of sources to fetch from ('linkedin', 'indeed', 'remoteok', 'rapidapi', 'mock')
        max_jobs: Maximum number of jobs to return
        
    Returns:
        List of job listings
    """
    try:
        jobs = job_scraper.get_jobs(
            sources=sources,
            keywords=keywords,
            location=location,
            max_jobs=max_jobs
        )
        
        return {
            "status": "success",
            "count": len(jobs),
            "data": jobs
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching jobs: {str(e)}"
        )

@router.post("/match-jobs")
async def match_jobs(
    resume_data: dict,
    keywords: Optional[List[str]] = Query(None),
    location: Optional[str] = Query(None),
    sources: List[str] = Query(['mock']),
    max_jobs: int = Query(10, ge=1, le=50)
):
    """
    Match resume against job listings and return top matches.
    
    Args:
        resume_data: Dictionary containing parsed resume information
        keywords: List of job keywords to search for
        location: Location to search in
        sources: List of sources to fetch from
        max_jobs: Maximum number of job matches to return
        
    Returns:
        List of job matches with scores and improvement suggestions
    """
    try:
        # Get jobs
        jobs = job_scraper.get_jobs(
            sources=sources,
            keywords=keywords,
            location=location,
            max_jobs=max_jobs * 2  # Fetch more jobs to ensure we have enough after filtering
        )
        
        # Match jobs
        matches = job_matcher.match_jobs(
            resume_data=resume_data,
            jobs=jobs,
            top_k=max_jobs
        )
        
        return {
            "status": "success",
            "count": len(matches),
            "data": matches
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error matching jobs: {str(e)}"
        )

@router.post("/analyze-resume")
async def analyze_resume(
    resume_data: dict,
    target_job_title: Optional[str] = Query(None)
):
    """
    Analyze resume and provide improvement suggestions.
    
    Args:
        resume_data: Dictionary containing parsed resume information
        target_job_title: Optional target job title to analyze against
        
    Returns:
        Dictionary containing analysis results and suggestions
    """
    try:
        # Get sample jobs for the target role if specified
        sample_jobs = []
        if target_job_title:
            sample_jobs = job_scraper.get_jobs(
                keywords=[target_job_title],
                sources=['mock'],
                max_jobs=5
            )
        
        # Extract skills from sample jobs
        target_skills = set()
        for job in sample_jobs:
            job_skills = job_matcher._extract_skills_from_text(job['description'])
            target_skills.update(job_skills)
        
        # Get resume skills
        resume_skills = set(resume_data.get('skills', []))
        
        # Calculate missing skills
        missing_skills = target_skills - resume_skills
        
        # Generate suggestions
        suggestions = []
        
        if missing_skills:
            suggestions.append({
                "type": "missing_skills",
                "title": "Skills to Consider Adding",
                "description": f"Based on {target_job_title or 'similar roles'}, consider adding experience with:",
                "items": list(missing_skills)[:5]  # Top 5 missing skills
            })
        
        # Analyze experience section
        if resume_data.get('experience'):
            exp_suggestions = []
            for exp in resume_data['experience']:
                if isinstance(exp, dict):
                    # Check if experience descriptions are detailed enough
                    if exp.get('description') and len(exp['description'].split()) < 50:
                        exp_suggestions.append(
                            f"Consider adding more details about your role at {exp.get('company', '')}"
                        )
            
            if exp_suggestions:
                suggestions.append({
                    "type": "experience",
                    "title": "Experience Enhancement Suggestions",
                    "description": "Consider improving your experience descriptions:",
                    "items": exp_suggestions
                })
        
        return {
            "status": "success",
            "data": {
                "resume_skills": list(resume_skills),
                "target_skills": list(target_skills) if target_job_title else None,
                "missing_skills": list(missing_skills),
                "suggestions": suggestions
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing resume: {str(e)}"
        ) 