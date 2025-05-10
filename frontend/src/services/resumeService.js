import api from './api'

// Upload resume
export const uploadResume = async (formData) => {
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

// Get resume by ID
export const getResumeById = async (resumeId) => {
  const response = await api.get(`/resume/${resumeId}`)
  return response.data
}

// Get resume improvement suggestions
export const getResumeImprovement = async (resumeId) => {
  const response = await api.get(`/resume/${resumeId}/improvement`)
  return response.data
}
