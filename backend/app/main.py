from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, jobs, matching
import os

# Get port from environment variable or use default
PORT = int(os.getenv("JOBEEZ_BACKEND_PORT", 8765))

app = FastAPI(
    title="Jobeez API",
    description="Resume Parser and Job Matcher API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"http://localhost:{os.getenv('JOBEEZ_FRONTEND_PORT', '5200')}"],  # Only allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(matching.router, prefix="/api/matching", tags=["Matching"])

@app.get("/")
async def root():
    return {"message": f"Welcome to Jobeez API - Resume Parser and Job Matcher (Running on port {PORT})"}

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "Backend server is running"}
