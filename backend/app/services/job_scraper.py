from typing import List, Dict, Optional
import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime
import time
from urllib.parse import urljoin

class JobScraper:
    def __init__(self):
        # Initialize headers for web scraping
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        # Load API keys from environment variables
        self.rapidapi_key = os.getenv('RAPIDAPI_KEY')
        
    def get_jobs(self, 
                 sources: List[str] = ['linkedin', 'indeed', 'remoteok'],
                 keywords: Optional[List[str]] = None,
                 location: Optional[str] = None,
                 max_jobs: int = 50) -> List[Dict]:
        """
        Fetch jobs from specified sources.
        
        Args:
            sources: List of sources to fetch from ('linkedin', 'indeed', 'remoteok')
            keywords: List of job keywords to search for
            location: Location to search in
            max_jobs: Maximum number of jobs to return
            
        Returns:
            List of job dictionaries
        """
        all_jobs = []
        
        for source in sources:
            try:
                if source == 'linkedin':
                    jobs = self._scrape_linkedin(keywords, location)
                elif source == 'indeed':
                    jobs = self._scrape_indeed(keywords, location)
                elif source == 'remoteok':
                    jobs = self._scrape_remoteok(keywords)
                elif source == 'rapidapi':
                    jobs = self._fetch_from_rapidapi(keywords, location)
                else:
                    continue
                    
                all_jobs.extend(jobs)
                
                # Break if we have enough jobs
                if len(all_jobs) >= max_jobs:
                    break
                    
            except Exception as e:
                print(f"Error fetching from {source}: {str(e)}")
                continue
                
        return all_jobs[:max_jobs]
    
    def _scrape_linkedin(self, keywords: Optional[List[str]], location: Optional[str]) -> List[Dict]:
        """Scrape jobs from LinkedIn."""
        # Note: This is a placeholder. LinkedIn's terms of service restrict scraping.
        # In production, you should use LinkedIn's official API.
        return []
    
    def _scrape_indeed(self, keywords: Optional[List[str]], location: Optional[str]) -> List[Dict]:
        """Scrape jobs from Indeed."""
        jobs = []
        base_url = "https://www.indeed.com/jobs"
        
        # Construct search URL
        params = {
            'q': ' '.join(keywords) if keywords else '',
            'l': location if location else '',
            'sort': 'date'
        }
        
        try:
            response = requests.get(base_url, params=params, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find job cards
            job_cards = soup.find_all('div', class_='job_seen_beacon')
            
            for card in job_cards:
                try:
                    title_elem = card.find('h2', class_='jobTitle')
                    company_elem = card.find('span', class_='companyName')
                    location_elem = card.find('div', class_='companyLocation')
                    description_elem = card.find('div', class_='job-snippet')
                    
                    if not all([title_elem, company_elem, location_elem]):
                        continue
                        
                    job = {
                        'title': title_elem.text.strip(),
                        'company': company_elem.text.strip(),
                        'location': location_elem.text.strip(),
                        'description': description_elem.text.strip() if description_elem else '',
                        'source': 'indeed',
                        'url': urljoin(base_url, title_elem.find('a')['href']),
                        'posted_date': datetime.now().isoformat()  # Indeed doesn't show exact dates
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing Indeed job card: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error scraping Indeed: {str(e)}")
            
        return jobs
    
    def _scrape_remoteok(self, keywords: Optional[List[str]]) -> List[Dict]:
        """Scrape jobs from RemoteOK."""
        jobs = []
        base_url = "https://remoteok.com/remote-dev-jobs"
        
        try:
            response = requests.get(base_url, headers=self.headers)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find job listings
            job_listings = soup.find_all('tr', class_='job')
            
            for listing in job_listings:
                try:
                    title_elem = listing.find('h2', itemprop='title')
                    company_elem = listing.find('h3', itemprop='name')
                    description_elem = listing.find('td', class_='description')
                    
                    if not all([title_elem, company_elem, description_elem]):
                        continue
                        
                    # Check if job matches keywords
                    if keywords:
                        job_text = f"{title_elem.text} {company_elem.text} {description_elem.text}".lower()
                        if not any(keyword.lower() in job_text for keyword in keywords):
                            continue
                    
                    job = {
                        'title': title_elem.text.strip(),
                        'company': company_elem.text.strip(),
                        'location': 'Remote',
                        'description': description_elem.text.strip(),
                        'source': 'remoteok',
                        'url': urljoin(base_url, listing.find('a', class_='preventLink')['href']),
                        'posted_date': datetime.now().isoformat()
                    }
                    
                    jobs.append(job)
                    
                except Exception as e:
                    print(f"Error parsing RemoteOK job listing: {str(e)}")
                    continue
                    
        except Exception as e:
            print(f"Error scraping RemoteOK: {str(e)}")
            
        return jobs
    
    def _fetch_from_rapidapi(self, keywords: Optional[List[str]], location: Optional[str]) -> List[Dict]:
        """Fetch jobs from RapidAPI's JSearch API."""
        if not self.rapidapi_key:
            return []
            
        jobs = []
        url = "https://jsearch.p.rapidapi.com/search"
        
        headers = {
            'X-RapidAPI-Key': self.rapidapi_key,
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
        
        try:
            params = {
                'query': ' '.join(keywords) if keywords else 'software engineer',
                'location': location if location else '',
                'page': '1',
                'num_pages': '1'
            }
            
            response = requests.get(url, headers=headers, params=params)
            data = response.json()
            
            if 'data' in data:
                for job in data['data']:
                    jobs.append({
                        'title': job.get('job_title', ''),
                        'company': job.get('employer_name', ''),
                        'location': job.get('job_city', '') + ', ' + job.get('job_country', ''),
                        'description': job.get('job_description', ''),
                        'source': 'rapidapi',
                        'url': job.get('job_apply_link', ''),
                        'posted_date': job.get('job_posted_at_timestamp', datetime.now().isoformat())
                    })
                    
        except Exception as e:
            print(f"Error fetching from RapidAPI: {str(e)}")
            
        return jobs
    
    def get_mock_jobs(self, count: int = 50) -> List[Dict]:
        """Generate mock job data for testing."""
        # Sample job titles and companies
        titles = [
            "Senior Software Engineer",
            "Full Stack Developer",
            "Data Scientist",
            "Machine Learning Engineer",
            "DevOps Engineer",
            "Frontend Developer",
            "Backend Developer",
            "Product Manager",
            "UX Designer",
            "Mobile Developer"
        ]
        
        companies = [
            "TechCorp",
            "InnovateAI",
            "DataFlow Systems",
            "CloudScale",
            "FutureTech",
            "SmartSolutions",
            "DigitalWave",
            "CodeCraft",
            "ByteBuilders",
            "TechTrends"
        ]
        
        locations = [
            "San Francisco, CA",
            "New York, NY",
            "Seattle, WA",
            "Austin, TX",
            "Boston, MA",
            "Remote",
            "Chicago, IL",
            "Denver, CO",
            "Portland, OR",
            "Miami, FL"
        ]
        
        skills = [
            "Python", "JavaScript", "React", "Node.js", "AWS",
            "Docker", "Kubernetes", "Machine Learning", "Data Science",
            "SQL", "NoSQL", "MongoDB", "PostgreSQL", "Redis",
            "GraphQL", "REST API", "CI/CD", "Git", "Agile"
        ]
        
        jobs = []
        for _ in range(count):
            # Generate random job requirements
            num_skills = min(5, len(skills))
            job_skills = skills[:num_skills]  # Use first n skills for simplicity
            
            job = {
                'title': titles[_ % len(titles)],
                'company': companies[_ % len(companies)],
                'location': locations[_ % len(locations)],
                'description': f"Looking for a {titles[_ % len(titles)]} to join our team. "
                             f"Required skills: {', '.join(job_skills)}. "
                             f"Experience with modern development practices and tools required.",
                'requirements': f"Requirements:\n"
                              f"- {num_skills}+ years of experience\n"
                              f"- Strong knowledge of {', '.join(job_skills)}\n"
                              f"- Bachelor's degree in Computer Science or related field\n"
                              f"- Experience with agile development methodologies",
                'source': 'mock',
                'url': f"https://example.com/jobs/{_ + 1}",
                'posted_date': datetime.now().isoformat()
            }
            jobs.append(job)
            
        return jobs 