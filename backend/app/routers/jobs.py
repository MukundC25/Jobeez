from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.models.job import JobListing
from app.services.job_service import JobService

router = APIRouter()
job_service = JobService()

@router.get("/", response_model=List[JobListing])
async def get_jobs(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get job listings with pagination"""
    jobs = await job_service.get_job_listings(limit=limit, offset=offset)
    return jobs

@router.get("/{job_id}", response_model=JobListing)
async def get_job(job_id: str):
    """Get a specific job by ID"""
    job = await job_service.get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
