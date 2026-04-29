'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const templates = [
  { id: 'floral-romance', name: 'Floral Romance', category: 'floral', description: 'Soft botanical aesthetics', emoji: '🌸', colors: ['#f5e6d3', '#e8c9aa', '#C9A96E'] },
  { id: 'garden-serenity', name: 'Garden Serenity', category: 'floral', description: 'Lush green botanical', emoji: '🌿', colors: ['#e8f0e8', '#c5d9c5', '#8A9E8C'] },
  { id: 'midnight-luxury', name: 'Midnight Luxury', category: 'luxury', description: 'Deep midnight with gold', emoji: '✨', colors: ['#1a1a2e', '#16213e', '#C9A96E'] },
  { id: 'islamic-elegance', name: 'Islamic Elegance', category: 'islamic', description: 'Geometric Islamic inspired', emoji: '🕌', colors: ['#f5f0e6', '#e8dcc0', '#8B6914'] },
  { id: 'minimal-modern', name: 'Minimal Modern', category: 'minimal', description: 'Clean contemporary feel', emoji: '💫', colors: ['#ffffff', '#f5f5f5', '#2C2825'] },
  { id: 'blush-velvet', name: 'Blush Velvet', category: 'modern', description: 'Luxurious blush tones', emoji: '🌺', colors: ['#f5e8f0', '#e6c5da', '#C4847A'] },
  { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'minimal', description: 'Clean teal for beach weddings', emoji: '🌊', colors: ['#e8f0f0', '#c5d9d9', '#4A8A8A'] },
  { id: 'golden-hour', name: 'Golden Hour', category: 'luxury', description: 'Warm sunset gold tones', emoji: '🌅', colors: ['#f5f0e6', '#e8dcc0', '#A07840'] },
  { id: 'rose-duet', name: 'Rose Duet', category: 'floral', description: 'Romantic rose motifs', emoji: '🌹', colors: ['#f0e8e8', '#d9c5c5', '#C4847A'] },
  { id: 'forest-vow', name: 'Forest Vow', category: 'minimal', description: 'Earthy greens for nature lovers', emoji: '🌲', colors: ['#e8ede0', '#ccd9be', '#6a8a50'] },
]

const categories = ['all', 'floral', 'luxury', 'islamic', 'minimal', 'modern']

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null)

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory)

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
        <h1 className="font-serif text-5xl text-gray-800 mb-4">Choose Your Template</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Select from our beautifully designed wedding invitation templates</p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-rose-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-rose-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              {/* Preview */}
              <div 
                className="h-48 p-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1]})` }}
              >
                <span className="text-6xl">{template.emoji}</span>
              </div>
              
              {/* Info */}
              <div className="p-5">
                <h3 className="font-serif text-lg text-gray-800">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                <div className="flex gap-1 mt-3">
                  {template.colors.map((color, idx) => (
                    <div key={idx} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTemplate(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="h-40 rounded-2xl mb-6 flex items-center justify-center text-7xl"
              style={{ background: `linear-gradient(135deg, ${selectedTemplate.colors[0]}, ${selectedTemplate.colors[1]})` }}
            >
              {selectedTemplate.emoji}
            </div>
            <h3 className="font-serif text-2xl text-gray-800">{selectedTemplate.name}</h3>
            <p className="text-gray-600 mt-2">{selectedTemplate.description}</p>
            <div className="flex gap-2 mt-4">
              {selectedTemplate.colors.map((color, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <Link
                href="/register"
                className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-center font-medium rounded-xl hover:shadow-lg"
              >
                Use This Template
              </Link>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}