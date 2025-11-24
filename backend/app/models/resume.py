from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class Education(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    company: str
    title: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    skills_used: Optional[List[str]] = None

class Skill(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    name: str
    category: Optional[str] = None  # technical, soft, etc.
    level: Optional[str] = None  # beginner, intermediate, expert

class Contact(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None

class Resume(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
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
    model_config = ConfigDict(from_attributes=True)
    
    missing_skills: List[str] = []
    improvement_score: float  # Percentage improvement if skills are added
    formatting_suggestions: List[str] = []
    content_suggestions: List[str] = []
