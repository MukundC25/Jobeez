'use client'

import { motion } from 'framer-motion'
import { Brain, Target, FileSearch, TrendingUp, Shield, Zap, BarChart3, Users } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: 'AI Resume Parsing',
      description: 'Extract skills, experience, and qualifications automatically with 95% accuracy.',
      color: 'blue',
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Get matched with jobs that perfectly fit your skills and experience level.',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Discover salary trends and in-demand skills for your field.',
      color: 'cyan',
    },
    {
      icon: BarChart3,
      title: 'Skill Analysis',
      description: 'Identify skill gaps and get personalized recommendations.',
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared without permission.',
      color: 'indigo',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get complete analysis and matches in under 2 seconds.',
      color: 'yellow',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative p-6 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
