# Jobeez Frontend

This is the frontend for the Jobeez application, a Resume Parser and Job Matcher.

## Features

- Resume upload and parsing
- Job matching with detailed scores
- Resume improvement suggestions
- Responsive design with Tailwind CSS

## Tech Stack

- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- React Dropzone for file uploads
- React Icons for UI icons

## Setup

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn
```

2. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173

## Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page components
- `src/services` - API service functions
- `src/assets` - Static assets like images
- `src/App.jsx` - Main application component with routing

## Features

### Resume Upload

Users can upload their resume in PDF or DOCX format. The system will parse the resume to extract:
- Personal information
- Skills
- Experience
- Education

### Job Matching

The system matches the uploaded resume with job listings based on:
- Skill overlap
- Semantic similarity
- Experience level

### Resume Improvement

The system provides suggestions to improve the resume:
- Skills to add
- Formatting suggestions
- Content improvements
