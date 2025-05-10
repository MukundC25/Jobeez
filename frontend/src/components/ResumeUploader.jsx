import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaFileUpload, FaSpinner, FaFilePdf, FaFileWord, FaFileAlt, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { uploadResume } from '../services/resumeService'
import { useNavigate } from 'react-router-dom'

const ResumeUploader = ({ setResumeId }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles) => {
    // Check if there are any files
    if (acceptedFiles.length === 0) {
      return
    }

    const file = acceptedFiles[0]

    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('word')) {
      toast.error('Please upload a PDF or Word document')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    // Set selected file for preview
    setSelectedFile(file)
  }, [])

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await uploadResume(formData)

      // Set resume ID in parent component
      setResumeId(response.id)

      toast.success('Resume uploaded successfully!')

      // Navigate to resume details page
      navigate(`/resume/${response.id}`)
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Failed to upload resume. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    disabled: isUploading
  })

  // Get file icon based on file type
  const getFileIcon = (file) => {
    if (!file) return <FaFileAlt className="h-10 w-10 text-gray-400" />

    if (file.type.includes('pdf')) {
      return <FaFilePdf className="h-10 w-10 text-red-500" />
    } else if (file.type.includes('word')) {
      return <FaFileWord className="h-10 w-10 text-blue-500" />
    } else {
      return <FaFileAlt className="h-10 w-10 text-gray-400" />
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Upload Your Resume</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Our AI will analyze your resume and match it with the best job opportunities
        </p>
      </div>

      <div className="p-6">
        {!selectedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:shadow-md ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 hover:border-primary-400 dark:border-gray-600 dark:hover:border-primary-600'
            }`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                <FaFileUpload className="h-10 w-10 text-primary-500" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or click to browse files
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <FaFilePdf className="mr-1 text-red-500" />
                  PDF
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <FaFileWord className="mr-1 text-blue-500" />
                  DOC/DOCX
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <FaFileAlt className="mr-1" />
                  Max 5MB
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border rounded-lg p-6">
            <div className="flex items-center">
              <div className="mr-4">
                {getFileIcon(selectedFile)}
              </div>

              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white truncate">
                    {selectedFile.name}
                  </h4>
                  <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-0.5 rounded-full flex items-center">
                    <FaCheck className="mr-1" />
                    Selected
                  </span>
                </div>

                <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedFile.type.split('/')[1].toUpperCase()}</span>
                </div>

                <div className="mt-4 flex items-center">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="btn-primary flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaFileUpload className="mr-2 h-4 w-4" />
                        Upload and Analyze
                      </>
                    )}
                  </button>

                  {!isUploading && (
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="ml-3 btn-outline"
                    >
                      Change File
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isUploading && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div className="bg-primary-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploading and analyzing your resume... This may take a moment.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-400 flex items-center">
            <FaLightbulb className="mr-2" />
            Pro Tips
          </h4>
          <ul className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
            <li>Make sure your resume is up-to-date with your latest experience</li>
            <li>Include relevant skills and keywords for your target positions</li>
            <li>Use a clean, well-formatted resume for better parsing accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// Add missing FaLightbulb import
import { FaLightbulb } from 'react-icons/fa'

export default ResumeUploader
