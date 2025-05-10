import { Link } from 'react-router-dom'
import { FaFileAlt, FaSearch, FaChartBar, FaLightbulb, FaRocket, FaBrain, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-16 px-6 mb-16">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your <span className="text-yellow-300">Perfect</span> Job Match
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Upload your resume and let our AI-powered system match you with the best job opportunities based on your skills and experience.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center bg-white text-primary-600 hover:bg-yellow-100 transition-colors text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl"
          >
            Get Started
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="card p-6 border-t-4 border-primary-500">
          <div className="flex items-center">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full mr-4">
              <FaRocket className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white">95%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Match Accuracy</div>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-secondary-500">
          <div className="flex items-center">
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-full mr-4">
              <FaBrain className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white">AI</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Powered Matching</div>
            </div>
          </div>
        </div>

        <div className="card p-6 border-t-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mr-4">
              <FaCheckCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800 dark:text-white">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Free to Use</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="inline-block text-3xl font-bold text-gray-800 dark:text-white relative">
            How It Works
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-full shadow-md">
                <FaFileAlt className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Upload Your Resume
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simply upload your resume in PDF or DOCX format. Our system will automatically parse your information.
            </p>
            <div className="mt-4 text-primary-600 dark:text-primary-400 font-medium">Step 1</div>
          </div>

          <div className="card p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 p-4 rounded-full shadow-md">
                <FaSearch className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              AI-Powered Matching
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Our advanced algorithms analyze your skills and experience to find the best job matches from thousands of listings.
            </p>
            <div className="mt-4 text-secondary-600 dark:text-secondary-400 font-medium">Step 2</div>
          </div>

          <div className="card p-6 text-center transform transition-transform hover:scale-105 hover:shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-full shadow-md">
                <FaChartBar className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Get Personalized Results
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive a ranked list of job matches with detailed match scores and highlighted matching skills.
            </p>
            <div className="mt-4 text-yellow-600 dark:text-yellow-400 font-medium">Step 3</div>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-12 my-16 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8">
        <div className="text-center mb-12">
          <h2 className="inline-block text-3xl font-bold text-gray-800 dark:text-white relative">
            What Makes Us Different
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
                  <FaLightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  AI-Powered Feedback
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized suggestions to improve your resume and increase your job match scores by up to 40%.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-full">
                  <FaBrain className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Soft Skill Extraction
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system identifies both technical and soft skills to match you with jobs that fit your overall profile.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                  <FaCheckCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Match Reasoning
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Understand exactly why a job was matched to your profile with detailed explanations of skill alignment.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div className="mr-4 mt-1">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <FaStar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  "Best-fit" Identification
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our advanced algorithms highlight jobs that are an exceptional match for your unique skill set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-4 rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white mb-12 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Find Your Perfect Job Match?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
          Upload your resume now and discover job opportunities that match your skills and experience.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center bg-white text-primary-600 hover:bg-yellow-100 transition-colors text-lg font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl"
        >
          Upload Your Resume
          <FaFileAlt className="ml-2" />
        </Link>
      </section>
    </div>
  )
}

export default HomePage
