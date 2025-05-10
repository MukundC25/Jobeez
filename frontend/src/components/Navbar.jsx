import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { FaBriefcase, FaFileAlt, FaBars, FaTimes, FaSearch, FaChartBar } from 'react-icons/fa'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-lg'
        : 'bg-white dark:bg-gray-800 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <FaBriefcase className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="ml-2">
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Jobeez</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 -mt-1">Resume Matcher</span>
              </div>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="flex items-center">
                <FaSearch className="mr-1.5 h-4 w-4" />
                Home
              </span>
            </Link>
            <Link
              to="/upload"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/upload')
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              <span className="flex items-center">
                <FaFileAlt className="mr-1.5 h-4 w-4" />
                Upload Resume
              </span>
            </Link>
            <a
              href="https://github.com/yourusername/jobeez"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <span className="flex items-center">
                <FaChartBar className="mr-1.5 h-4 w-4" />
                GitHub
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60' : 'max-h-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <FaSearch className="mr-2 h-5 w-5" />
              Home
            </span>
          </Link>
          <Link
            to="/upload"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/upload')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <FaFileAlt className="mr-2 h-5 w-5" />
              Upload Resume
            </span>
          </Link>
          <a
            href="https://github.com/yourusername/jobeez"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <FaChartBar className="mr-2 h-5 w-5" />
              GitHub
            </span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
