'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Upload, ArrowRight, Sparkles, Play } from 'lucide-react'
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
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-20">
      {/* Large Animated Gradient Orbs */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.2) 50%, transparent 100%)',
          top: '-10%',
          left: '-5%',
          x: mousePosition.x * 0.03,
          y: mousePosition.y * 0.03,
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-[700px] h-[700px] rounded-full blur-[120px] opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 100%)',
          bottom: '-10%',
          right: '-5%',
          x: mousePosition.x * -0.03,
          y: mousePosition.y * -0.03,
        }}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0.2) 50%, transparent 100%)',
          top: '40%',
          left: '50%',
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 180, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm mb-8 shadow-lg shadow-purple-500/20"
          >
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent">
              Powered by Advanced AI Technology
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[1.1] tracking-tight">
            <span className="block text-white mb-2">Land Your</span>
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient mb-2">
              Dream Job
            </span>
            <span className="block text-white">With AI Precision</span>
          </h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Upload your resume and let our cutting-edge AI analyze your skills, match you with perfect opportunities, and <span className="text-purple-400 font-semibold">accelerate your career growth</span>.
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
              className="group relative px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl text-lg font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 shadow-lg"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Upload className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Upload Resume Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <button className="group flex items-center gap-4 px-10 py-5 border-2 border-gray-700/50 backdrop-blur-sm text-white rounded-2xl text-lg font-bold hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all shadow-lg">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-purple-400 group-hover:text-purple-300" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col items-center gap-6"
          >
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">Trusted by professionals at</p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
              {['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple'].map((company, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent hover:from-purple-400 hover:to-blue-400 transition-all cursor-pointer"
                >
                  {company}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
