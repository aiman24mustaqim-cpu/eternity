'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { config } from '../lib/config'

const backgrounds = [
  { id: 'warm', colors: ['#f5e6d3', '#e8c9aa'], name: 'Warm Ivory' },
  { id: 'rose', colors: ['#f5e8f0', '#e6c5da'], name: 'Blush Rose' },
  { id: 'gold', colors: ['#f5f0e6', '#e8dcc0'], name: 'Golden Hour' },
  { id: 'forest', colors: ['#e8ede0', '#ccd9be'], name: 'Forest Green' },
  { id: 'midnight', colors: ['#1a1a2e', '#16213e'], name: 'Midnight' },
  { id: 'ocean', colors: ['#e8f0f0', '#c5d9d9'], name: 'Ocean Blue' },
  { id: 'islamic', colors: ['#f5f0e6', '#e8dcc0'], name: 'Islamic Gold' },
  { id: 'minimal', colors: ['#ffffff', '#f5f5f5'], name: 'Clean White' },
]

const fonts = [
  { id: 'great-vibes', name: 'Great Vibes', style: 'cursive' },
  { id: 'playfair', name: 'Playfair Display', style: 'serif' },
  { id: 'montserrat', name: 'Montserrat', style: 'sans-serif' },
  { id: 'cormorant', name: 'Cormorant Garamond', style: 'serif' },
]

export default function Studio() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: 'Our Wedding',
    brideName: '',
    groomName: '',
    date: '',
    time: '',
    venueName: '',
    venueAddress: '',
    templateId: 'floral-romance',
    background: 'warm',
    font: 'great-vibes',
    accentColor: '#C9A96E',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${config.apiUrl}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          templateId: formData.templateId,
          customData: {
            brideName: formData.brideName,
            groomName: formData.groomName,
            date: formData.date,
            time: formData.time,
            venueName: formData.venueName,
            venueAddress: formData.venueAddress,
            background: formData.background,
            accentColor: formData.accentColor,
            fontStyle: formData.font,
            message: formData.message,
          },
        }),
      })

      const data = await res.json()

      if (res.ok) {
        router.push('/dashboard')
      } else {
        alert(data.message || 'Failed to create invitation')
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const selectedBg = backgrounds.find(b => b.id === formData.background)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center">
              <span className="text-white font-serif text-xl">E</span>
            </div>
            <span className="font-serif text-2xl font-bold text-gray-800">Eternity</span>
          </Link>
          <Link href="/dashboard" className="text-rose-500 font-medium">Save & Exit</Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl text-gray-800 mb-4">Basic Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invitation Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bride Name</label>
                    <input
                      type="text"
                      name="brideName"
                      value={formData.brideName}
                      onChange={handleChange}
                      placeholder="Bride's name"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Groom Name</label>
                    <input
                      type="text"
                      name="groomName"
                      value={formData.groomName}
                      onChange={handleChange}
                      placeholder="Groom's name"
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl text-gray-800 mb-4">Date & Venue</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wedding Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                  <input
                    type="text"
                    name="venueName"
                    value={formData.venueName}
                    onChange={handleChange}
                    placeholder="e.g., Grand Ballroom"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue Address</label>
                  <textarea
                    name="venueAddress"
                    value={formData.venueAddress}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Full address"
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-rose-400 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-serif text-xl text-gray-800 mb-4">Design</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                  <div className="grid grid-cols-4 gap-3">
                    {backgrounds.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setFormData({ ...formData, background: bg.id })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          formData.background === bg.id
                            ? 'border-rose-500 ring-2 ring-rose-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-1"
                          style={{ background: `linear-gradient(135deg, ${bg.colors[0]}, ${bg.colors[1]})` }}
                        />
                        <span className="text-xs text-gray-600">{bg.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <input
                    type="color"
                    name="accentColor"
                    value={formData.accentColor}
                    onChange={handleChange}
                    className="w-full h-12 rounded-xl cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Invitation'}
            </button>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">Live Preview</h3>
              </div>
              
              {/* Preview Card */}
              <div 
                className="p-8 min-h-[500px] flex flex-col items-center justify-center text-center"
                style={{ 
                  background: selectedBg 
                    ? `linear-gradient(135deg, ${selectedBg.colors[0]}, ${selectedBg.colors[1]})`
                    : 'linear-gradient(135deg, #f5e6d3, #e8c9aa)'
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-md"
                >
                  <p className="text-sm uppercase tracking-widest text-gray-600 mb-4">You're Invited</p>
                  
                  <h1 
                    className="font-serif text-4xl text-gray-800 mb-2"
                    style={{ fontFamily: formData.font === 'great-vibes' ? 'cursive' : 'serif' }}
                  >
                    {formData.brideName || 'Bride'} & {formData.groomName || 'Groom'}
                  </h1>
                  
                  <div className="w-16 h-0.5 bg-gray-400 mx-auto my-4" />
                  
                  <p className="text-lg text-gray-700 mb-2">
                    {formData.date || 'Wedding Date'}
                  </p>
                  <p className="text-lg text-gray-700 mb-4">
                    {formData.time || 'Time'}
                  </p>
                  
                  <p className="text-gray-600 mb-4">
                    {formData.venueName || 'Venue'}
                  </p>
                  
                  <div 
                    className="inline-block px-6 py-2 rounded-full text-white text-sm font-medium mt-4"
                    style={{ backgroundColor: formData.accentColor }}
                  >
                    View Invitation →
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}