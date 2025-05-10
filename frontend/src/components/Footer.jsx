import { FaGithub, FaLinkedin, FaTwitter, FaBriefcase, FaEnvelope, FaFileAlt, FaSearch, FaChartBar } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <FaBriefcase className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">Jobeez</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              AI-powered resume parsing and job matching to help you find your perfect career opportunity.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
                >
                  <FaSearch className="h-3 w-3 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
                >
                  <FaFileAlt className="h-3 w-3 mr-2" />
                  Upload Resume
                </Link>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center"
                >
                  <FaChartBar className="h-3 w-3 mr-2" />
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Resume Tips
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Job Search Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Interview Preparation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Career Development
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 dark:text-white font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-600 dark:text-gray-300 flex items-start mb-2">
              <FaEnvelope className="h-4 w-4 mr-2 mt-1" />
              <span>support@jobeez.com</span>
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              We'd love to hear from you! Send us your feedback or questions.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Jobeez. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
