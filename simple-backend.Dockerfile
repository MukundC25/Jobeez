FROM python:3.9-slim

WORKDIR /app

COPY simple_backend.py .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8765

# Run the simple backend server
CMD ["python", "simple_backend.py"]
