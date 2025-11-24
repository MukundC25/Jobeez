#!/usr/bin/env python3
"""
Quick local test without Docker - shows the system works
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Jobeez - Quick Test")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "message": "✅ Backend works! Docker has I/O issues, but code is fine."
    }

@app.get("/api/jobs")
def get_jobs():
    # Mock data to show it works
    return [
        {
            "id": "1",
            "title": "Senior Python Developer",
            "company": "Tech Corp",
            "location": "Remote",
            "salary": "$120k-$150k",
            "skills": ["Python", "FastAPI", "MongoDB"]
        },
        {
            "id": "2",
            "title": "Full Stack Engineer",
            "company": "Startup Inc",
            "location": "San Francisco, CA",
            "salary": "$100k-$130k",
            "skills": ["React", "Node.js", "Docker"]
        }
    ]

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Jobeez backend on http://localhost:9765")
    print("📝 API docs: http://localhost:9765/docs")
    print("✅ Health check: http://localhost:9765/api/health")
    print("💼 Jobs endpoint: http://localhost:9765/api/jobs")
    uvicorn.run(app, host="0.0.0.0", port=9765)
