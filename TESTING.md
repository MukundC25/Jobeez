# Testing Guide

## Quick Test Commands

### Test Backend Health

```bash
# Check if backend is running
curl http://localhost:9765/api/health

# Expected response:
# {"status": "healthy", "service": "Jobeez API", "version": "1.0.0"}
```

### Test Job API

```bash
# Get job listings
curl http://localhost:9765/api/jobs?limit=10

# Get specific job
curl http://localhost:9765/api/jobs/job-1
```

### Test Resume Upload

```bash
# Upload a resume (replace with actual file path)
curl -X POST http://localhost:9765/api/resume/upload \
  -F "file=@/path/to/resume.pdf"

# Response includes parsed resume with ID
```

### Test Job Matching

```bash
# Match resume to jobs (replace RESUME_ID with actual ID from upload)
curl http://localhost:9765/api/matching/RESUME_ID/jobs?limit=10
```

### Test Resume Improvement

```bash
# Get improvement suggestions
curl http://localhost:9765/api/resume/RESUME_ID/improvement
```

## MongoDB Testing

### Connect to MongoDB

```bash
# Using Docker
docker exec -it jobeez-mongodb mongosh

# Then in mongosh:
use jobeez
show collections
db.jobs.countDocuments()
db.resumes.countDocuments()
```

### Query Examples

```javascript
// In mongosh:

// Find all jobs
db.jobs.find().limit(5)

// Search jobs by title
db.jobs.find({ title: /software/i }).limit(5)

// Find remote jobs
db.jobs.find({ remote: true }).limit(5)

// Count jobs by company
db.jobs.aggregate([
  { $group: { _id: "$company", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
])

// Find all resumes
db.resumes.find().limit(5)

// Search resumes by skill
db.resumes.find({ "skills.name": "Python" })
```

## API Testing with Python

```python
import requests
import json

# Base URL
BASE_URL = "http://localhost:9765/api"

# Test health check
response = requests.get(f"{BASE_URL}/health")
print(f"Health: {response.json()}")

# Get jobs
response = requests.get(f"{BASE_URL}/jobs?limit=5")
jobs = response.json()
print(f"Found {len(jobs)} jobs")

# Upload resume
with open("sample_resume.pdf", "rb") as f:
    files = {"file": f}
    response = requests.post(f"{BASE_URL}/resume/upload", files=files)
    resume = response.json()
    print(f"Resume ID: {resume['id']}")
    
    # Match jobs
    resume_id = resume['id']
    response = requests.get(f"{BASE_URL}/matching/{resume_id}/jobs?limit=10")
    matches = response.json()
    
    for match in matches[:3]:
        print(f"\nJob: {match['job']['title']}")
        print(f"Company: {match['job']['company']}")
        print(f"Match Score: {match['match_score']}%")
        print(f"Matched Skills: {', '.join(match['matched_skills'][:5])}")
```

## Frontend Testing

### Manual Testing Steps

1. **Homepage Test**
   - Navigate to http://localhost:6200
   - Verify hero section displays
   - Check all animations work
   - Test navigation menu

2. **Resume Upload Test**
   - Click "Upload Resume Now"
   - Drag and drop a PDF/DOCX file
   - Verify parsing completes
   - Check extracted information displays

3. **Job Matching Test**
   - After uploading resume, view job matches
   - Verify match scores display
   - Check skill highlighting
   - Test job detail view

4. **Resume Improvement Test**
   - Navigate to improvement suggestions
   - Verify suggestions display
   - Check missing skills list

### Browser Console Tests

```javascript
// In browser console on http://localhost:6200

// Test API connection
fetch('http://localhost:9765/api/health')
  .then(r => r.json())
  .then(console.log)

// Test job fetching
fetch('http://localhost:9765/api/jobs?limit=5')
  .then(r => r.json())
  .then(data => console.log(`Found ${data.length} jobs`))
```

## Load Testing

### Using Apache Bench

```bash
# Install ab (usually comes with Apache)
# macOS: brew install apache2
# Linux: apt-get install apache2-utils

# Test health endpoint
ab -n 1000 -c 10 http://localhost:9765/api/health

# Test jobs endpoint
ab -n 500 -c 10 http://localhost:9765/api/jobs?limit=10
```

### Using Python locust

```bash
# Install locust
pip install locust

# Create locustfile.py:
```

```python
from locust import HttpUser, task, between

class JobeezUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def get_jobs(self):
        self.client.get("/api/jobs?limit=10")
    
    @task(1)
    def health_check(self):
        self.client.get("/api/health")
```

