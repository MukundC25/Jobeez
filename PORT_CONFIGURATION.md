# Jobeez Port Configuration

## Overview
This document outlines the port configuration for the Jobeez project to avoid conflicts with other projects on your system.

## Port Assignments

### Development Environment (Local)
- **Frontend**: Port 6200
- **Backend**: Port 9765

### Docker Environment
- **Frontend**: Port 6200 (host) → 6200 (container)
- **Backend**: Port 9765 (host) → 9000 (container)

## Configuration Files

### 1. run.sh
```bash
export JOBEEZ_BACKEND_PORT=9765
export JOBEEZ_FRONTEND_PORT=6200
```

### 2. frontend/vite.config.js
```javascript
const backendPort = process.env.JOBEEZ_BACKEND_PORT || 9765
const frontendPort = process.env.JOBEEZ_FRONTEND_PORT || 6200
```

### 3. simple_backend.py
```python
PORT = 9765
```

### 4. docker-compose.yml
```yaml
frontend:
  ports:
    - "6200:6200"
backend:
  ports:
    - "9765:9000"
```

## Access URLs

### Development
- Frontend: http://localhost:6200
- Backend API: http://localhost:9765
- Backend Health Check: http://localhost:9765/api/health

### Docker
- Frontend: http://localhost:6200
- Backend API: http://localhost:9765

## Port Conflict Avoidance

These ports were specifically chosen to avoid common conflicts:

### Commonly Used Ports to Avoid:
- 3000: Create React App default
- 3001: Next.js development
- 4000: GraphQL servers
- 5000: Flask default
- 5173: Vite default
- 8000: Django default
- 8080: Common web server port
- 8765: Previous Jobeez backend port

### Chosen Ports:
- **6200**: Uncommon port, unlikely to conflict
- **9765**: High port number, unlikely to conflict

## Environment Variables

You can override these ports by setting environment variables:

```bash
export JOBEEZ_FRONTEND_PORT=6200
export JOBEEZ_BACKEND_PORT=9765
```

## Running the Application

### Option 1: Using run.sh (Recommended)
```bash
./run.sh
```

### Option 2: Manual startup
```bash
# Terminal 1: Start backend
python simple_backend.py

# Terminal 2: Start frontend
cd frontend && npm run dev -- --port 6200
```

### Option 3: Using Docker
```bash
./run-docker.sh
```

## Verification

To verify the servers are running correctly:

```bash
# Check backend
curl http://localhost:9765/api/health

# Check frontend (open in browser)
open http://localhost:6200
```

## Notes

- These port configurations are isolated and should not conflict with other projects
- The configuration supports both development and Docker environments
- All configuration files have been updated to use these ports consistently
- React version: 18.2.0 (compatible with your other projects)
- Vite version: 4.3.2 (compatible with your other projects)
