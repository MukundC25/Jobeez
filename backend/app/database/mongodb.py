"""
MongoDB database connection and configuration
"""
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Connect to MongoDB"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    mongodb_name = os.getenv("MONGODB_NAME", "jobeez")
    
    try:
        logger.info(f"Connecting to MongoDB at {mongodb_url}")
        mongodb.client = AsyncIOMotorClient(mongodb_url)
        mongodb.db = mongodb.client[mongodb_name]
        
        # Test connection
        await mongodb.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB connection"""
    if mongodb.client:
        mongodb.client.close()
        logger.info("Closed MongoDB connection")

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Resume indexes
        await mongodb.db.resumes.create_index("id", unique=True)
        await mongodb.db.resumes.create_index("created_at")
        await mongodb.db.resumes.create_index([("skills.name", "text"), ("name", "text")])
        
        # Job indexes
        await mongodb.db.jobs.create_index("id", unique=True)
        await mongodb.db.jobs.create_index("title")
        await mongodb.db.jobs.create_index("company")
        await mongodb.db.jobs.create_index("location")
        await mongodb.db.jobs.create_index("posted_date")
        await mongodb.db.jobs.create_index([("title", "text"), ("description", "text"), ("company", "text")])
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Failed to create indexes: {e}")

def get_database():
    """Get database instance"""
    return mongodb.db
