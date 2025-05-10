import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaSpinner, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { matchResumeToJobs } from '../services/jobService'
import JobCard from '../components/JobCard'

const JobMatchesPage = () => {
  const { id: resumeId } = useParams()
  const [jobMatches, setJobMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'
  const [filters, setFilters] = useState({
    minScore: 0,
    jobType: '',
    experienceLevel: '',
    remote: false
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchJobMatches = async () => {
      try {
        const data = await matchResumeToJobs(resumeId)
        setJobMatches(data)
      } catch (err) {
        console.error('Error fetching job matches:', err)
        setError('Failed to load job matches. Please try again.')
        toast.error('Failed to load job matches')
      } finally {
        setLoading(false)
      }
    }

    fetchJobMatches()
  }, [resumeId])

  // Filter and sort job matches
  const filteredAndSortedJobs = jobMatches
    .filter(match => {
      return (
        match.match_score >= filters.minScore &&
        (filters.jobType === '' || match.job.job_type === filters.jobType) &&
        (filters.experienceLevel === '' || match.job.experience_level === filters.experienceLevel) &&
        (!filters.remote || match.job.remote)
      )
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.match_score - b.match_score
      } else {
        return b.match_score - a.match_score
      }
    })

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
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
        <Link to={`/resume/${resumeId}`} className="btn-primary">
          Back to Resume
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Job Matches
        </h1>
        <Link 
          to={`/resume/${resumeId}`}
          className="btn-outline"
        >
          Back to Resume
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline flex items-center"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          <button 
            onClick={toggleSortOrder}
            className="ml-3 btn-outline flex items-center"
          >
            {sortOrder === 'desc' ? (
              <>
                <FaSortAmountDown className="mr-2" />
                Highest Match First
              </>
            ) : (
              <>
                <FaSortAmountUp className="mr-2" />
                Lowest Match First
              </>
            )}
          </button>
        </div>
        
        <div className="text-gray-600 dark:text-gray-300">
          {filteredAndSortedJobs.length} jobs found
        </div>
      </div>
      
      {showFilters && (
        <div className="card p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
            Filter Jobs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Match Score
              </label>
              <input 
                type="range" 
                name="minScore" 
                min="0" 
                max="100" 
                value={filters.minScore} 
                onChange={handleFilterChange}
                className="w-full"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filters.minScore}%
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Job Type
              </label>
              <select 
                name="jobType" 
                value={filters.jobType} 
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Experience Level
              </label>
              <select 
                name="experienceLevel" 
                value={filters.experienceLevel} 
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">All Levels</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remote" 
                name="remote" 
                checked={filters.remote} 
                onChange={handleFilterChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remote" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remote Only
              </label>
            </div>
          </div>
        </div>
      )}
      
      {filteredAndSortedJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAndSortedJobs.map((jobMatch) => (
            <JobCard 
              key={jobMatch.job.id}
              job={jobMatch.job}
              resumeId={resumeId}
              matchScore={jobMatch.match_score}
              matchedSkills={jobMatch.matched_skills}
              bestFit={jobMatch.best_fit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No job matches found with the current filters.
          </p>
          {filters.minScore > 0 || filters.jobType !== '' || filters.experienceLevel !== '' || filters.remote ? (
            <button 
              onClick={() => setFilters({
                minScore: 0,
                jobType: '',
                experienceLevel: '',
                remote: false
              })}
              className="btn-primary"
            >
              Clear Filters
            </button>
          ) : (
            <Link to={`/resume/${resumeId}/improvement`} className="btn-primary">
              Get Resume Improvement Tips
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default JobMatchesPage
