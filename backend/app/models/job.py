from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class JobSkill(BaseModel):
    name: str
    category: Optional[str] = None  # required, preferred, etc.
    importance: Optional[float] = None  # 0-1 score for skill importance

class JobListing(BaseModel):
    id: Optional[str] = None
    title: str
    company: str
    location: Optional[str] = None
    remote: Optional[bool] = False
    description: str
    skills: List[JobSkill] = []
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    experience_level: Optional[str] = None  # entry, mid, senior
    job_type: Optional[str] = None  # full-time, part-time, contract
    url: Optional[str] = None
    posted_date: Optional[datetime] = None
    source: Optional[str] = None  # LinkedIn, Indeed, etc.
    created_at: datetime = Field(default_factory=datetime.now)

class JobMatch(BaseModel):
    job: JobListing
    match_score: float  # 0-100 percentage match
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    match_reasoning: str  # Explanation of why this job matches
    best_fit: bool = False  # Whether this is a "best fit" job
