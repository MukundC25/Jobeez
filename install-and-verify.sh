#!/bin/bash

# Installation and Verification Script
# Run this after setting up the environment

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     Jobeez Installation Verification                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Python version
echo "Checking Python version..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d " " -f 2)
    echo -e "${GREEN}✓ Python $PYTHON_VERSION found${NC}"
else
    echo -e "${RED}✗ Python 3 not found${NC}"
    exit 1
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Installing Python packages..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${RED}✗ Failed to install backend dependencies${NC}"
    exit 1
fi

# Download spaCy model
echo ""
echo "Downloading spaCy model..."
python3 -m spacy download en_core_web_lg

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ spaCy model downloaded${NC}"
else
    echo -e "${RED}✗ Failed to download spaCy model${NC}"
    exit 1
fi

# Verify imports
echo ""
echo "Verifying Python imports..."
python3 -c "
import fastapi
import motor
import pymongo
import spacy
import sentence_transformers
print('All imports successful!')
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All Python dependencies verified${NC}"
else
    echo -e "${RED}✗ Some Python dependencies missing${NC}"
    exit 1
fi

cd ..

# Check Node.js
echo ""
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION found${NC}"
else
    echo -e "${YELLOW}! Node.js not found (needed for frontend)${NC}"
fi

# Install frontend dependencies
if command -v npm &> /dev/null; then
    echo ""
    echo "Installing frontend dependencies..."
    cd frontend
    npm install --silent
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}✗ Failed to install frontend dependencies${NC}"
    fi
    cd ..
fi

# Check Docker
echo ""
echo "Checking Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d " " -f 3 | sed 's/,//')
    echo -e "${GREEN}✓ Docker $DOCKER_VERSION found${NC}"
else
    echo -e "${YELLOW}! Docker not found (recommended for production)${NC}"
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d " " -f 4 | sed 's/,//')
    echo -e "${GREEN}✓ Docker Compose $COMPOSE_VERSION found${NC}"
else
    echo -e "${YELLOW}! Docker Compose not found (recommended for production)${NC}"
fi

# Verify environment file
echo ""
echo "Checking environment configuration..."
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ backend/.env exists${NC}"
else
    echo -e "${YELLOW}! backend/.env not found, creating from example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
fi

# Test MongoDB connection (if Docker is available)
echo ""
echo "Testing MongoDB..."
if command -v docker &> /dev/null; then
    # Check if MongoDB container is running
    if docker ps | grep -q "jobeez-mongodb"; then
        echo -e "${GREEN}✓ MongoDB container is running${NC}"
    else
        echo -e "${YELLOW}! MongoDB not running. Start with: docker-compose up -d mongodb${NC}"
    fi
else
    echo -e "${YELLOW}! Docker not available, skipping MongoDB test${NC}"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║            Verification Complete!                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure API keys (optional):"
echo "   Edit backend/.env and add:"
echo "   - RAPIDAPI_KEY=your_key (for real job data)"
echo "   - ADZUNA_APP_ID and ADZUNA_APP_KEY (alternative)"
echo ""
echo "2. Start services:"
echo "   Option A - Docker (recommended):"
echo "     docker-compose up -d"
echo ""
echo "   Option B - Local development:"
echo "     Terminal 1: cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 9765"
echo "     Terminal 2: cd frontend && npm run dev"
echo ""
echo "3. Access application:"
echo "   Frontend: http://localhost:6200"
echo "   Backend:  http://localhost:9765"
echo "   API Docs: http://localhost:9765/docs"
echo ""
echo "4. Initialize database (optional):"
echo "   python backend/scripts/init_db.py"
echo ""
echo -e "${GREEN}Ready to go! 🚀${NC}"
