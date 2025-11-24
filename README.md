# Resume Parser & Job Matcher

A modern web application that helps job seekers find their perfect match by parsing resumes and matching them with relevant job listings using AI-powered algorithms.

## Features

- 📄 **Resume Parsing**
  - Supports PDF and DOCX formats
  - Extracts key information (name, contact, skills, experience, education)
  - Uses advanced NLP for accurate parsing
  - Persistent storage in MongoDB

- 🔍 **Job Matching**
  - Semantic matching using Sentence Transformers
  - Skill-based matching with cosine similarity
  - Detailed match scores and explanations
  - Missing skills analysis

- 💡 **Resume Analysis**
  - AI-powered improvement suggestions
  - Skill gap analysis
  - Experience enhancement recommendations
  - ATS-friendly formatting tips

- 📊 **Job Search**
  - Real job data from RapidAPI (JSearch) and Adzuna
  - Mock data fallback for testing
  - Location and keyword-based filtering
  - Detailed job listings with requirements
  - Automatic job caching in MongoDB

- 🗄️ **Data Persistence**
  - MongoDB integration for production use
  - Automatic database indexing
  - Full-text search capabilities
  - Graceful fallback to in-memory storage

## Tech Stack

### Backend
- FastAPI (Python web framework)
- spaCy (NLP and NER)
- Sentence Transformers (semantic matching)
- scikit-learn (similarity calculations)
- PyPDF2 (PDF parsing)
- python-docx (DOCX parsing)

### Frontend (Coming Soon)
- React.js
- Tailwind CSS
- Axios
- Modern UI components

## Quick Start

### Production Setup (Recommended)

Use the automated setup script:

```bash
./setup-production.sh
```

This will:
- Check prerequisites
- Configure environment variables
- Start MongoDB, Backend, and Frontend with Docker
- Run health checks

Access the application at: http://localhost:6200

### Manual Setup

See detailed instructions below or refer to [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for comprehensive documentation.

## Prerequisites
- Python 3.9+
- Node.js 14+ (for frontend)
- Docker and Docker Compose (recommended)
- MongoDB 7.0+ (included in Docker setup)
- (Optional) RapidAPI or Adzuna API keys for real job data

### Backend Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
python -m spacy download en_core_web_lg
```

3. Set up environment variables:
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your configuration:
# - MongoDB connection (default: mongodb://localhost:27017)
# - API keys for real job data (optional)
# - Feature flags
```

4. Start MongoDB:
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name jobeez-mongo mongo:7.0

# Or install MongoDB locally
# See: https://www.mongodb.com/docs/manual/installation/
```

5. Run the backend server:
```bash
uvicorn app.main:app --reload --port 9765
```

The API will be available at `http://localhost:9765`

### Docker Setup (Recommended)

```bash
# Start all services (MongoDB, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:6200
- Backend API: http://localhost:9765
- API Docs: http://localhost:9765/docs
- MongoDB: localhost:27017

### API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:9765/docs`
- ReDoc: `http://localhost:9765/redoc`

### API Endpoints

**Resume Management:**
- `POST /api/resume/upload`: Upload and parse resume (PDF/DOCX)
- `GET /api/resume/{id}`: Get parsed resume by ID
- `GET /api/resume/{id}/improvement`: Get improvement suggestions

**Job Listings:**
- `GET /api/jobs`: Get job listings with pagination
- `GET /api/jobs/{id}`: Get specific job by ID

**Job Matching:**
- `GET /api/matching/{resume_id}/jobs`: Match resume to jobs

**System:**
- `GET /api/health`: Health check endpoint
- `GET /`: API information

## Real Job API Integration

### Supported APIs

**RapidAPI JSearch (Recommended):**
- Sign up: https://rapidapi.com/
- Subscribe: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
- Free tier: 150 requests/month
- Add to `.env`: `RAPIDAPI_KEY=your_key_here`

**Adzuna API (Alternative):**
- Sign up: https://developer.adzuna.com/
- Free tier: 100 requests/month
- Add to `.env`: `ADZUNA_APP_ID=your_id` and `ADZUNA_APP_KEY=your_key`

**Configuration:**
```bash
# In backend/.env
USE_REAL_JOB_API=true   # Enable real API
USE_MOCK_JOBS=true      # Allow fallback to mock data
```

The application automatically:
- Fetches real jobs when API keys are configured
- Caches jobs in MongoDB for 30 days
- Falls back to mock data if APIs are unavailable

## Development

### Project Structure
```
backend/
├── app/
│   ├── database/          # MongoDB connection
│   ├── repositories/      # Data access layer
│   ├── routers/          # API endpoints
│   │   ├── jobs.py
│   │   ├── resume.py
│   │   └── matching.py
│   ├── services/         # Business logic
│   │   ├── resume_parser.py
│   │   ├── job_matcher.py
│   │   ├── job_service.py
│   │   ├── matching_service.py
│   │   └── real_job_scraper.py
│   ├── models/           # Pydantic models
│   └── main.py          # FastAPI app
├── requirements.txt
└── .env.example
```

### Running Tests
```bash
pytest
```

### Code Style
```bash
black .
flake8
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Production Status

### ✅ Implemented Features

- ✅ **MongoDB Integration**: Full persistence layer with async repositories
- ✅ **Real Job API Integration**: RapidAPI (JSearch) and Adzuna support
- ✅ **Smart Fallback System**: Graceful degradation to mock data
- ✅ **Database Indexing**: Optimized queries with full-text search
- ✅ **Docker Support**: Complete containerization with health checks
- ✅ **Environment Configuration**: Flexible .env-based configuration
- ✅ **Async Operations**: Non-blocking database and API calls
- ✅ **Error Handling**: Robust error handling and logging
- ✅ **Production Documentation**: Comprehensive setup guides
- ✅ **Automated Setup**: One-command deployment script

### 🚀 Production Ready

The application is now production-ready with:
- Persistent data storage (MongoDB)
- Real-time job fetching from APIs
- Scalable architecture with Docker
- Monitoring and health checks
- Backup and restore capabilities
- High availability options

### 📚 Documentation

- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Comprehensive production setup guide
- [API Documentation](http://localhost:9765/docs) - Interactive API docs (Swagger)
- [PORT_CONFIGURATION.md](PORT_CONFIGURATION.md) - Port configuration details
- [DESIGN_IMPROVEMENTS.md](DESIGN_IMPROVEMENTS.md) - UI/UX design details

## Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
docker ps | grep mongo

# View MongoDB logs
docker logs jobeez-mongodb
```

**Backend Issues:**
```bash
# View backend logs
docker logs jobeez-backend

# Check health endpoint
curl http://localhost:9765/api/health
```

**Reset Database:**
```bash
# Stop services
docker-compose down

# Remove MongoDB data
docker volume rm jobeez_mongodb_data

# Restart
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- spaCy for NLP capabilities
- Sentence Transformers for semantic matching
- FastAPI for the excellent web framework
- MongoDB for robust data persistence
- RapidAPI and Adzuna for job data
- All other open-source libraries used in this project
