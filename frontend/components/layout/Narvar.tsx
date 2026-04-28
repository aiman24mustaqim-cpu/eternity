'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { config } from '@/lib/config'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Templates' },
  { href: '/packages', label: 'Packages' },
  { href: '/tutorial', label: 'Tutorial' },
  { href: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-[5vw] transition-all duration-300
          ${scrolled ? 'h-[60px] shadow-md' : 'h-[72px]'}
          backdrop-blur-xl bg-ivory/85 border-b border-gold/10`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="h-full flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-light to-gold-dark flex items-center justify-center text-white font-great-vibes text-lg">
              E
            </div>
            <span className="font-cormorant text-[22px] font-medium text-charcoal tracking-wide">
              {config.appName}
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300
                  ${pathname === link.href
                    ? 'text-gold-dark font-medium'
                    : 'text-warm-gray hover:text-charcoal hover:bg-gold/8'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                className="ml-2 px-6 py-2.5 rounded-full text-sm font-medium bg-charcoal text-white hover:bg-charcoal/90 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/studio"
                className="ml-2 px-6 py-2.5 rounded-full text-sm font-medium bg-gradient-to-br from-gold-light to-gold-dark text-white shadow-gold/30 shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Studio ✦
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-ivory/97 backdrop-blur-xl flex flex-col items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-6 right-6 p-2"
              onClick={() => setMobileOpen(false)}
            >
              <X size={28} className="text-warm-gray" />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link
                  href={link.href}
                  className="font-cormorant text-4xl font-normal text-charcoal hover:text-gold-dark transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <Link
                href={user ? '/dashboard' : '/login'}
                className="mt-4 font-medium text-xl text-gold-dark"
                onClick={() => setMobileOpen(false)}
              >
                {user ? 'Dashboard →' : 'Sign In →'}
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}