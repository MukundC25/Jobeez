from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List
import os
import uuid
from app.services.resume_parser import ResumeParser
from app.models.resume import Resume, ResumeImprovement
from app.services.matching_service import MatchingService

router = APIRouter()
resume_parser = ResumeParser()
matching_service = MatchingService()

# In-memory storage for demo purposes
# In a real app, you'd use a database
resumes = {}

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
        
        # Store resume
        resumes[resume.id] = resume
        
        return resume
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing resume: {str(e)}")

@router.get("/{resume_id}", response_model=Resume)
async def get_resume(resume_id: str):
    """Get a parsed resume by ID"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return resumes[resume_id]

@router.get("/{resume_id}/improvement", response_model=ResumeImprovement)
async def get_resume_improvement(resume_id: str):
    """Get improvement suggestions for a resume"""
    if resume_id not in resumes:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    resume = resumes[resume_id]
    
    # Generate improvement suggestions
    suggestions = await matching_service.get_resume_improvement_suggestions(resume)
    
    return ResumeImprovement(
        missing_skills=suggestions["missing_skills"],
        improvement_score=suggestions["improvement_score"],
        formatting_suggestions=suggestions["formatting_suggestions"],
        content_suggestions=suggestions["content_suggestions"]
    )
