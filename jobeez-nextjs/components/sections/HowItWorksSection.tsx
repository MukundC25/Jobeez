'use client'

import { motion } from 'framer-motion'
import { Upload, Brain, Target, CheckCircle } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Upload Your Resume',
      description: 'Simply drag and drop your resume in PDF or DOCX format. Our system supports all major formats.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '02',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI parses your resume, extracting skills, experience, education, and qualifications in seconds.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '03',
      icon: Target,
      title: 'Get Matched',
      description: 'Receive ranked job opportunities with detailed compatibility scores and personalized recommendations.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '04',
      icon: CheckCircle,
      title: 'Apply & Succeed',
      description: 'Apply to your top matches with confidence, knowing you meet the requirements and stand out.',
      color: 'from-yellow-500 to-orange-500',
    },
  ]

  return (
    <section id="how-it-works" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/50 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Four simple steps to transform your job search and land your dream role
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 -translate-y-1/2 opacity-20" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all group">
                  {/* Step Number */}
                  <div className="absolute -top-6 left-8">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-black text-lg">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-3xl flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform shadow-xl`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
