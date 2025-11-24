'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, XCircle, ArrowLeft, Sparkles, Loader2 } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(selectedFile.type)) {
        setError('Please upload a PDF or DOCX file')
        return
      }
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed')
      }

      console.log('Upload successful:', data)
      
      // Store resume data and redirect to results
      if (data.resume) {
        localStorage.setItem('resumeData', JSON.stringify(data.resume))
        setTimeout(() => {
          router.push('/results')
        }, 1000)
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!validTypes.includes(droppedFile.type)) {
        setError('Please upload a PDF or DOCX file')
        return
      }
      if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setFile(droppedFile)
      setError('')
    }
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">AI-Powered Resume Analysis</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              Upload Your Resume
            </h1>
            <p className="text-xl text-gray-400">
              Let our AI analyze your skills and find the perfect job matches
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="group relative border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-3xl p-16 text-center transition-all cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-8"
                    >
                      <Upload className="w-20 h-20 text-purple-400 mx-auto" />
                    </motion.div>
                    
                    <div>
                      <span className="text-2xl font-bold text-white hover:text-purple-400 transition-colors">
                        Click to upload
                      </span>
                      <span className="text-gray-400"> or drag and drop</span>
                    </div>
                    
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                      <FileText className="w-5 h-5 text-red-400 inline mr-2" />
                      <span className="text-sm text-gray-300">PDF</span>
                    </div>
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                      <FileText className="w-5 h-5 text-blue-400 inline mr-2" />
                      <span className="text-sm text-gray-300">DOCX</span>
                    </div>
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                      <span className="text-sm text-gray-300">Max 5MB</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-2 border-purple-500 rounded-3xl p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                      disabled={uploading}
                    >
                      <XCircle className="w-6 h-6 text-red-400" />
                    </button>
                  </div>

                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-5 rounded-2xl text-lg font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6" />
                        Upload and Analyze
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3"
                >
                  <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 font-semibold">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-yellow-400">Pro Tips</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Make sure your resume is up-to-date with your latest experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Include relevant skills and keywords for your target positions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Use a clean, well-formatted resume for better parsing accuracy</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

