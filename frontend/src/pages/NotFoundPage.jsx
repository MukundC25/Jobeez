import { Link } from 'react-router-dom'
import { FaExclamationTriangle } from 'react-icons/fa'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FaExclamationTriangle className="h-16 w-16 text-yellow-500 mb-6" />
      
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Page Not Found
      </h1>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex space-x-4">
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
        
        <Link to="/upload" className="btn-outline">
          Upload Resume
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
