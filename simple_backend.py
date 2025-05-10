"""
Simple backend server for Jobeez that provides basic API endpoints without complex dependencies.
This is a fallback server that can be used when the full backend is not available.
"""

import json
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import parse_qs, urlparse
from http import HTTPStatus

PORT = 8765
UPLOAD_DIR = "uploads"

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Sample data for mock responses
MOCK_DATA = {
    "resume": {
        "name": "John Doe",
        "contact": {
            "email": "john.doe@example.com",
            "phone": "123-456-7890",
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe"
        },
        "summary": "Experienced software developer with expertise in React, Node.js, and Python.",
        "skills": [
            {"name": "JavaScript"},
            {"name": "React"},
            {"name": "Node.js"},
            {"name": "Python"},
            {"name": "FastAPI"},
            {"name": "Machine Learning"}
        ],
        "experience": [
            {
                "company": "Tech Company",
                "title": "Senior Developer",
                "start_date": "Jan 2020",
                "end_date": "Present",
                "description": "• Developed and maintained web applications\n• Led a team of 5 developers\n• Implemented CI/CD pipelines"
            },
            {
                "company": "Startup Inc",
                "title": "Full Stack Developer",
                "start_date": "Jun 2018",
                "end_date": "Dec 2019",
                "description": "• Built RESTful APIs\n• Developed frontend using React\n• Worked with MongoDB and PostgreSQL"
            }
        ],
        "education": [
            {
                "institution": "University of Technology",
                "degree": "Bachelor of Science in Computer Science",
                "start_date": "2014",
                "end_date": "2018"
            }
        ]
    },
    "jobs": [
        {
            "id": "job-1",
            "title": "Senior Frontend Developer",
            "company": "Tech Giants Inc.",
            "location": "San Francisco, CA",
            "description": "We are looking for an experienced Frontend Developer with React expertise.",
            "requirements": "5+ years of experience with React, JavaScript, and modern frontend frameworks."
        },
        {
            "id": "job-2",
            "title": "Full Stack Developer",
            "company": "Innovative Startup",
            "location": "Remote",
            "description": "Join our team to build cutting-edge web applications.",
            "requirements": "Experience with React, Node.js, and Python required."
        },
        {
            "id": "job-3",
            "title": "Machine Learning Engineer",
            "company": "AI Solutions",
            "location": "Boston, MA",
            "description": "Help us build the next generation of ML-powered applications.",
            "requirements": "Strong Python skills and experience with ML frameworks."
        }
    ],
    "job_matches": [
        {
            "id": "job-1",
            "title": "Senior Frontend Developer",
            "company": "Tech Giants Inc.",
            "location": "San Francisco, CA",
            "description": "We are looking for an experienced Frontend Developer with React expertise.",
            "requirements": "5+ years of experience with React, JavaScript, and modern frontend frameworks.",
            "match_score": 92,
            "matched_skills": ["React", "JavaScript", "Node.js"]
        },
        {
            "id": "job-2",
            "title": "Full Stack Developer",
            "company": "Innovative Startup",
            "location": "Remote",
            "description": "Join our team to build cutting-edge web applications.",
            "requirements": "Experience with React, Node.js, and Python required.",
            "match_score": 85,
            "matched_skills": ["React", "Node.js", "Python"]
        },
        {
            "id": "job-3",
            "title": "Machine Learning Engineer",
            "company": "AI Solutions",
            "location": "Boston, MA",
            "description": "Help us build the next generation of ML-powered applications.",
            "requirements": "Strong Python skills and experience with ML frameworks.",
            "match_score": 78,
            "matched_skills": ["Python", "Machine Learning"]
        }
    ]
}

class JoBeezHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self, status_code=200, content_type='application/json'):
        self.send_response(status_code)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Health check endpoint
        if path == '/api/health':
            self._set_headers()
            self.wfile.write(json.dumps({"status": "ok", "message": "Simple backend server is running"}).encode())
            return
            
        # Get jobs endpoint
        elif path == '/api/jobs':
            self._set_headers()
            self.wfile.write(json.dumps(MOCK_DATA["jobs"]).encode())
            return
            
        # Get job matches endpoint
        elif path.startswith('/api/resume/') and path.endswith('/matches'):
            self._set_headers()
            self.wfile.write(json.dumps(MOCK_DATA["job_matches"]).encode())
            return
            
        # Get resume details endpoint
        elif path.startswith('/api/resume/') and not path.endswith('/matches') and not path.endswith('/improvement'):
            self._set_headers()
            self.wfile.write(json.dumps(MOCK_DATA["resume"]).encode())
            return
            
        # Get resume improvement endpoint
        elif path.startswith('/api/resume/') and path.endswith('/improvement'):
            self._set_headers()
            self.wfile.write(json.dumps({
                "improvements": [
                    "Consider adding more specific achievements with metrics",
                    "Add more technical skills relevant to your target roles",
                    "Expand on your education section with relevant coursework"
                ]
            }).encode())
            return
            
        # Default response for unknown endpoints
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())
            return

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        
        # Resume upload endpoint
        if self.path == '/api/resume/upload':
            try:
                # For simplicity, we're not actually processing the file
                # Just return a success response with a mock resume ID
                self._set_headers()
                self.wfile.write(json.dumps({"id": "mock-resume-123", "message": "Resume uploaded successfully"}).encode())
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return
            
        # Default response for unknown endpoints
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode())
            return

def run_server():
    with socketserver.TCPServer(("", PORT), JoBeezHandler) as httpd:
        print(f"Simple backend server running at http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run_server()
