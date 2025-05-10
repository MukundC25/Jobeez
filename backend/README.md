# Jobeez Backend

This is the backend for the Jobeez application, a Resume Parser and Job Matcher.

## Features

- Resume parsing from PDF and DOCX files
- Skill extraction using NLP
- Job listing retrieval
- Resume-job matching with scoring
- Resume improvement suggestions

## Tech Stack

- FastAPI
- PyMuPDF for PDF parsing
- spaCy for NLP
- Sentence Transformers for semantic matching
- MongoDB (configured but using mock data for demo)

## Setup

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download spaCy model:
```bash
python -m spacy download en_core_web_lg
```

### Running the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## API Endpoints

### Resume Endpoints

- `POST /api/resume/upload` - Upload and parse a resume
- `GET /api/resume/{resume_id}` - Get a parsed resume
- `GET /api/resume/{resume_id}/improvement` - Get resume improvement suggestions

### Job Endpoints

- `GET /api/jobs` - Get job listings
- `GET /api/jobs/{job_id}` - Get a specific job

### Matching Endpoints

- `GET /api/matching/{resume_id}/jobs` - Match a resume to jobs

## Docker

You can also run the backend using Docker:

```bash
docker build -t jobeez-backend .
docker run -p 8000:8000 jobeez-backend
```
