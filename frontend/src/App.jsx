import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackendStatusNotification from './components/BackendStatusNotification'
import HomePage from './pages/HomePage'
import UploadResumePage from './pages/UploadResumePage'
import ResumeDetailsPage from './pages/ResumeDetailsPage'
import JobMatchesPage from './pages/JobMatchesPage'
import JobDetailsPage from './pages/JobDetailsPage'
import ResumeImprovementPage from './pages/ResumeImprovementPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const [resumeId, setResumeId] = useState(null)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/upload"
            element={<UploadResumePage setResumeId={setResumeId} />}
          />
          <Route
            path="/resume/:id"
            element={<ResumeDetailsPage />}
          />
          <Route
            path="/resume/:id/matches"
            element={<JobMatchesPage />}
          />
          <Route
            path="/resume/:resumeId/job/:jobId"
            element={<JobDetailsPage />}
          />
          <Route
            path="/resume/:id/improvement"
            element={<ResumeImprovementPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <BackendStatusNotification />
    </div>
  )
}

export default App
