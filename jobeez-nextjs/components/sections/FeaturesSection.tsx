'use client'

import { motion } from 'framer-motion'
import { Brain, Target, FileSearch, TrendingUp, Shield, Zap, BarChart3, Users } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Parsing',
      description: 'Advanced NLP extracts skills, experience, and qualifications with 95% accuracy.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      title: 'Smart Job Matching',
      description: 'Intelligent algorithms match you with opportunities that fit your profile perfectly.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileSearch,
      title: 'Resume Analysis',
      description: 'Get detailed insights on how to improve your resume for better results.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Discover salary trends, skill demands, and career growth opportunities.',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BarChart3,
      title: 'Skill Gap Analysis',
      description: 'Identify missing skills and get personalized learning recommendations.',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared without your explicit consent.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive analysis and job matches in under 2 seconds.',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Join thousands of professionals and share success stories.',
      gradient: 'from-orange-500 to-red-500',
    },
  ]

  return (
    <section id="features" className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to land your dream job, powered by cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity`} />
              
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
