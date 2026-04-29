'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const steps = [
  {
    number: 1,
    title: 'Create Account',
    description: 'Sign up for a free account with your email and name',
    icon: '📝',
  },
  {
    number: 2,
    title: 'Choose Template',
    description: 'Browse our beautiful templates and pick one that matches your style',
    icon: '🎨',
  },
  {
    number: 3,
    title: 'Customize Design',
    description: 'Add your names, wedding date, venue, photos, and music',
    icon: '✏️',
  },
  {
    number: 4,
    title: 'Publish & Share',
    description: 'Publish your invitation and share the link with guests',
    icon: '🚀',
  },
]

export default function Tutorial() {
  const [activeStep, setActiveStep] = useState(1)

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
        <h1 className="font-serif text-5xl text-gray-800 mb-4">How It Works</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Create your wedding invitation in 4 simple steps</p>
      </div>

      {/* Steps */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-8 mb-12"
              onClick={() => setActiveStep(step.number)}
            >
              {/* Step Number */}
              <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                activeStep >= step.number
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                  : 'bg-white text-gray-400 border-2 border-gray-200'
              }`}>
                {step.number}
              </div>

              {/* Content */}
              <div className="flex-1 pt-3">
                <div className="text-4xl mb-2">{step.icon}</div>
                <h3 className="font-serif text-2xl text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-lg font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all"
          >
            Get Started Now →
          </Link>
        </div>
      </div>

      {/* Developer Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl text-gray-800 mb-8 text-center">For Developers</h2>
          
          <div className="grid gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-medium text-gray-800 mb-2">💰 Changing Package Prices</h3>
              <p className="text-gray-600 text-sm">Edit prices in <code className="bg-gray-200 px-2 py-1 rounded">backend/src/routes/packages.ts</code></p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-medium text-gray-800 mb-2">🎨 Adding New Templates</h3>
              <p className="text-gray-600 text-sm">Add templates in <code className="bg-gray-200 px-2 py-1 rounded">backend/src/routes/templates.ts</code></p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="font-medium text-gray-800 mb-2">🌐 Deployment</h3>
              <p className="text-gray-600 text-sm">Backend → Render, Frontend → Vercel. Set Root Directory to respective folders.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}