import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaBuilding, FaMapMarkerAlt, FaDollarSign, FaClock, FaUserTie, FaSpinner, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getJobById } from '../services/jobService'
import { matchResumeToJobs } from '../services/jobService'
import SkillsSection from '../components/SkillsSection'

const JobDetailsPage = () => {
  const { resumeId, jobId } = useParams()
  const [job, setJob] = useState(null)
  const [jobMatch, setJobMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Get job details
        const jobData = await getJobById(jobId)
        setJob(jobData)
        
        // If resumeId is provided, get match details
        if (resumeId) {
          const matchesData = await matchResumeToJobs(resumeId)
          const match = matchesData.find(m => m.job.id === jobId)
          if (match) {
            setJobMatch(match)
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err)
        setError('Failed to load job details. Please try again.')
        toast.error('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, resumeId])

  // Format salary range
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not specified'
    if (!min) return `Up to $${max.toLocaleString()}`
    if (!max) return `From $${min.toLocaleString()}`
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  // Get match score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Link to={resumeId ? `/resume/${resumeId}/matches` : "/"} className="btn-primary">
          {resumeId ? 'Back to Job Matches' : 'Go Home'}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to={resumeId ? `/resume/${resumeId}/matches` : "/"}
          className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          <FaArrowLeft className="mr-1" />
          {resumeId ? 'Back to Job Matches' : 'Back to Home'}
        </Link>
      </div>
      
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {job.title}
            </h1>
            
            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
              <FaBuilding className="mr-2" />
              <span>{job.company}</span>
            </div>
            
            {job.location && (
              <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="mr-2" />
                <span>{job.location}</span>
                {job.remote && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">Remote</span>}
              </div>
            )}
          </div>
          
          {jobMatch && (
            <div className={`flex items-center font-semibold px-4 py-2 rounded-full mt-4 md:mt-0 ${getScoreColor(jobMatch.match_score)}`}>
              {jobMatch.match_score}% Match
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Salary</span>
            <span className="text-gray-800 dark:text-white flex items-center">
              <FaDollarSign className="mr-1" />
              {formatSalary(job.salary_min, job.salary_max)}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Job Type</span>
            <span className="text-gray-800 dark:text-white flex items-center">
              <FaClock className="mr-1" />
              {job.job_type || 'Not specified'}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">Experience Level</span>
            <span className="text-gray-800 dark:text-white flex items-center">
              <FaUserTie className="mr-1" />
              {job.experience_level || 'Not specified'}
            </span>
          </div>
        </div>
        
        {job.url && (
          <div className="mt-6">
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center"
            >
              Apply Now <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>
        )}
      </div>
      
      {jobMatch && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Match Analysis
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {jobMatch.match_reasoning}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Matched Skills
              </h3>
              
              {jobMatch.matched_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {jobMatch.matched_skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No matched skills found</p>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Missing Skills
              </h3>
              
              {jobMatch.missing_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {jobMatch.missing_skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No missing skills found</p>
              )}
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to={`/resume/${resumeId}/improvement`}
              className="btn-secondary"
            >
              Get Resume Improvement Tips
            </Link>
          </div>
        </div>
      )}
      
      <div className="card p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Job Description
        </h2>
        
        <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
          {job.description}
        </div>
      </div>
      
      {job.skills && job.skills.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Required Skills
          </h2>
          
          <SkillsSection skills={job.skills} showCategories={true} />
        </div>
      )}
    </div>
  )
}

export default JobDetailsPage
