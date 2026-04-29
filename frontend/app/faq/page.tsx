'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const faqs = [
  {
    question: 'How do I create a wedding invitation?',
    answer: 'Simply sign up for an account, choose a template that matches your style, customize it with your details (names, date, venue, photos), and then publish and share the link with your guests.',
  },
  {
    question: 'Can I add music to my invitation?',
    answer: 'Yes! With our Basic and Premium plans, you can upload background music for your invitation. Choose from our library or upload your own MP3 file.',
  },
  {
    question: 'How do guests view my invitation?',
    answer: 'Once you publish your invitation, you\'ll get a unique link that you can share via WhatsApp, email, or social media. Guests can view it on any device.',
  },
  {
    question: 'Can I edit my invitation after publishing?',
    answer: 'Yes! You can unpublish, make changes, and republish at any time. Your guests will need to access the updated link.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards through Stripe. For Malaysian users, we also support ToyyibPay.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 7-day money-back guarantee for all paid plans. Contact our support team if you\'re not satisfied.',
  },
  {
    question: 'How do I change the app name?',
    answer: 'Change the APP_NAME variable in your .env file or backend environment variables. For the frontend, update NEXT_PUBLIC_APP_NAME.',
  },
  {
    question: 'How do I deploy this myself?',
    answer: 'Backend deploys to Render (set Root Directory to "backend"), Frontend deploys to Vercel (set Root Directory to "frontend"). Make sure to add environment variables on both platforms.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        <h1 className="font-serif text-5xl text-gray-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Got questions? We've got answers!</p>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                <span className={`ml-4 text-2xl transition-transform ${openIndex === i ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl text-gray-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">Contact our support team and we'll help you out</p>
          <a href="mailto:support@eternity.com" className="inline-block px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-all">
            Contact Support
          </a>
        </div>
      </section>
    </main>
  )
}