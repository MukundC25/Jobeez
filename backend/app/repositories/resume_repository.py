"""
Repository for Resume database operations
"""
from typing import Optional, List
from datetime import datetime
from app.models.resume import Resume
from app.database import get_database
import logging

logger = logging.getLogger(__name__)

class ResumeRepository:
    def __init__(self):
        self.collection_name = "resumes"
    
    async def create(self, resume: Resume) -> Resume:
        """Create a new resume in the database"""
        try:
            db = get_database()
            resume_dict = resume.model_dump()
            resume_dict["created_at"] = datetime.now()
            resume_dict["updated_at"] = datetime.now()
            
            result = await db[self.collection_name].insert_one(resume_dict)
            resume_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Created resume with ID: {resume.id}")
            return Resume(**resume_dict)
        except Exception as e:
            logger.error(f"Error creating resume: {e}")
            raise
    
    async def get_by_id(self, resume_id: str) -> Optional[Resume]:
        """Get a resume by ID"""
        try:
            db = get_database()
            resume_dict = await db[self.collection_name].find_one({"id": resume_id})
            
            if resume_dict:
                resume_dict.pop("_id", None)
                return Resume(**resume_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting resume {resume_id}: {e}")
            raise
    
    async def update(self, resume_id: str, resume: Resume) -> Optional[Resume]:
        """Update a resume"""
        try:
            db = get_database()
            resume_dict = resume.model_dump()
            resume_dict["updated_at"] = datetime.now()
            
            result = await db[self.collection_name].update_one(
                {"id": resume_id},
                {"$set": resume_dict}
            )
            
            if result.modified_count > 0:
                logger.info(f"Updated resume with ID: {resume_id}")
                return await self.get_by_id(resume_id)
            return None
        except Exception as e:
            logger.error(f"Error updating resume {resume_id}: {e}")
            raise
    
    async def delete(self, resume_id: str) -> bool:
        """Delete a resume"""
        try:
            db = get_database()
            result = await db[self.collection_name].delete_one({"id": resume_id})
            
            if result.deleted_count > 0:
                logger.info(f"Deleted resume with ID: {resume_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Error deleting resume {resume_id}: {e}")
            raise
    
    async def list_all(self, skip: int = 0, limit: int = 100) -> List[Resume]:
        """List all resumes with pagination"""
        try:
            db = get_database()
            cursor = db[self.collection_name].find().skip(skip).limit(limit).sort("created_at", -1)
            
            resumes = []
            async for resume_dict in cursor:
                resume_dict.pop("_id", None)
                resumes.append(Resume(**resume_dict))
            
            return resumes
        except Exception as e:
            logger.error(f"Error listing resumes: {e}")
            raise
    
    async def search(self, query: str, skip: int = 0, limit: int = 100) -> List[Resume]:
        """Search resumes by text query"""
        try:
            db = get_database()
            cursor = db[self.collection_name].find(
                {"$text": {"$search": query}}
            ).skip(skip).limit(limit)
            
            resumes = []
            async for resume_dict in cursor:
                resume_dict.pop("_id", None)
                resumes.append(Resume(**resume_dict))
            
            return resumes
        except Exception as e:
            logger.error(f"Error searching resumes: {e}")
            raise
