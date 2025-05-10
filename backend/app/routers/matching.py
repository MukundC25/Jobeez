from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.job import JobMatch
from app.services.matching_service import MatchingService
from app.routers.resume import resumes

router = APIRouter()
matching_service = MatchingService()

@router.get("/{resume_id}/jobs", response_model=List[JobMatch])
async def match_resume_to_jobs(
    resume_id: str,
    limit: int = Query(10, ge=1, le=50)
):
    """Match a resume to jobs and return top matches"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume = resumes[resume_id]
    
    # Match resume to jobs
    job_matches = await matching_service.match_resume_to_jobs(resume, limit=limit)
    
    return job_matches
