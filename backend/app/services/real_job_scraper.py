"""
Real Job API Integration Service
Fetches jobs from multiple sources: RapidAPI (JSearch), Adzuna, and other job boards
"""
import os
import requests
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.models.job import JobListing, JobSkill

logger = logging.getLogger(__name__)

class RealJobScraper:
    def __init__(self):
        # RapidAPI JSearch credentials
        self.rapidapi_key = os.getenv("RAPIDAPI_KEY", "")
        self.rapidapi_host = "jsearch.p.rapidapi.com"
        
        # Adzuna API credentials (alternative)
        self.adzuna_app_id = os.getenv("ADZUNA_APP_ID", "")
        self.adzuna_app_key = os.getenv("ADZUNA_APP_KEY", "")
        
        self.use_mock_fallback = os.getenv("USE_MOCK_JOBS", "false").lower() == "true"
    
    async def search_jobs(self, 
                         query: str = "software developer",
                         location: str = "United States",
                         num_pages: int = 1,
                         remote_only: bool = False,
                         experience_level: Optional[str] = None) -> List[JobListing]:
        """
        Search for jobs using available APIs
        Falls back to mock data if APIs are not configured
        """
        if self.use_mock_fallback or not self.rapidapi_key:
            logger.warning("Using mock job data - configure RAPIDAPI_KEY for real data")
            return await self._get_mock_jobs()
        
        try:
            # Try RapidAPI JSearch first
            if self.rapidapi_key:
                jobs = await self._fetch_from_jsearch(query, location, num_pages, remote_only)
                if jobs:
                    return jobs
            
            # Fallback to Adzuna if available
            if self.adzuna_app_id and self.adzuna_app_key:
                jobs = await self._fetch_from_adzuna(query, location, num_pages)
                if jobs:
                    return jobs
            
            # If all APIs fail, use mock data
            logger.warning("All job APIs failed, using mock data")
            return await self._get_mock_jobs()
            
        except Exception as e:
            logger.error(f"Error fetching jobs: {e}")
            return await self._get_mock_jobs()
    
    async def _fetch_from_jsearch(self, 
                                  query: str, 
                                  location: str, 
                                  num_pages: int,
                                  remote_only: bool) -> List[JobListing]:
        """Fetch jobs from RapidAPI JSearch"""
        try:
            url = "https://jsearch.p.rapidapi.com/search"
            
            headers = {
                "X-RapidAPI-Key": self.rapidapi_key,
                "X-RapidAPI-Host": self.rapidapi_host
            }
            
            all_jobs = []
            
            for page in range(1, num_pages + 1):
                params = {
                    "query": f"{query} in {location}",
                    "page": str(page),
                    "num_pages": "1",
                    "date_posted": "month"  # Jobs from last month
                }
                
                if remote_only:
                    params["remote_jobs_only"] = "true"
                
                response = requests.get(url, headers=headers, params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    jobs_data = data.get("data", [])
                    
                    for job_data in jobs_data:
                        job = self._parse_jsearch_job(job_data)
                        if job:
                            all_jobs.append(job)
                    
                    logger.info(f"Fetched {len(jobs_data)} jobs from JSearch (page {page})")
                else:
                    logger.error(f"JSearch API error: {response.status_code}")
                    break
            
            return all_jobs
            
        except Exception as e:
            logger.error(f"Error fetching from JSearch: {e}")
            return []
    
    async def _fetch_from_adzuna(self, 
                                 query: str, 
                                 location: str, 
                                 num_pages: int) -> List[JobListing]:
        """Fetch jobs from Adzuna API"""
        try:
            # Adzuna uses country codes (e.g., 'us' for United States)
            country = "us"  # Default to US
            
            url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/{{}}"
            
            all_jobs = []
            
            for page in range(1, num_pages + 1):
                params = {
                    "app_id": self.adzuna_app_id,
                    "app_key": self.adzuna_app_key,
                    "results_per_page": 50,
                    "what": query,
                    "where": location,
                    "page": page
                }
                
                response = requests.get(url.format(page), params=params, timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    jobs_data = data.get("results", [])
                    
                    for job_data in jobs_data:
                        job = self._parse_adzuna_job(job_data)
                        if job:
                            all_jobs.append(job)
                    
                    logger.info(f"Fetched {len(jobs_data)} jobs from Adzuna (page {page})")
                else:
                    logger.error(f"Adzuna API error: {response.status_code}")
                    break
            
            return all_jobs
            
        except Exception as e:
            logger.error(f"Error fetching from Adzuna: {e}")
            return []
    
    def _parse_jsearch_job(self, job_data: Dict[str, Any]) -> Optional[JobListing]:
        """Parse job data from JSearch API"""
        try:
            # Extract skills from job description and requirements
            skills = self._extract_skills_from_text(
                job_data.get("job_description", "") + " " + 
                job_data.get("job_highlights", {}).get("Qualifications", [""])[0]
            )
            
            job = JobListing(
                id=job_data.get("job_id", ""),
                title=job_data.get("job_title", ""),
                company=job_data.get("employer_name", ""),
                location=job_data.get("job_city", "") + ", " + job_data.get("job_state", ""),
                remote=job_data.get("job_is_remote", False),
                description=job_data.get("job_description", ""),
                skills=skills,
                salary_min=job_data.get("job_min_salary"),
                salary_max=job_data.get("job_max_salary"),
                experience_level=self._parse_experience_level(job_data.get("job_required_experience", {})),
                job_type=job_data.get("job_employment_type", "Full-time"),
                url=job_data.get("job_apply_link", ""),
                posted_date=self._parse_date(job_data.get("job_posted_at_datetime_utc")),
                source="JSearch"
            )
            
            return job
            
        except Exception as e:
            logger.error(f"Error parsing JSearch job: {e}")
            return None
    
    def _parse_adzuna_job(self, job_data: Dict[str, Any]) -> Optional[JobListing]:
        """Parse job data from Adzuna API"""
        try:
            # Extract skills from description
            skills = self._extract_skills_from_text(job_data.get("description", ""))
            
            # Parse location
            location = job_data.get("location", {}).get("display_name", "")
            
            job = JobListing(
                id=str(job_data.get("id", "")),
                title=job_data.get("title", ""),
                company=job_data.get("company", {}).get("display_name", "Unknown"),
                location=location,
                remote="remote" in job_data.get("description", "").lower(),
                description=job_data.get("description", ""),
                skills=skills,
                salary_min=job_data.get("salary_min"),
                salary_max=job_data.get("salary_max"),
                job_type="Full-time",
                url=job_data.get("redirect_url", ""),
                posted_date=self._parse_date(job_data.get("created")),
                source="Adzuna"
            )
            
            return job
            
        except Exception as e:
            logger.error(f"Error parsing Adzuna job: {e}")
            return None
    
    def _extract_skills_from_text(self, text: str) -> List[JobSkill]:
        """Extract technical skills from job description"""
        if not text:
            return []
        
        # Common technical skills to look for
        skill_keywords = {
            "Programming Languages": ["Python", "JavaScript", "Java", "C++", "C#", "TypeScript", 
                                     "Go", "Ruby", "PHP", "Swift", "Kotlin", "Rust", "Scala", "R"],
            "Web Frameworks": ["React", "Angular", "Vue", "Node.js", "Django", "Flask", 
                              "Express", "Spring", "ASP.NET", "Laravel", "Rails"],
            "Databases": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", 
                         "DynamoDB", "Cassandra", "Oracle", "SQL Server"],
            "Cloud": ["AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes", 
                     "Terraform", "Jenkins", "CI/CD"],
            "Data Science": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", 
                           "Pandas", "NumPy", "Scikit-learn", "Data Analysis", "AI"],
            "Mobile": ["iOS", "Android", "React Native", "Flutter", "Xamarin", "Mobile Development"],
            "Other": ["Git", "REST API", "GraphQL", "Microservices", "Agile", "Scrum"]
        }
        
        text_lower = text.lower()
        found_skills = []
        
        for category, skills in skill_keywords.items():
            for skill in skills:
                if skill.lower() in text_lower:
                    found_skills.append(JobSkill(
                        name=skill,
                        category="technical",
                        importance=0.8
                    ))
        
        # Remove duplicates
        seen = set()
        unique_skills = []
        for skill in found_skills:
            if skill.name not in seen:
                seen.add(skill.name)
                unique_skills.append(skill)
        
        return unique_skills[:20]  # Limit to 20 skills
    
    def _parse_experience_level(self, exp_data: Dict[str, Any]) -> str:
        """Parse experience level from job data"""
        if not exp_data:
            return "Mid Level"
        
        years = exp_data.get("required_experience_in_months", 0) / 12
        
        if years <= 2:
            return "Entry Level"
        elif years <= 5:
            return "Mid Level"
        else:
            return "Senior Level"
    
    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime]:
        """Parse date string to datetime"""
        if not date_str:
            return datetime.now()
        
        try:
            # Try ISO format
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except:
            try:
                # Try other common formats
                return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%S")
            except:
                return datetime.now()
    
    async def _get_mock_jobs(self) -> List[JobListing]:
        """Fallback to mock jobs when APIs are unavailable"""
        from app.services.job_service import JobService
        job_service = JobService()
        return await job_service.get_job_listings(limit=50)
