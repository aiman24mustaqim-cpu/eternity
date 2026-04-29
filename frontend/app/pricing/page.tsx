'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    price: 'RM0',
    description: 'Perfect for trying out',
    features: [
      '1 Invitation',
      '5 Photos',
      'Basic Templates',
      'Standard Support',
    ],
    notIncluded: [
      'Music Upload',
      'Custom Domain',
      'RSVP Management',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Basic',
    price: 'RM59',
    description: 'Most popular choice',
    features: [
      '3 Invitations',
      '20 Photos',
      'All Templates',
      'Music Upload',
      'Custom Slug',
      'Remove Branding',
      'Priority Support',
    ],
    notIncluded: [
      'RSVP Management',
      'Analytics',
    ],
    cta: 'Choose Basic',
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Premium',
    price: 'RM129',
    description: 'Full experience',
    features: [
      'Unlimited Invitations',
      'Unlimited Photos',
      'All Templates',
      'Music Upload',
      'Custom Domain',
      'RSVP Management',
      'Analytics',
      'Priority Support',
      'White Label',
    ],
    notIncluded: [],
    cta: 'Go Premium',
    highlighted: false,
    badge: 'Best Value',
  },
]

export default function Pricing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <span className="text-white font-serif text-xl">E</span>
            </div>
            <span className="font-serif text-2xl font-bold text-gray-800">Eternity</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-rose-500">Login</Link>
            <Link href="/register" className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="text-center py-16">
        <h1 className="font-serif text-5xl text-gray-800 mb-4">Simple Pricing</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Choose the plan that fits your needs</p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                plan.highlighted ? 'ring-2 ring-rose-500 transform scale-105' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-center py-2 text-sm font-medium">
                  {plan.badge}
                </div>
              )}

              <div className={`p-8 ${plan.badge ? 'pt-12' : ''}`}>
                <h3 className="font-serif text-2xl text-gray-800">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  <span className="text-gray-500 ml-2">/ lifetime</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>

                {/* Features */}
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 opacity-50">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span className="text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`block w-full mt-8 py-3 text-center font-medium rounded-xl transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Teaser */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl text-gray-800 mb-4">Have Questions?</h2>
          <p className="text-gray-600 mb-6">Check our FAQ or contact us for more information</p>
          <Link href="/faq" className="inline-block px-6 py-3 border-2 border-rose-500 text-rose-500 font-medium rounded-xl hover:bg-rose-50 transition-all">
            View FAQ
          </Link>
        </div>
      </section>
    </main>
  )
}