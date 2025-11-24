'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'

export default function PricingSection() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Upload 1 resume per month',
        'Basic AI analysis',
        'Top 5 job matches',
        'Email support',
        'Resume tips',
      ],
      cta: 'Get Started',
      popular: false,
      gradient: 'from-gray-700 to-gray-600',
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '29',
      description: 'For serious job seekers',
      features: [
        'Unlimited resume uploads',
        'Advanced AI analysis',
        'Unlimited job matches',
        'Priority support',
        'Skill gap analysis',
        'Resume optimization',
        'Interview preparation',
        'Salary insights',
      ],
      cta: 'Start Free Trial',
      popular: true,
      gradient: 'from-purple-600 to-blue-600',
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'API access',
        'White-label option',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      popular: false,
      gradient: 'from-yellow-600 to-orange-600',
    },
  ]

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-gray-900/30 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative p-8 rounded-3xl border ${
                plan.popular
                  ? 'bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500'
                  : 'bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                <plan.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-5xl font-black text-white">
                  {plan.price === 'Custom' ? plan.price : `$${plan.price}`}
                </span>
                {plan.price !== 'Custom' && (
                  <span className="text-gray-400 ml-2">/month</span>
                )}
              </div>

              <Link
                href="/upload"
                className={`block w-full py-4 rounded-xl text-center font-bold transition-all mb-8 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-105'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
