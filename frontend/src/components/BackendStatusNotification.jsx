import { useState, useEffect } from 'react'
import axios from 'axios'

const BackendStatusNotification = () => {
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    // Check if backend is available
    const checkBackendStatus = async () => {
      try {
        await axios.get('/api/health', { timeout: 2000 })
        setBackendAvailable(true)
      } catch (error) {
        setBackendAvailable(false)
        setShowNotification(true)
      }
    }

    checkBackendStatus()
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const closeNotification = () => {
    setShowNotification(false)
  }

  if (!showNotification || backendAvailable) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-800 font-medium">
              Backend server is not available. Using mock data for demonstration.
            </p>
            <p className="mt-1 text-xs text-amber-700">
              Some features may be limited. The application will automatically reconnect when the backend is available.
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={closeNotification}
                className="inline-flex rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BackendStatusNotification
