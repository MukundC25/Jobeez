FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with specific versions
RUN npm install --legacy-peer-deps \
    react@18.2.0 \
    react-dom@18.2.0 \
    vite@4.3.2 \
    @vitejs/plugin-react@4.0.0

# Install other dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set environment variables
ENV JOBEEZ_BACKEND_PORT=8765
ENV JOBEEZ_FRONTEND_PORT=5200

# Expose port
EXPOSE 5200

# Start the application
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5200"]
