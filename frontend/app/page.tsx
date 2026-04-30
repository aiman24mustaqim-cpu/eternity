'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ==================== NAVBAR ====================
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Tutorial', href: '/tutorial' },
    { name: 'FAQ', href: '/faq' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <span className="text-white font-serif text-xl">E</span>
            </div>
            <span className={`font-serif text-2xl font-bold ${scrolled ? 'text-rose-700' : 'text-white'}`}>
              Eternity
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-rose-500'
                    : scrolled ? 'text-gray-700 hover:text-rose-500' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-700 hover:text-rose-500' : 'text-white/90 hover:text-white'
              }`}>
              Login
            </Link>
            <Link href="/register" className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <div className="space-y-1.5">
              <span className={`block w-6 h-0.5 ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
              <span className={`block w-6 h-0.5 ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
              <span className={`block w-6 h-0.5 ${scrolled ? 'bg-gray-700' : 'bg-white'}`}></span>
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="block py-2 text-gray-700 hover:text-rose-500" onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <hr className="my-3 border-gray-200" />
              <Link href="/login" className="block py-2 text-gray-700">Login</Link>
              <Link href="/register" className="block py-2 text-rose-500 font-medium">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// ==================== HERO SECTION ====================
export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-rose-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-300/20 text-6xl"
            initial={{ y: Math.random() * 100, opacity: 0 }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
          >
            ❀
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 text-sm font-medium rounded-full mb-6">
            ✨ Create Beautiful Wedding Invitations
          </span>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gray-800 mb-6 leading-tight">
            Your Love Story,
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              Beautifully Told
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create stunning digital wedding invitations that your guests will treasure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-lg font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all">
              Create Your Invitation →
            </Link>
            <Link href="/templates" className="px-8 py-4 bg-white/80 backdrop-blur text-gray-700 text-lg font-medium rounded-full hover:bg-white transition-all border border-rose-100">
              View Templates
            </Link>
          </div>
        </motion.div>

        <motion.div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
          {[
            { title: 'Floral Romance', color: 'from-rose-300 to-pink-400', emoji: '🌸' },
            { title: 'Golden Hour', color: 'from-amber-300 to-orange-400', emoji: '🌅' },
            { title: 'Islamic Elegance', color: 'from-emerald-300 to-teal-400', emoji: '🕌' },
          ].map((template) => (
            <motion.div key={template.title} className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" whileHover={{ scale: 1.05, y: -10 }}>
              <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${template.color} flex items-center justify-center text-5xl mb-4`}>
                {template.emoji}
              </div>
              <h3 className="font-serif text-xl text-gray-800">{template.title}</h3>
              <p className="text-gray-500 text-sm">Template</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-rose-300 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-rose-400 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}

// ==================== FEATURES SECTION ====================
export function Features() {
  const features = [
    { icon: '🎨', title: 'Beautiful Templates', desc: '10+ professionally designed templates' },
    { icon: '🎵', title: 'Music & Audio', desc: 'Add romantic background music' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Perfect on any device' },
    { icon: '🖼️', title: 'Photo Gallery', desc: 'Showcase your precious moments' },
    { icon: '📍', title: 'Venue Maps', desc: 'Integrated Google Maps' },
    { icon: '✅', title: 'RSVP Tracking', desc: 'Easy guest management' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-gray-800 mb-4">Everything You Need</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Create stunning digital invitations with all the features that matter</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div key={feature.title} className="p-8 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 hover:shadow-xl transition-all" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-serif text-xl text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== FOOTER ====================
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
                <span className="text-white font-serif text-xl">E</span>
              </div>
              <span className="font-serif text-2xl font-bold">Eternity</span>
            </div>
            <p className="text-gray-400 text-sm">Create beautiful digital wedding invitations that your guests will love.</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Templates</li><li>Pricing</li><li>Features</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>About</li><li>Blog</li><li>Careers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Help Center</li><li>Contact</li><li>Privacy</li>
            </ul>
          </div>
        </div>
        <hr className="border-gray-800 my-12" />
        <div className="text-center text-gray-500 text-sm">© 2024 Eternity. All rights reserved.</div>
      </div>
    </footer>
  )
}

// ==================== MAIN PAGE ====================
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  )
}
