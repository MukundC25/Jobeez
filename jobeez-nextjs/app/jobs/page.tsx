'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching jobs:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Available Jobs
          </h1>
          <p className="text-xl text-gray-600">
            Browse through {jobs.length} available positions
          </p>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {job.company} • {job.location}
                  </p>
                </div>
                <Link
                  href="/upload"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </Link>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Description:</h3>
                <p className="text-gray-700">{job.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                <p className="text-gray-700">{job.requirements}</p>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No jobs available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
