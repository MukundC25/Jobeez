'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Mail, Phone, Linkedin, Github, Briefcase, GraduationCap, Code, TrendingUp, Target, Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface Resume {
  id: string
  name: string
  contact: {
    email?: string
    phone?: string
    linkedin?: string
    github?: string
  }
  summary?: string
  skills: Array<{
    name: string
    category?: string
    confidence?: number
  }>
  experience: Array<{
    company: string
    title: string
    start_date?: string
    end_date?: string
    duration_months?: number
  }>
  education: Array<{
    institution: string
    degree: string
    field_of_study?: string
  }>
  total_experience_years?: number
}

interface JobMatch {
  job: {
    id: string
    title: string
    company: string
    location?: string
    description: string
    required_skills: string[]
    salary_min?: number
    salary_max?: number
  }
  match_score: number
  skill_match_score: number
  experience_match_score: number
  matched_skills: string[]
  missing_skills: string[]
  recommendation: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [matches, setMatches] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get resume from localStorage
    const resumeData = localStorage.getItem('resumeData')
    if (!resumeData) {
      router.push('/upload')
      return
    }

    const parsedResume = JSON.parse(resumeData)
    setResume(parsedResume)

    // Fetch job matches
    fetchJobMatches(parsedResume)
  }, [router])

  const fetchJobMatches = async (resumeData: Resume) => {
    try {
      const response = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })

      const data = await response.json()
      if (data.success && data.matches) {
        setMatches(data.matches)
      }
    } catch (err) {
      console.error('Error fetching matches:', err)
      setError('Failed to fetch job matches')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-400">Analyzing your resume and finding matches...</p>
        </div>
      </div>
    )
  }

  if (!resume) {
    return null
  }

  const skillsByCategory = resume.skills.reduce((acc, skill) => {
    const category = skill.category || 'general'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/upload" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors mb-6">
            <ArrowLeft className="w-5 h-5" />
            Upload Another Resume
          </Link>
          
          <h1 className="text-5xl font-black text-white mb-2">Resume Analysis</h1>
          <p className="text-xl text-gray-400">Your profile has been parsed and analyzed</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resume Summary - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Personal Info */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{resume.name}</h2>
                  <p className="text-sm text-gray-400">{resume.total_experience_years?.toFixed(1)} years experience</p>
                </div>
              </div>

              {resume.summary && (
                <p className="text-gray-300 mb-6 pb-6 border-b border-gray-700">{resume.summary}</p>
              )}

              <div className="space-y-3">
                {resume.contact.email && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{resume.contact.email}</span>
                  </div>
                )}
                {resume.contact.phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">{resume.contact.phone}</span>
                  </div>
                )}
                {resume.contact.linkedin && (
                  <a href={resume.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-300">
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {resume.contact.github && (
                  <a href={resume.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-300">
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Skills ({resume.skills.length})</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category}>
                    <p className="text-xs text-gray-500 uppercase mb-2">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Education</h3>
                </div>
                
                <div className="space-y-3">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-purple-500 pl-4">
                      <p className="font-semibold text-white">{edu.degree}</p>
                      <p className="text-sm text-gray-400">{edu.institution}</p>
                      {edu.field_of_study && (
                        <p className="text-xs text-gray-500">{edu.field_of_study}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Job Matches - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-black text-white mb-2">Job Matches</h2>
              <p className="text-gray-400">Found {matches.length} opportunities ranked by compatibility</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-400" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {matches.map((match, idx) => (
                <motion.div
                  key={match.job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6 hover:border-purple-500/50 transition-all"
                >
                  {/* Match Score Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{match.job.title}</h3>
                      <p className="text-gray-400 mb-2">{match.job.company} • {match.job.location}</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-4xl font-black ${
                        match.match_score >= 80 ? 'text-green-400' :
                        match.match_score >= 60 ? 'text-yellow-400' :
                        'text-orange-400'
                      }`}>
                        {match.match_score}%
                      </div>
                      <p className="text-xs text-gray-500">Match</p>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-purple-500/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-gray-400">Skill Match</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{match.skill_match_score}%</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400">Experience Match</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{match.experience_match_score}%</p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  {match.matched_skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        Matched Skills ({match.matched_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.matched_skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-xs text-green-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {match.missing_skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-orange-400" />
                        Skills to Develop ({match.missing_skills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {match.missing_skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs text-orange-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className="p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl mb-4">
                    <p className="text-sm text-gray-300">{match.recommendation}</p>
                  </div>

                  {/* Salary */}
                  {match.job.salary_min && match.job.salary_max && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Salary Range</p>
                      <p className="text-lg font-bold text-white">
                        ${(match.job.salary_min / 1000).toFixed(0)}k - ${(match.job.salary_max / 1000).toFixed(0)}k
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
