from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
import os
import uuid
import logging
from app.services.resume_parser import ResumeParser
from app.models.resume import Resume, ResumeImprovement
from app.services.matching_service import MatchingService
from app.repositories.resume_repository import ResumeRepository

logger = logging.getLogger(__name__)

router = APIRouter()
resume_parser = ResumeParser()
matching_service = MatchingService()
resume_repository = ResumeRepository()

# Fallback in-memory storage if database is unavailable
resumes_cache = {}

@router.post("/upload", response_model=Resume)
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume file (PDF or DOCX)"""
    # Check file extension
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
    
    try:
        # Parse resume
        resume = await resume_parser.parse_resume(file.file, file.filename)
        
        # Generate ID
        resume.id = str(uuid.uuid4())
        
        # Try to store in database, fallback to cache
        try:
            stored_resume = await resume_repository.create(resume)
            logger.info(f"Resume {resume.id} stored in database")
            return stored_resume
        except Exception as db_error:
            logger.warning(f"Database unavailable, using cache: {db_error}")
            resumes_cache[resume.id] = resume
            return resume
        
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@router.get("/{resume_id}", response_model=Resume)
async def get_resume(resume_id: str):
    """Get a parsed resume by ID"""
    # Try database first, then cache
    try:
        resume = await resume_repository.get_by_id(resume_id)
        if resume:
            return resume
    except Exception as e:
        logger.warning(f"Database error, checking cache: {e}")
    
    # Check cache
    if resume_id in resumes_cache:
        return resumes_cache[resume_id]
    
    raise HTTPException(status_code=404, detail="Resume not found")

@router.get("/{resume_id}/improvement", response_model=ResumeImprovement)
async def get_resume_improvement(resume_id: str):
    """Get improvement suggestions for a resume"""
    # Try database first, then cache
    resume = None
    try:
        resume = await resume_repository.get_by_id(resume_id)
    except Exception as e:
        logger.warning(f"Database error, checking cache: {e}")
    
    if not resume and resume_id in resumes_cache:
        resume = resumes_cache[resume_id]
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Generate improvement suggestions
    suggestions = await matching_service.get_resume_improvement_suggestions(resume)
    
    return ResumeImprovement(
        missing_skills=suggestions["missing_skills"],
        improvement_score=suggestions["improvement_score"],
        formatting_suggestions=suggestions["formatting_suggestions"],
        content_suggestions=suggestions["content_suggestions"]
    )
