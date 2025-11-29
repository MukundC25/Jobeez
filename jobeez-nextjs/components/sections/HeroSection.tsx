'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Upload, ArrowRight, Sparkles, Zap, CheckCircle2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden">
      {/* Central Glowing Orb - Inspired by cosmic design */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
        {/* Core glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(168,85,247,0.4) 30%, rgba(236,72,153,0.2) 60%, transparent 100%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Outer ring glow */}
        <motion.div
          className="absolute inset-[-20%] rounded-full blur-[80px]"
          style={{
            background: 'radial-gradient(circle, transparent 40%, rgba(59,130,246,0.3) 50%, rgba(168,85,247,0.2) 70%, transparent 100%)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-blue-400/20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md mb-8"
          >
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">
              AI-Powered Job Matching
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] tracking-tight">
            <span className="block text-white mb-3">
              Find Your Perfect Job
            </span>
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Upload your resume and let our AI analyze your skills to match you with the best opportunities.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              href="/upload"
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-base font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Upload Resume
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="/jobs"
              className="px-8 py-4 border border-gray-700 hover:border-gray-600 text-white rounded-xl text-base font-semibold transition-all hover:bg-gray-800/50 backdrop-blur-sm"
            >
              Browse Jobs
            </Link>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          >
            {[
              { icon: CheckCircle2, text: '50K+ Users' },
              { icon: Zap, text: '<2s Analysis' },
              { icon: CheckCircle2, text: '95% Accuracy' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-400">
                <item.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
