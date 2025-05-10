import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error responses
    console.error('API Error:', error.response || error)

    // If the error is a network error (backend not available), return a mock response
    if (error.message === 'Network Error') {
      console.warn('Backend not available, using mock data')

      // Check the request URL to determine what mock data to return
      const url = error.config.url

      if (url.includes('/resume/parse')) {
        // Mock resume parsing response
        return Promise.resolve({
          data: {
            name: "John Doe",
            contact: {
              email: "john.doe@example.com",
              phone: "123-456-7890",
              linkedin: "https://linkedin.com/in/johndoe",
              github: "https://github.com/johndoe"
            },
            summary: "Experienced software developer with expertise in React, Node.js, and Python.",
            skills: [
              { name: "JavaScript" },
              { name: "React" },
              { name: "Node.js" },
              { name: "Python" },
              { name: "FastAPI" },
              { name: "Machine Learning" }
            ],
            experience: [
              {
                company: "Tech Company",
                title: "Senior Developer",
                start_date: "Jan 2020",
                end_date: "Present",
                description: "• Developed and maintained web applications\n• Led a team of 5 developers\n• Implemented CI/CD pipelines"
              },
              {
                company: "Startup Inc",
                title: "Full Stack Developer",
                start_date: "Jun 2018",
                end_date: "Dec 2019",
                description: "• Built RESTful APIs\n• Developed frontend using React\n• Worked with MongoDB and PostgreSQL"
              }
            ],
            education: [
              {
                institution: "University of Technology",
                degree: "Bachelor of Science in Computer Science",
                start_date: "2014",
                end_date: "2018"
              }
            ]
          }
        })
      } else if (url.includes('/jobs/match')) {
        // Mock job matching response
        return Promise.resolve({
          data: [
            {
              id: "mock-job-1",
              title: "Senior Frontend Developer",
              company: "Tech Giants Inc.",
              location: "San Francisco, CA",
              description: "We are looking for an experienced Frontend Developer with React expertise.",
              requirements: "5+ years of experience with React, JavaScript, and modern frontend frameworks.",
              match_score: 92,
              matched_skills: ["React", "JavaScript", "Node.js"]
            },
            {
              id: "mock-job-2",
              title: "Full Stack Developer",
              company: "Innovative Startup",
              location: "Remote",
              description: "Join our team to build cutting-edge web applications.",
              requirements: "Experience with React, Node.js, and Python required.",
              match_score: 85,
              matched_skills: ["React", "Node.js", "Python"]
            },
            {
              id: "mock-job-3",
              title: "Machine Learning Engineer",
              company: "AI Solutions",
              location: "Boston, MA",
              description: "Help us build the next generation of ML-powered applications.",
              requirements: "Strong Python skills and experience with ML frameworks.",
              match_score: 78,
              matched_skills: ["Python", "Machine Learning"]
            }
          ]
        })
      } else if (url.includes('/jobs')) {
        // Mock jobs list response
        return Promise.resolve({
          data: [
            {
              id: "mock-job-1",
              title: "Senior Frontend Developer",
              company: "Tech Giants Inc.",
              location: "San Francisco, CA",
              description: "We are looking for an experienced Frontend Developer with React expertise.",
              requirements: "5+ years of experience with React, JavaScript, and modern frontend frameworks."
            },
            {
              id: "mock-job-2",
              title: "Full Stack Developer",
              company: "Innovative Startup",
              location: "Remote",
              description: "Join our team to build cutting-edge web applications.",
              requirements: "Experience with React, Node.js, and Python required."
            },
            {
              id: "mock-job-3",
              title: "Machine Learning Engineer",
              company: "AI Solutions",
              location: "Boston, MA",
              description: "Help us build the next generation of ML-powered applications.",
              requirements: "Strong Python skills and experience with ML frameworks."
            }
          ]
        })
      }
    }

    return Promise.reject(error)
  }
)

export default api
