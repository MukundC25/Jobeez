#!/bin/bash

# Define custom ports to avoid conflicts with other projects
export JOBEEZ_BACKEND_PORT=9765
export JOBEEZ_FRONTEND_PORT=6200

# Create and activate virtual environment for isolation
echo "Setting up isolated Python environment..."
if [ ! -d "venv" ]; then
  python3 -m venv venv
fi
source venv/bin/activate

# Install backend dependencies in the virtual environment
echo "Installing backend dependencies..."
cd backend

# Install dependencies with better error handling
echo "Installing core dependencies first..."
pip install fastapi==0.104.1 uvicorn==0.23.2 pydantic==1.10.8 python-multipart==0.0.6 requests==2.31.0

echo "Installing pypdf (modern PDF parser)..."
pip install pypdf==3.17.4

echo "Installing NLP dependencies..."
pip install spacy==3.7.2 scikit-learn==1.3.2 sentence-transformers==2.2.2 beautifulsoup4==4.12.2 python-docx==0.8.11

echo "Installing skillNer..."
pip install skillNer==1.0.3

echo "Installing MongoDB driver..."
pip install pymongo==4.5.0

# Download spaCy model
echo "Downloading spaCy model..."
python -m spacy download en_core_web_sm

# Start the backend server
echo "Starting backend server..."
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port $JOBEEZ_BACKEND_PORT &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if the backend started successfully
if ! curl -s http://localhost:$JOBEEZ_BACKEND_PORT/api/health > /dev/null; then
  echo "Full backend failed to start. Starting simplified backend server..."
  kill $BACKEND_PID 2>/dev/null
  python simple_backend.py &
  BACKEND_PID=$!
  sleep 2
fi

# Start the frontend development server
echo "Starting frontend server..."
cd frontend
# Use a separate node_modules directory for this project
export npm_config_prefix="$(pwd)/.npm-global"
mkdir -p .npm-global
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  deactivate  # Deactivate virtual environment
  echo "Servers stopped. Environment cleaned up."
  exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo "Jobeez is running!"
echo "Backend: http://localhost:$JOBEEZ_BACKEND_PORT"
echo "Frontend: http://localhost:$JOBEEZ_FRONTEND_PORT"
echo "Press Ctrl+C to stop the servers"

# Keep the script running
wait
