#!/bin/bash

# Define custom ports to avoid conflicts
export JOBEEZ_BACKEND_PORT=8765
export JOBEEZ_FRONTEND_PORT=5200

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

# Build and start the containers
echo "Building and starting the containers..."
docker-compose up --build -d

# Wait for the containers to start
echo "Waiting for the containers to start..."
sleep 5

# Check if the containers are running
if docker-compose ps | grep -q "jobeez-frontend"; then
  echo "Jobeez is running!"
  echo "Backend: http://localhost:$JOBEEZ_BACKEND_PORT"
  echo "Frontend: http://localhost:$JOBEEZ_FRONTEND_PORT"
  echo "Press Ctrl+C to stop the servers"
else
  echo "Failed to start the containers. Please check the logs with 'docker-compose logs'."
  exit 1
fi

# Keep the script running
while true; do
  sleep 1
done
