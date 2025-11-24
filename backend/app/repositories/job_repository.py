"""
Repository for Job database operations
"""
from typing import Optional, List
from datetime import datetime
from app.models.job import JobListing
from app.database import get_database
import logging

logger = logging.getLogger(__name__)

class JobRepository:
    def __init__(self):
        self.collection_name = "jobs"
    
    async def create(self, job: JobListing) -> JobListing:
        """Create a new job in the database"""
        try:
            db = get_database()
            job_dict = job.model_dump()
            job_dict["created_at"] = datetime.now()
            
            result = await db[self.collection_name].insert_one(job_dict)
            job_dict["_id"] = str(result.inserted_id)
            
            logger.info(f"Created job with ID: {job.id}")
            return JobListing(**job_dict)
        except Exception as e:
            logger.error(f"Error creating job: {e}")
            raise
    
    async def create_many(self, jobs: List[JobListing]) -> int:
        """Bulk create jobs"""
        try:
            db = get_database()
            job_dicts = [job.model_dump() for job in jobs]
            
            for job_dict in job_dicts:
                job_dict["created_at"] = datetime.now()
            
            result = await db[self.collection_name].insert_many(job_dicts)
            logger.info(f"Created {len(result.inserted_ids)} jobs")
            return len(result.inserted_ids)
        except Exception as e:
            logger.error(f"Error bulk creating jobs: {e}")
            raise
    
    async def get_by_id(self, job_id: str) -> Optional[JobListing]:
        """Get a job by ID"""
        try:
            db = get_database()
            job_dict = await db[self.collection_name].find_one({"id": job_id})
            
            if job_dict:
                job_dict.pop("_id", None)
                return JobListing(**job_dict)
            return None
        except Exception as e:
            logger.error(f"Error getting job {job_id}: {e}")
            raise
    
    async def list_all(self, skip: int = 0, limit: int = 100) -> List[JobListing]:
        """List all jobs with pagination"""
        try:
            db = get_database()
            cursor = db[self.collection_name].find().skip(skip).limit(limit).sort("posted_date", -1)
            
            jobs = []
            async for job_dict in cursor:
                job_dict.pop("_id", None)
                jobs.append(JobListing(**job_dict))
            
            return jobs
        except Exception as e:
            logger.error(f"Error listing jobs: {e}")
            raise
    
    async def search(self, 
                    title: Optional[str] = None,
                    company: Optional[str] = None,
                    location: Optional[str] = None,
                    remote: Optional[bool] = None,
                    skip: int = 0, 
                    limit: int = 100) -> List[JobListing]:
        """Search jobs with filters"""
        try:
            db = get_database()
            
            # Build query
            query = {}
            if title:
                query["title"] = {"$regex": title, "$options": "i"}
            if company:
                query["company"] = {"$regex": company, "$options": "i"}
            if location:
                query["location"] = {"$regex": location, "$options": "i"}
            if remote is not None:
                query["remote"] = remote
            
            cursor = db[self.collection_name].find(query).skip(skip).limit(limit).sort("posted_date", -1)
            
            jobs = []
            async for job_dict in cursor:
                job_dict.pop("_id", None)
                jobs.append(JobListing(**job_dict))
            
            return jobs
        except Exception as e:
            logger.error(f"Error searching jobs: {e}")
            raise
    
    async def delete_old_jobs(self, days: int = 30) -> int:
        """Delete jobs older than specified days"""
        try:
            db = get_database()
            cutoff_date = datetime.now() - datetime.timedelta(days=days)
            
            result = await db[self.collection_name].delete_many({
                "posted_date": {"$lt": cutoff_date}
            })
            
            logger.info(f"Deleted {result.deleted_count} old jobs")
            return result.deleted_count
        except Exception as e:
            logger.error(f"Error deleting old jobs: {e}")
            raise
    
    async def count(self) -> int:
        """Count total jobs"""
        try:
            db = get_database()
            count = await db[self.collection_name].count_documents({})
            return count
        except Exception as e:
            logger.error(f"Error counting jobs: {e}")
            raise
