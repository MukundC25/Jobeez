"""
Database initialization and migration script
Run this to set up the database with initial data
"""
import asyncio
import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import connect_to_mongo, close_mongo_connection, get_database
from app.services.job_service import JobService
from app.models.job import JobListing
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def init_database():
    """Initialize database with sample data"""
    try:
        # Connect to MongoDB
        logger.info("Connecting to MongoDB...")
        await connect_to_mongo()
        
        db = get_database()
        
        # Check if jobs already exist
        jobs_count = await db.jobs.count_documents({})
        logger.info(f"Current jobs in database: {jobs_count}")
        
        if jobs_count == 0:
            logger.info("No jobs found, initializing with sample data...")
            
            # Get job service and load mock data
            job_service = JobService()
            jobs = await job_service.get_job_listings(limit=50)
            
            if jobs:
                # Insert jobs into database
                job_dicts = [job.model_dump() for job in jobs]
                result = await db.jobs.insert_many(job_dicts)
                logger.info(f"✓ Inserted {len(result.inserted_ids)} jobs into database")
            else:
                logger.warning("No jobs to insert")
        else:
            logger.info("✓ Database already has jobs")
        
        # Verify indexes
        logger.info("Verifying database indexes...")
        resume_indexes = await db.resumes.index_information()
        job_indexes = await db.jobs.index_information()
        
        logger.info(f"Resume indexes: {list(resume_indexes.keys())}")
        logger.info(f"Job indexes: {list(job_indexes.keys())}")
        
        logger.info("✓ Database initialization complete!")
        
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
        raise
    finally:
        await close_mongo_connection()

async def reset_database():
    """Reset database (WARNING: Deletes all data)"""
    try:
        logger.warning("⚠️  Resetting database - all data will be deleted!")
        
        # Connect to MongoDB
        await connect_to_mongo()
        db = get_database()
        
        # Drop collections
        await db.resumes.drop()
        await db.jobs.drop()
        logger.info("✓ Collections dropped")
        
        # Reinitialize
        await init_database()
        
    except Exception as e:
        logger.error(f"Error resetting database: {e}")
        raise
    finally:
        await close_mongo_connection()

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Database management script")
    parser.add_argument(
        "--reset",
        action="store_true",
        help="Reset database (WARNING: Deletes all data)"
    )
    
    args = parser.parse_args()
    
    if args.reset:
        print("⚠️  WARNING: This will delete all data!")
        confirm = input("Type 'yes' to confirm: ")
        if confirm.lower() == "yes":
            asyncio.run(reset_database())
        else:
            print("Reset cancelled")
    else:
        asyncio.run(init_database())
