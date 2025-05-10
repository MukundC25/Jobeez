import { useState } from 'react'
import ResumeUploader from '../components/ResumeUploader'
import { FaFileAlt, FaSearch, FaChartBar } from 'react-icons/fa'

const UploadResumePage = ({ setResumeId }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Upload Your Resume
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
        Upload your resume to find job matches and get personalized improvement suggestions.
      </p>
      
      <div className="mb-12">
        <ResumeUploader setResumeId={setResumeId} />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-3">
            <FaFileAlt className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Parse Resume
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Extract your skills, experience, and education automatically.
          </p>
        </div>
        
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-3">
            <FaSearch className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Match Jobs
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Find jobs that match your skills and experience.
          </p>
        </div>
        
        <div className="card p-4 text-center">
          <div className="flex justify-center mb-3">
            <FaChartBar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
            Get Insights
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Receive personalized suggestions to improve your resume.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          Tips for Better Results
        </h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>Make sure your resume is up-to-date with your latest experience and skills</li>
          <li>Use a clean, well-formatted resume without complex layouts or tables</li>
          <li>Include relevant skills and keywords for your target job positions</li>
          <li>Quantify your achievements with numbers and metrics when possible</li>
          <li>Ensure your contact information is current and easily readable</li>
        </ul>
      </div>
    </div>
  )
}

export default UploadResumePage
