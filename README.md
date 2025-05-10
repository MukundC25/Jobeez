# Jobeez - Resume Parser + Job Matcher

Jobeez is an AI-powered application that parses resumes, extracts skills and experience, and matches them with job listings to find the best opportunities for job seekers.

## Features

- **Resume Parsing**: Upload PDF/DOCX resumes and extract structured information
- **Skill Extraction**: Identify technical and soft skills using NLP
- **Job Matching**: Match resumes to jobs with detailed scoring
- **Resume Improvement**: Get personalized suggestions to improve your resume
- **Match Reasoning**: Understand why a job was matched to your profile

## Tech Stack

### Backend
- FastAPI (Python)
- PyMuPDF for PDF parsing
- spaCy and skillNer for NLP
- Sentence Transformers for semantic matching

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

## Project Structure

```
jobeez/
├── backend/             # FastAPI backend
│   ├── app/             # Application code
│   │   ├── data/        # Mock data
│   │   ├── models/      # Pydantic models
│   │   ├── routers/     # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   ├── Dockerfile       # Backend Docker configuration
│   └── requirements.txt # Python dependencies
│
└── frontend/            # React frontend
    ├── public/          # Static files
    ├── src/             # Source code
    │   ├── assets/      # Images and other assets
    │   ├── components/  # Reusable components
    │   ├── pages/       # Page components
    │   └── services/    # API services
    ├── index.html       # HTML entry point
    └── package.json     # Node.js dependencies
```

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 14+
- npm or yarn
- Docker and Docker Compose (optional, for containerized setup)

### Option 1: Using the Run Script (Recommended for Development)

The run script creates an isolated environment with custom ports to avoid conflicts with other applications.

1. Make the script executable:
```bash
chmod +x run.sh
```

2. Run the application:
```bash
./run.sh
```

This will:
- Create an isolated Python virtual environment
- Install all dependencies
- Start the backend on port 8765
- Start the frontend on port 5200
- Set up proper environment variables for communication

The application will be available at:
- Frontend: http://localhost:5200
- Backend API: http://localhost:8765

### Option 2: Using Docker Compose (Recommended for Isolation)

For complete isolation from your system:

```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:5200
- Backend API: http://localhost:8765

### Option 3: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Download spaCy model:
```bash
python -m spacy download en_core_web_lg
```

5. Set environment variables:
```bash
export JOBEEZ_BACKEND_PORT=8765
export JOBEEZ_FRONTEND_PORT=5200
```

6. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8765
```

The API will be available at http://localhost:8765

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables:
```bash
export JOBEEZ_BACKEND_PORT=8765
export JOBEEZ_FRONTEND_PORT=5200
```

4. Start the development server:
```bash
npm run dev -- --port 5200
```

The application will be available at http://localhost:5200

## Usage

1. Upload your resume (PDF or DOCX format)
2. View the parsed information
3. Find job matches based on your skills and experience
4. Get personalized suggestions to improve your resume

## Unique Features

- **AI-Powered Feedback**: Get specific suggestions to improve your job match score
- **Soft Skill Extraction**: Match culture-fit jobs using BERT
- **Job Match Reasoning**: Understand why a job was scored as a good match
- **"Best-fit" Identification**: Highlight exceptional matches using cosine similarity
