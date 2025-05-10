from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    skills_used: Optional[List[str]] = None

class Skill(BaseModel):
    name: str
    category: Optional[str] = None  # technical, soft, etc.
    level: Optional[str] = None  # beginner, intermediate, expert

class Contact(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Resume(BaseModel):
    id: Optional[str] = None
    name: str
    contact: Contact
    summary: Optional[str] = None
    skills: List[Skill] = []
    experience: List[Experience] = []
    education: List[Education] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class ResumeImprovement(BaseModel):
    missing_skills: List[str] = []
    improvement_score: float  # Percentage improvement if skills are added
    formatting_suggestions: List[str] = []
    content_suggestions: List[str] = []
