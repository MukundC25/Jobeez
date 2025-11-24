# Production Setup Guide

## Overview
This guide explains how to set up Jobeez with MongoDB and real job API integration for production use.

## Prerequisites

- Docker and Docker Compose installed
- (Optional) RapidAPI account for real job data
- (Optional) Adzuna API account for alternative job data

## Quick Start

### 1. Environment Configuration

Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

Edit `.env` and configure your settings:
```bash
# MongoDB (default settings work for Docker)
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=jobeez

# Optional: Add API keys for real job data
RAPIDAPI_KEY=your_key_here
ADZUNA_APP_ID=your_id_here
ADZUNA_APP_KEY=your_key_here

# Enable real job API (set to true when you have API keys)
USE_REAL_JOB_API=false
USE_MOCK_JOBS=true
```

### 2. Start with Docker (Recommended)

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
- MongoDB: localhost:27017

### 3. Local Development Setup

#### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_lg

# Start MongoDB (if not using Docker)
# Option 1: Use Docker just for MongoDB
docker run -d -p 27017:27017 --name jobeez-mongo mongo:7.0

# Option 2: Install MongoDB locally
# Follow: https://www.mongodb.com/docs/manual/installation/

# Start backend
uvicorn app.main:app --reload --port 9765
```

#### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## MongoDB Setup

### Database Structure

The application uses two main collections:

1. **resumes** - Stores parsed resume data
   - Indexed on: id, created_at, skills.name, name (text search)

2. **jobs** - Stores job listings
   - Indexed on: id, title, company, location, posted_date (text search)

### Manual MongoDB Setup

If you prefer to set up MongoDB manually:

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Connect with mongosh
mongosh

# Create database
use jobeez

# The application will automatically create collections and indexes
```

### MongoDB Connection Options

**Local Development:**
```bash
MONGODB_URL=mongodb://localhost:27017
```

**Docker Compose:**
```bash
MONGODB_URL=mongodb://mongodb:27017
```

**MongoDB Atlas (Cloud):**
```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/
```

## Real Job API Integration

### Option 1: RapidAPI JSearch (Recommended)

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [JSearch API](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
3. Get your API key from the dashboard
4. Update `.env`:
   ```bash
   RAPIDAPI_KEY=your_key_here
   USE_REAL_JOB_API=true
   ```

**Pricing:**
- Free tier: 150 requests/month
- Basic: $9.99/month - 1,000 requests
- Pro: $49.99/month - 10,000 requests

### Option 2: Adzuna API

1. Sign up at [Adzuna Developer](https://developer.adzuna.com/)
2. Get your App ID and Key
3. Update `.env`:
   ```bash
   ADZUNA_APP_ID=your_id_here
   ADZUNA_APP_KEY=your_key_here
   USE_REAL_JOB_API=true
   ```

**Pricing:**
- Free tier: 100 requests/month
- Paid plans available

### Fallback Behavior

The application intelligently handles API availability:

1. **With API keys configured**: Fetches real jobs from APIs
2. **Without API keys**: Uses high-quality mock data
3. **API rate limit exceeded**: Automatically falls back to cached/mock data

You can control this behavior with environment variables:
```bash
USE_REAL_JOB_API=true   # Try real API
USE_MOCK_JOBS=true      # Allow mock fallback
```

## Data Persistence

### Resume Storage

- Resumes are stored in MongoDB with full text search
- Supports pagination and filtering
- Automatic indexing for fast queries
- Falls back to in-memory cache if database is unavailable

### Job Storage

- Jobs are cached in MongoDB for 30 days
- Automatic cleanup of old jobs
- Supports filtering by title, company, location, remote status
- Bulk import from APIs

### Data Migration

To populate the database with initial data:

```bash
# The application will automatically fetch and cache jobs on first request
curl http://localhost:9765/api/jobs?limit=50

# Or trigger manual job fetch (when USE_REAL_JOB_API=true)
# Jobs are automatically fetched and cached
```

## Monitoring & Maintenance

### Health Checks

```bash
# Check API health
curl http://localhost:9765/api/health

# Check MongoDB connection
docker exec -it jobeez-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Database Maintenance

```bash
# Connect to MongoDB
docker exec -it jobeez-mongodb mongosh

# Use jobeez database
use jobeez

# Check collections
show collections

# Count documents
db.resumes.countDocuments()
db.jobs.countDocuments()

# Create backup
docker exec jobeez-mongodb mongodump --out /data/backup

# Restore backup
docker exec jobeez-mongodb mongorestore /data/backup
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# View MongoDB logs
docker-compose logs -f mongodb
```

## Production Deployment

### Security Recommendations

1. **MongoDB Security:**
   ```yaml
   # In docker-compose.yml, add authentication
   environment:
     - MONGO_INITDB_ROOT_USERNAME=admin
     - MONGO_INITDB_ROOT_PASSWORD=secure_password
   ```

2. **API Keys:**
   - Never commit `.env` file to git
   - Use environment-specific configuration
   - Rotate API keys regularly

3. **CORS Configuration:**
   - Update allowed origins in `backend/app/main.py`
   - Only allow your production frontend domain

4. **Rate Limiting:**
   - Consider adding rate limiting middleware
   - Monitor API usage

### Performance Optimization

1. **Database Indexing:**
   - Indexes are created automatically on startup
   - Monitor slow queries

2. **Caching:**
   - Jobs are cached for 30 days
   - Consider Redis for session caching

3. **API Optimization:**
   - Batch job fetches during off-peak hours
   - Cache frequent queries

### Scaling

**Horizontal Scaling:**
```yaml
# docker-compose.yml
backend:
  deploy:
    replicas: 3
```

**MongoDB Replica Set:**
- Set up MongoDB replica set for high availability
- Use MongoDB Atlas for managed service

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Check MongoDB logs
docker logs jobeez-mongodb

# Test connection
docker exec -it jobeez-mongodb mongosh --eval "db.adminCommand('ping')"
```

### API Issues

```bash
# Test RapidAPI connection
curl -H "X-RapidAPI-Key: YOUR_KEY" \
  -H "X-RapidAPI-Host: jsearch.p.rapidapi.com" \
  "https://jsearch.p.rapidapi.com/search?query=software%20developer"

# Check backend logs
docker logs jobeez-backend | grep -i "job"
```

### Database Reset

```bash
# Stop services
docker-compose down

# Remove MongoDB data
docker volume rm jobeez_mongodb_data

# Start fresh
docker-compose up -d
```

## Features

### ✅ Implemented

- **MongoDB Integration**: Full persistence layer with repositories
- **Real Job API**: Integration with RapidAPI and Adzuna
- **Fallback System**: Graceful degradation to mock data
- **Database Indexes**: Optimized queries
- **Docker Support**: Complete containerization
- **Environment Config**: Flexible configuration system
- **Async Operations**: Fast, non-blocking database operations
- **Error Handling**: Robust error handling and logging

### 🚀 Production Ready

The application now supports:
- Persistent data storage
- Real-time job fetching
- Scalable architecture
- Monitoring and logging
- Backup and restore
- High availability options

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:9765/docs
- ReDoc: http://localhost:9765/redoc

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure API keys are valid
4. Check MongoDB connection

## License

MIT License
