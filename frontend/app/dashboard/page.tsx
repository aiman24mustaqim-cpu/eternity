'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { config } from '../lib/config'

interface Invitation {
  _id: string
  title: string
  templateId: string
  published: boolean
  shareableSlug: string
  createdAt: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchInvitations(token)
  }, [router])

  const fetchInvitations = async (token: string) => {
    try {
      const res = await fetch(`${config.apiUrl}/invitations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setInvitations(data.invitations || [])
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

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
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-rose-500">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-gray-800">Welcome back, {user?.name}! 👋</h1>
          <p className="text-gray-600 mt-2">Manage your wedding invitations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm" whileHover={{ scale: 1.02 }}>
            <div className="text-3xl font-bold text-rose-500">{invitations.length}</div>
            <div className="text-gray-600">Total Invitations</div>
          </motion.div>
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm" whileHover={{ scale: 1.02 }}>
            <div className="text-3xl font-bold text-emerald-500">
              {invitations.filter(i => i.published).length}
            </div>
            <div className="text-gray-600">Published</div>
          </motion.div>
          <motion.div className="bg-white rounded-2xl p-6 shadow-sm" whileHover={{ scale: 1.02 }}>
            <div className="text-3xl font-bold text-amber-500">{user?.plan || 'free'}</div>
            <div className="text-gray-600">Current Plan</div>
          </motion.div>
        </div>

        {/* Create New Button */}
        <div className="mb-8">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            + Create New Invitation
          </Link>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-serif text-xl text-gray-800">My Invitations</h2>
          </div>
          
          {invitations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="text-xl text-gray-800 mb-2">No invitations yet</h3>
              <p className="text-gray-600 mb-6">Create your first wedding invitation!</p>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-all"
              >
                Create Invitation
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {invitations.map((invitation) => (
                <div key={invitation._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-800">{invitation.title}</h3>
                    <p className="text-sm text-gray-500">
                      Template: {invitation.templateId} • Created: {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      invitation.published 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {invitation.published ? 'Published' : 'Draft'}
                    </span>
                    {invitation.published && invitation.shareableSlug && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${config.apiUrl.replace('/api', '')}/inv/${invitation.shareableSlug}`)
                        }}
                        className="text-sm text-rose-500 hover:underline"
                      >
                        Copy Link
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}