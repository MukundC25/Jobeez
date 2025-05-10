import api from './api'

// Get all jobs with pagination
export const getJobs = async (limit = 50, offset = 0) => {
  const response = await api.get('/jobs', {
    params: { limit, offset },
  })
  return response.data
}

// Get job by ID
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`)
  return response.data
}

// Match resume to jobs
export const matchResumeToJobs = async (resumeId, limit = 10) => {
  const response = await api.get(`/matching/${resumeId}/jobs`, {
    params: { limit },
  })
  return response.data
}
