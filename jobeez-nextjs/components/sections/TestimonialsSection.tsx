'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Google',
      image: '👩‍💻',
      rating: 5,
      text: 'Jobeez helped me land my dream job at Google! The AI matching was incredibly accurate, and I got my offer within 2 weeks of uploading my resume.',
    },
    {
      name: 'Michael Chen',
      role: 'Data Scientist',
      company: 'Microsoft',
      image: '👨‍💼',
      rating: 5,
      text: 'The skill gap analysis feature was a game-changer. It showed me exactly what to learn, and I upskilled in 3 months before landing my role at Microsoft.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Product Manager',
      company: 'Amazon',
      image: '👩‍🎨',
      rating: 5,
      text: 'I was skeptical at first, but the match scores were spot-on. Every job recommendation was relevant, and I found my perfect role at Amazon.',
    },
    {
      name: 'David Kim',
      role: 'Full Stack Developer',
      company: 'Meta',
      image: '👨‍🔬',
      rating: 5,
      text: 'The resume analysis helped me optimize my CV. After implementing the suggestions, I got 3x more interview calls. Now I\'m at Meta!',
    },
    {
      name: 'Jessica Taylor',
      role: 'UX Designer',
      company: 'Apple',
      image: '👩‍🎓',
      rating: 5,
      text: 'Jobeez made my job search so much easier. The personalized recommendations saved me hours of searching, and I landed at Apple!',
    },
    {
      name: 'Alex Martinez',
      role: 'DevOps Engineer',
      company: 'Netflix',
      image: '👨‍🚀',
      rating: 5,
      text: 'The platform is incredibly intuitive. Within minutes of uploading my resume, I had a list of perfect matches. Now I\'m working at Netflix!',
    },
  ]

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join thousands of professionals who transformed their careers with Jobeez
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-purple-500/50 transition-all"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-16 h-16 text-purple-400" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
