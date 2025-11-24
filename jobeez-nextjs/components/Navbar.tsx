'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white">Jobeez</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
              Jobs
            </Link>
          </div>

          <Link
            href="/upload"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
