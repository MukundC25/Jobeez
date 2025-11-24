'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-16 rounded-3xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/20 overflow-hidden"
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-8"
            >
              <Sparkles className="w-20 h-20 text-yellow-400" />
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ professionals who found their dream jobs with Jobeez. Your perfect match is waiting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/upload"
                className="group inline-flex items-center justify-center gap-3 px-12 py-6 bg-white text-black rounded-2xl text-xl font-bold hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-white/20"
              >
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center px-12 py-6 border-2 border-white/30 text-white rounded-2xl text-xl font-bold hover:bg-white/10 transition-all"
              >
                Browse Jobs
              </Link>
            </div>

            <p className="text-sm text-gray-400 mt-8">
              No credit card required • Free forever plan available
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
