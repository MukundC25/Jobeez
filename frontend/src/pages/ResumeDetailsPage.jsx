import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaGlobe, FaBuilding, FaGraduationCap, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { getResumeById } from '../services/resumeService'
import SkillsSection from '../components/SkillsSection'

const ResumeDetailsPage = () => {
  const { id } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await getResumeById(id)
        setResume(data)
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError('Failed to load resume. Please try again.')
        toast.error('Failed to load resume')
      } finally {
        setLoading(false)
      }
    }

    fetchResume()
  }, [id])

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
        <Link to="/upload" className="btn-primary">
          Upload Again
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Resume Details
        </h1>
        <div className="flex space-x-3">
          <Link 
            to={`/resume/${id}/matches`}
            className="btn-primary"
          >
            Find Job Matches
          </Link>
          <Link 
            to={`/resume/${id}/improvement`}
            className="btn-secondary"
          >
            Get Improvement Tips
          </Link>
        </div>
      </div>
      
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {resume.name}
            </h2>
            
            <div className="mt-3 space-y-2">
              {resume.contact.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaEnvelope className="mr-2" />
                  <a href={`mailto:${resume.contact.email}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {resume.contact.email}
                  </a>
                </div>
              )}
              
              {resume.contact.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaPhone className="mr-2" />
                  <a href={`tel:${resume.contact.phone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {resume.contact.phone}
                  </a>
                </div>
              )}
              
              {resume.contact.linkedin && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaLinkedin className="mr-2" />
                  <a href={resume.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                    LinkedIn Profile
                  </a>
                </div>
              )}
              
              {resume.contact.github && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaGithub className="mr-2" />
                  <a href={resume.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                    GitHub Profile
                  </a>
                </div>
              )}
              
              {resume.contact.website && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <FaGlobe className="mr-2" />
                  <a href={resume.contact.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400">
                    Personal Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {resume.summary && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {resume.summary}
            </p>
          </div>
        )}
        
        <SkillsSection skills={resume.skills} />
      </div>
      
      {resume.experience.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Experience
          </h3>
          
          <div className="space-y-6">
            {resume.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                      {exp.title}
                    </h4>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                      <FaBuilding className="mr-2" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  
                  {(exp.start_date || exp.end_date) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                      {exp.start_date || ''} {exp.start_date && exp.end_date && '–'} {exp.end_date || 'Present'}
                    </div>
                  )}
                </div>
                
                {exp.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
                
                {exp.skills_used && exp.skills_used.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Skills used:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {exp.skills_used.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {resume.education.length > 0 && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Education
          </h3>
          
          <div className="space-y-6">
            {resume.education.map((edu, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h4 className="text-lg font-medium text-gray-800 dark:text-white">
                      {edu.degree} {edu.field_of_study && `in ${edu.field_of_study}`}
                    </h4>
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mt-1">
                      <FaGraduationCap className="mr-2" />
                      <span>{edu.institution}</span>
                    </div>
                  </div>
                  
                  {(edu.start_date || edu.end_date) && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                      {edu.start_date || ''} {edu.start_date && edu.end_date && '–'} {edu.end_date || 'Present'}
                    </div>
                  )}
                </div>
                
                {edu.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeDetailsPage
