'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, Award, Zap, Building2, Globe } from 'lucide-react'
import AnimatedCounter from '../AnimatedCounter'

export default function StatsSection() {
  const stats = [
    { icon: Users, value: 50000, suffix: '+', label: 'Active Users', color: 'from-purple-600 via-purple-500 to-pink-500' },
    { icon: TrendingUp, value: 95, suffix: '%', label: 'Match Accuracy', color: 'from-blue-600 via-blue-500 to-cyan-400' },
    { icon: Award, value: 10000, suffix: '+', label: 'Jobs Filled', color: 'from-green-600 via-green-500 to-emerald-400' },
    { icon: Zap, value: 2, prefix: '<', suffix: 's', label: 'Analysis Time', color: 'from-yellow-600 via-yellow-500 to-orange-400' },
    { icon: Building2, value: 500, suffix: '+', label: 'Partner Companies', color: 'from-pink-600 via-pink-500 to-rose-400' },
    { icon: Globe, value: 45, suffix: '+', label: 'Countries', color: 'from-indigo-600 via-indigo-500 to-purple-400' },
  ]

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-400">Real results from real professionals</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${stat.color} rounded-3xl mb-6 shadow-2xl group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all`}
              >
                <stat.icon className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>
              <div className={`text-5xl md:text-6xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-3`}>
                <AnimatedCounter 
                  end={stat.value} 
                  suffix={stat.suffix} 
                  prefix={stat.prefix}
                />
              </div>
              <div className="text-gray-300 font-semibold text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
