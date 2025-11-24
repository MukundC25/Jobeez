from fastapi import APIRouter, HTTPException, Query
from typing import List
import logging
from app.models.job import JobMatch
from app.services.matching_service import MatchingService
from app.repositories.resume_repository import ResumeRepository
from app.routers.resume import resumes_cache

logger = logging.getLogger(__name__)

router = APIRouter()
matching_service = MatchingService()
resume_repository = ResumeRepository()

@router.get("/{resume_id}/jobs", response_model=List[JobMatch])
async def match_resume_to_jobs(
    resume_id: str,
    limit: int = Query(10, ge=1, le=50)
):
    """Match a resume to jobs and return top matches"""
    # Try to get resume from database first, then cache
    resume = None
    try:
        resume = await resume_repository.get_by_id(resume_id)
    except Exception as e:
        logger.warning(f"Database error, checking cache: {e}")
    
    if not resume and resume_id in resumes_cache:
        resume = resumes_cache[resume_id]
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Match resume to jobs
    job_matches = await matching_service.match_resume_to_jobs(resume, limit=limit)
    
    return job_matches
