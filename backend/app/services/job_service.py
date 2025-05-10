import requests
from bs4 import BeautifulSoup
import json
from typing import List, Dict, Any, Optional
import os
from datetime import datetime
from app.models.job import JobListing, JobSkill

class JobService:
    def __init__(self):
        # For demo purposes, we'll use mock data
        # In a real app, you'd connect to APIs or scrape job sites
        self.mock_data_path = os.path.join(os.path.dirname(__file__), "../data/mock_jobs.json")
        
    async def get_job_listings(self, limit: int = 50, offset: int = 0) -> List[JobListing]:
        """Get job listings from mock data or API"""
        # In a real app, you'd implement API calls or web scraping here
        # For demo, we'll use mock data
        jobs = self._load_mock_data()
        
        # Apply pagination
        paginated_jobs = jobs[offset:offset+limit]
        
        # Convert to JobListing objects
        job_listings = []
        for job in paginated_jobs:
            skills = [JobSkill(name=skill["name"], 
                              category=skill.get("category"),
                              importance=skill.get("importance", 0.5)) 
                     for skill in job.get("skills", [])]
            
            job_listing = JobListing(
                id=job.get("id"),
                title=job.get("title", ""),
                company=job.get("company", ""),
                location=job.get("location"),
                remote=job.get("remote", False),
                description=job.get("description", ""),
                skills=skills,
                salary_min=job.get("salary_min"),
                salary_max=job.get("salary_max"),
                experience_level=job.get("experience_level"),
                job_type=job.get("job_type"),
                url=job.get("url"),
                posted_date=datetime.fromisoformat(job.get("posted_date")) if job.get("posted_date") else None,
                source=job.get("source")
            )
            job_listings.append(job_listing)
        
        return job_listings
    
    async def get_job_by_id(self, job_id: str) -> Optional[JobListing]:
        """Get a specific job by ID"""
        jobs = self._load_mock_data()
        
        for job in jobs:
            if job.get("id") == job_id:
                skills = [JobSkill(name=skill["name"], 
                                  category=skill.get("category"),
                                  importance=skill.get("importance", 0.5)) 
                         for skill in job.get("skills", [])]
                
                return JobListing(
                    id=job.get("id"),
                    title=job.get("title", ""),
                    company=job.get("company", ""),
                    location=job.get("location"),
                    remote=job.get("remote", False),
                    description=job.get("description", ""),
                    skills=skills,
                    salary_min=job.get("salary_min"),
                    salary_max=job.get("salary_max"),
                    experience_level=job.get("experience_level"),
                    job_type=job.get("job_type"),
                    url=job.get("url"),
                    posted_date=datetime.fromisoformat(job.get("posted_date")) if job.get("posted_date") else None,
                    source=job.get("source")
                )
        
        return None
    
    def _load_mock_data(self) -> List[Dict[str, Any]]:
        """Load mock job data"""
        # Check if mock data file exists
        if not os.path.exists(self.mock_data_path):
            # Create mock data directory if it doesn't exist
            os.makedirs(os.path.dirname(self.mock_data_path), exist_ok=True)
            
            # Generate mock data
            mock_data = self._generate_mock_data()
            
            # Save mock data
            with open(self.mock_data_path, "w") as f:
                json.dump(mock_data, f, indent=2)
            
            return mock_data
        
        # Load existing mock data
        with open(self.mock_data_path, "r") as f:
            return json.load(f)
    
    def _generate_mock_data(self) -> List[Dict[str, Any]]:
        """Generate mock job data"""
        # Sample job titles and companies
        job_titles = [
            "Software Engineer", "Data Scientist", "Frontend Developer", 
            "Backend Developer", "Full Stack Developer", "DevOps Engineer",
            "Machine Learning Engineer", "Product Manager", "UX Designer",
            "Data Analyst", "Cloud Architect", "Mobile Developer"
        ]
        
        companies = [
            "TechCorp", "DataWiz", "CodeMasters", "InnovateTech", 
            "CloudSolutions", "AIVentures", "WebFrontier", "MobileTech",
            "AnalyticsHub", "SoftwareSolutions", "TechStartup", "BigTechCo"
        ]
        
        locations = [
            "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
            "Boston, MA", "Remote", "Chicago, IL", "Los Angeles, CA",
            "Denver, CO", "Atlanta, GA", "Portland, OR", "Miami, FL"
        ]
        
        # Technical skills by category
        tech_skills = {
            "Programming Languages": ["Python", "JavaScript", "Java", "C++", "TypeScript", "Go", "Ruby", "PHP", "Swift", "Kotlin"],
            "Web Development": ["React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "HTML", "CSS", "Bootstrap", "Tailwind CSS"],
            "Data Science": ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "PyTorch", "R", "MATLAB", "Tableau", "Power BI", "SQL"],
            "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "GitLab CI", "Terraform", "Ansible", "Prometheus"],
            "Databases": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "DynamoDB", "Cassandra", "SQLite", "Oracle", "SQL Server"],
            "Mobile": ["React Native", "Flutter", "iOS", "Android", "Xamarin", "Swift", "Kotlin", "Objective-C", "Mobile UI Design"],
            "Other": ["Git", "RESTful APIs", "GraphQL", "Microservices", "Agile", "Scrum", "Jira", "CI/CD", "Testing", "Debugging"]
        }
        
        # Soft skills
        soft_skills = [
            "Communication", "Teamwork", "Problem Solving", "Critical Thinking", 
            "Time Management", "Adaptability", "Leadership", "Creativity",
            "Attention to Detail", "Collaboration", "Presentation Skills"
        ]
        
        # Generate 50 mock jobs
        mock_jobs = []
        for i in range(1, 51):
            # Select random job title and company
            import random
            title_index = random.randint(0, len(job_titles) - 1)
            company_index = random.randint(0, len(companies) - 1)
            location_index = random.randint(0, len(locations) - 1)
            
            # Generate random skills
            skills = []
            
            # Add technical skills
            for category, category_skills in tech_skills.items():
                # Add 3-7 skills from each category with 30% probability
                if random.random() < 0.3:
                    num_skills = random.randint(1, min(5, len(category_skills)))
                    selected_skills = random.sample(category_skills, num_skills)
                    
                    for skill in selected_skills:
                        skills.append({
                            "name": skill,
                            "category": "technical",
                            "importance": round(random.uniform(0.5, 1.0), 2)
                        })
            
            # Add soft skills
            num_soft_skills = random.randint(2, 5)
            selected_soft_skills = random.sample(soft_skills, num_soft_skills)
            for skill in selected_soft_skills:
                skills.append({
                    "name": skill,
                    "category": "soft",
                    "importance": round(random.uniform(0.3, 0.8), 2)
                })
            
            # Generate random salary range
            base_salary = random.randint(60, 150) * 1000
            salary_range = random.randint(10, 40) * 1000
            
            # Generate random experience level
            experience_levels = ["Entry Level", "Mid Level", "Senior Level"]
            experience_level = random.choice(experience_levels)
            
            # Generate random job type
            job_types = ["Full-time", "Part-time", "Contract", "Freelance"]
            job_type = random.choice(job_types)
            
            # Generate random posted date (within last 30 days)
            import datetime
            today = datetime.datetime.now()
            days_ago = random.randint(0, 30)
            posted_date = (today - datetime.timedelta(days=days_ago)).isoformat()
            
            # Generate job description
            description = f"""
{companies[company_index]} is seeking a talented {job_titles[title_index]} to join our team. 
The ideal candidate will have experience with {', '.join([skill['name'] for skill in skills[:3]])}.

Responsibilities:
• Design, develop, and maintain software applications
• Collaborate with cross-functional teams to define and implement solutions
• Write clean, efficient, and well-documented code
• Troubleshoot and debug applications
• Stay up-to-date with emerging trends and technologies

Requirements:
• {experience_level} experience in software development
• Proficiency in {', '.join([skill['name'] for skill in skills[3:6] if len(skills) > 5])}
• Strong problem-solving skills and attention to detail
• Excellent communication and teamwork abilities
• Bachelor's degree in Computer Science or related field (or equivalent experience)

Benefits:
• Competitive salary
• Health, dental, and vision insurance
• 401(k) matching
• Flexible work arrangements
• Professional development opportunities
• Collaborative and innovative work environment
            """
            
            # Create job listing
            job = {
                "id": f"job-{i}",
                "title": job_titles[title_index],
                "company": companies[company_index],
                "location": locations[location_index],
                "remote": "Remote" in locations[location_index],
                "description": description.strip(),
                "skills": skills,
                "salary_min": base_salary,
                "salary_max": base_salary + salary_range,
                "experience_level": experience_level,
                "job_type": job_type,
                "url": f"https://example.com/jobs/job-{i}",
                "posted_date": posted_date,
                "source": random.choice(["LinkedIn", "Indeed", "Glassdoor", "Company Website"])
            }
            
            mock_jobs.append(job)
        
        return mock_jobs
