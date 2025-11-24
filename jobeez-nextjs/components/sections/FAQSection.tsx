'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How does the AI resume parsing work?',
      answer: 'Our advanced AI uses natural language processing (NLP) to extract key information from your resume including skills, experience, education, and contact details. It analyzes the content with 95% accuracy and structures it for optimal job matching.',
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Absolutely. We use bank-level encryption to protect your data. Your resume and personal information are never shared with third parties without your explicit consent. You can delete your data at any time.',
    },
    {
      question: 'How accurate are the job matches?',
      answer: 'Our matching algorithm has a 95% accuracy rate. It considers your skills, experience level, education, and preferences to rank opportunities. Each match includes a detailed compatibility score so you can make informed decisions.',
    },
    {
      question: 'Can I upload multiple resumes?',
      answer: 'Yes! Pro and Enterprise users can upload unlimited resumes. This is perfect if you have different versions tailored for specific roles or industries. Free users can upload 1 resume per month.',
    },
    {
      question: 'What file formats do you support?',
      answer: 'We support PDF, DOCX, and DOC formats. For best results, we recommend using a well-formatted PDF with clear sections and standard fonts.',
    },
    {
      question: 'How long does the analysis take?',
      answer: 'Our AI analyzes your resume in under 2 seconds! You\'ll get instant results including parsed information, job matches, and personalized recommendations.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with the service, contact our support team for a full refund.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your billing period.',
    },
  ]

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about Jobeez
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="border border-gray-700 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-lg font-bold text-white pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-purple-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-6 text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