```bash
# Run load test
locust -f locustfile.py --host=http://localhost:9765
# Open http://localhost:8089 to view results
```

## Integration Testing

### Test Complete Flow

```bash
#!/bin/bash

echo "Testing complete job matching flow..."

# 1. Check health
echo "1. Health check..."
curl -s http://localhost:9765/api/health | jq .

# 2. Get jobs
echo -e "\n2. Fetching jobs..."
JOBS=$(curl -s http://localhost:9765/api/jobs?limit=5)
echo $JOBS | jq -r '.[0] | "First job: \(.title) at \(.company)"'

# 3. Upload resume (requires sample file)
echo -e "\n3. Uploading resume..."
if [ -f "sample_resume.pdf" ]; then
    RESUME=$(curl -s -X POST http://localhost:9765/api/resume/upload \
        -F "file=@sample_resume.pdf")
    RESUME_ID=$(echo $RESUME | jq -r '.id')
    echo "Resume ID: $RESUME_ID"
    
    # 4. Match jobs
    echo -e "\n4. Matching jobs..."
    MATCHES=$(curl -s "http://localhost:9765/api/matching/$RESUME_ID/jobs?limit=5")
    echo $MATCHES | jq -r '.[0] | "Best match: \(.job.title) - \(.match_score)%"'
    
    # 5. Get improvements
    echo -e "\n5. Getting improvement suggestions..."
    IMPROVEMENTS=$(curl -s "http://localhost:9765/api/resume/$RESUME_ID/improvement")
    echo $IMPROVEMENTS | jq -r '"Missing skills: \(.missing_skills[0:3] | join(", "))"'
else
    echo "sample_resume.pdf not found"
fi

echo -e "\n✓ Test complete!"
```

## Performance Benchmarks

Expected response times:

- Health check: < 10ms
- Get jobs (10 items): < 100ms
- Upload resume: < 2s (depends on file size)
- Match jobs: < 500ms
- Improvement suggestions: < 300ms

## Troubleshooting Tests

### Database Connection Test

```bash
# Test MongoDB connection
docker exec jobeez-mongodb mongosh --eval "db.adminCommand('ping')"

# Expected: { ok: 1 }
```

### Backend Logs

```bash
# View real-time logs
docker logs -f jobeez-backend

# Search for errors
docker logs jobeez-backend 2>&1 | grep -i error

# Search for specific endpoint
docker logs jobeez-backend 2>&1 | grep "/api/jobs"
```

### Network Test

```bash
# Test if services can reach each other
docker exec jobeez-backend ping -c 3 mongodb
docker exec jobeez-frontend curl -s http://backend:8000/api/health
```

## Automated Testing

### Backend Unit Tests (To be implemented)

```python
# tests/test_resume_parser.py
import pytest
from app.services.resume_parser import ResumeParser

def test_resume_parser():
    parser = ResumeParser()
    # Add test cases
```

### API Integration Tests (To be implemented)

```python
# tests/test_api.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## Continuous Monitoring

### Health Check Script

```bash
#!/bin/bash
# monitor.sh - Run periodically to check system health

check_service() {
    local service=$1
    local url=$2
    
    if curl -sf $url > /dev/null; then
        echo "✓ $service is healthy"
        return 0
    else
        echo "✗ $service is down"
        return 1
    fi
}

check_service "Backend" "http://localhost:9765/api/health"
check_service "Frontend" "http://localhost:6200"

# Check MongoDB
if docker exec jobeez-mongodb mongosh --eval "db.adminCommand('ping')" &>/dev/null; then
    echo "✓ MongoDB is healthy"
else
    echo "✗ MongoDB is down"
fi
```

## Test Data

### Sample Resume Data

Create `sample_data/sample_resume.json`:

```json
{
  "name": "John Doe",
  "contact": {
    "email": "john@example.com",
    "phone": "123-456-7890",
    "linkedin": "linkedin.com/in/johndoe"
  },
  "skills": [
    {"name": "Python"},
    {"name": "JavaScript"},
    {"name": "React"},
    {"name": "FastAPI"},
    {"name": "MongoDB"}
  ],
  "experience": [
    {
      "company": "Tech Corp",
      "title": "Senior Developer",
      "start_date": "2020-01",
      "end_date": "Present",
      "description": "Developed web applications"
    }
  ]
}
```

## Conclusion

Regular testing ensures:
- API endpoints work correctly
- Database operations are successful
- Frontend integrates properly with backend
- System performs under load
- Error handling works as expected

Run tests before deploying any changes!
