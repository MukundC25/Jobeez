#!/bin/bash

# Jobeez Production Setup Script
# This script helps set up the production environment

set -e  # Exit on error

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        Jobeez Production Setup Wizard                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi
echo -e "${GREEN}✓ Docker is installed${NC}"

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose is not installed${NC}"
    echo "Please install Docker Compose"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose is installed${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${YELLOW}! backend/.env already exists${NC}"
fi

echo ""
echo "Would you like to configure API keys for real job data? (y/n)"
read -r configure_apis

if [ "$configure_apis" = "y" ] || [ "$configure_apis" = "Y" ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  API Configuration"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo "Option 1: RapidAPI JSearch (Recommended)"
    echo "  - Sign up: https://rapidapi.com/"
    echo "  - Subscribe: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch"
    echo "  - Free tier: 150 requests/month"
    echo ""
    echo "Enter your RapidAPI key (or press Enter to skip):"
    read -r rapidapi_key
    
    if [ -n "$rapidapi_key" ]; then
        sed -i.bak "s/RAPIDAPI_KEY=.*/RAPIDAPI_KEY=$rapidapi_key/" backend/.env
        sed -i.bak "s/USE_REAL_JOB_API=.*/USE_REAL_JOB_API=true/" backend/.env
        echo -e "${GREEN}✓ RapidAPI key configured${NC}"
    fi
    
    echo ""
    echo "Option 2: Adzuna API (Alternative)"
    echo "  - Sign up: https://developer.adzuna.com/"
    echo "  - Free tier: 100 requests/month"
    echo ""
    echo "Enter your Adzuna App ID (or press Enter to skip):"
    read -r adzuna_id
    
    if [ -n "$adzuna_id" ]; then
        echo "Enter your Adzuna App Key:"
        read -r adzuna_key
        
        sed -i.bak "s/ADZUNA_APP_ID=.*/ADZUNA_APP_ID=$adzuna_id/" backend/.env
        sed -i.bak "s/ADZUNA_APP_KEY=.*/ADZUNA_APP_KEY=$adzuna_key/" backend/.env
        sed -i.bak "s/USE_REAL_JOB_API=.*/USE_REAL_JOB_API=true/" backend/.env
        echo -e "${GREEN}✓ Adzuna API configured${NC}"
    fi
    
    # Clean up backup files
    rm -f backend/.env.bak
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Starting Services"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Pull latest images
echo "Pulling Docker images..."
docker-compose pull

# Build and start services
echo "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 5

# Check if services are running
if docker ps | grep -q "jobeez-mongodb"; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB failed to start${NC}"
fi

if docker ps | grep -q "jobeez-backend"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${RED}✗ Backend failed to start${NC}"
fi

if docker ps | grep -q "jobeez-frontend"; then
    echo -e "${GREEN}✓ Frontend is running${NC}"
else
    echo -e "${RED}✗ Frontend failed to start${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Health Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Wait for backend to be ready
echo "Waiting for backend API..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:9765/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend API is healthy${NC}"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}✗ Backend API health check failed${NC}"
        echo "Check logs with: docker-compose logs backend"
    fi
    sleep 2
done

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║              Setup Complete!                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Services are now running:"
echo "  • Frontend:  ${GREEN}http://localhost:6200${NC}"
echo "  • Backend:   ${GREEN}http://localhost:9765${NC}"
echo "  • API Docs:  ${GREEN}http://localhost:9765/docs${NC}"
echo "  • MongoDB:   ${GREEN}localhost:27017${NC}"
echo ""
echo "Useful commands:"
echo "  • View logs:        docker-compose logs -f"
echo "  • Stop services:    docker-compose down"
echo "  • Restart services: docker-compose restart"
echo "  • View status:      docker-compose ps"
echo ""
echo "Documentation:"
echo "  • Production Setup: PRODUCTION_SETUP.md"
echo "  • API Docs:         http://localhost:9765/docs"
echo ""

# Offer to open browser
echo "Would you like to open the application in your browser? (y/n)"
read -r open_browser

if [ "$open_browser" = "y" ] || [ "$open_browser" = "Y" ]; then
    if command -v open &> /dev/null; then
        open http://localhost:6200
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:6200
    else
        echo "Please open http://localhost:6200 in your browser"
    fi
fi

echo ""
echo -e "${GREEN}Happy job matching! 🚀${NC}"
