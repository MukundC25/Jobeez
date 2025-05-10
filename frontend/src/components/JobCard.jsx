import { Link } from 'react-router-dom'
import { FaBriefcase, FaMapMarkerAlt, FaBuilding, FaStar } from 'react-icons/fa'

const JobCard = ({ job, resumeId, matchScore, matchedSkills, bestFit }) => {
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

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {job.title}
            </h3>
            <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
              <FaBuilding className="mr-1" />
              <span>{job.company}</span>
            </div>
            {job.location && (
              <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="mr-1" />
                <span>{job.location}</span>
                {job.remote && <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">Remote</span>}
              </div>
            )}
          </div>
          
          {matchScore !== undefined && (
            <div className={`flex items-center font-semibold px-3 py-1 rounded-full ${getScoreColor(matchScore)}`}>
              {matchScore}%
            </div>
          )}
        </div>
        
        {bestFit && (
          <div className="flex items-center mt-2 text-yellow-600 dark:text-yellow-400">
            <FaStar className="mr-1" />
            <span className="text-sm font-medium">Best Fit</span>
          </div>
        )}
        
        <div className="mt-3">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Salary:</span> {formatSalary(job.salary_min, job.salary_max)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Job Type:</span> {job.job_type || 'Not specified'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Experience:</span> {job.experience_level || 'Not specified'}
          </div>
        </div>
        
        {matchedSkills && matchedSkills.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Matched Skills:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {matchedSkills.slice(0, 5).map((skill, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 px-2 py-0.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {matchedSkills.length > 5 && (
                <span className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  +{matchedSkills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <Link 
            to={resumeId ? `/resume/${resumeId}/job/${job.id}` : `/jobs/${job.id}`}
            className="btn-primary inline-block w-full text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
