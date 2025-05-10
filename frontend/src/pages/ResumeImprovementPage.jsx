import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaSpinner, FaArrowLeft, FaLightbulb, FaCheckCircle, FaFileAlt, FaChartLine } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getResumeImprovement } from '../services/resumeService'

const ResumeImprovementPage = () => {
  const { id: resumeId } = useParams()
  const [improvement, setImprovement] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchImprovement = async () => {
      try {
        const data = await getResumeImprovement(resumeId)
        setImprovement(data)
      } catch (err) {
        console.error('Error fetching resume improvement:', err)
        setError('Failed to load improvement suggestions. Please try again.')
        toast.error('Failed to load improvement suggestions')
      } finally {
        setLoading(false)
      }
    }

    fetchImprovement()
  }, [resumeId])

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
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to={`/resume/${resumeId}`}
          className="flex items-center text-primary-600 dark:text-primary-400 hover:underline"
        >
          <FaArrowLeft className="mr-1" />
          Back to Resume
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Resume Improvement Suggestions
      </h1>
      
      <div className="card p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaChartLine className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Potential Improvement
          </h2>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Current Match Score</span>
            <span className="font-semibold">Base</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-700 dark:text-gray-300">Potential Match Score</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              +{improvement.improvement_score}%
            </span>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-4">
              <div 
                className="bg-primary-600 dark:bg-primary-500 h-4 rounded-full"
                style={{ width: `${Math.min(100, improvement.improvement_score)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          By adding the suggested skills and implementing the recommendations below, 
          you could improve your job match scores by approximately {improvement.improvement_score}%.
        </p>
      </div>
      
      <div className="card p-6 mb-6">
        <div className="flex items-center mb-4">
          <FaLightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Skills to Add
          </h2>
        </div>
        
        {improvement.missing_skills.length > 0 ? (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Adding these in-demand skills to your resume could significantly improve your job matches:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {improvement.missing_skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Note: Only add skills that you actually possess. Misrepresenting your skills can lead to issues during interviews.
            </p>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            Your resume already includes most of the in-demand skills for your target jobs.
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <FaFileAlt className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Formatting Suggestions
            </h2>
          </div>
          
          <ul className="space-y-3">
            {improvement.formatting_suggestions.map((suggestion, index) => (
              <li key={index} className="flex">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <FaFileAlt className="h-6 w-6 text-primary-600 dark:text-primary-400 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Content Suggestions
            </h2>
          </div>
          
          <ul className="space-y-3">
            {improvement.content_suggestions.map((suggestion, index) => (
              <li key={index} className="flex">
                <FaCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Link 
          to={`/resume/${resumeId}/matches`}
          className="btn-primary"
        >
          View Job Matches
        </Link>
      </div>
    </div>
  )
}

export default ResumeImprovementPage
