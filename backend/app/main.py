from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from .database import connect_to_mongo, close_mongo_connection
from .routers import jobs, resume, matching

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting up Jobeez API...")
    try:
        await connect_to_mongo()
        logger.info("MongoDB connected successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        logger.warning("Continuing without database connection - using fallback mode")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Jobeez API...")
    await close_mongo_connection()

app = FastAPI(
    title="Jobeez API",
    description="AI-Powered Resume Parser and Job Matcher",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:6200",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Jobeez API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Jobeez API",
        "version": "1.0.0"
    } 