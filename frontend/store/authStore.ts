import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface User {
  _id: string
  name: string
  email: string
  plan: 'free' | 'basic' | 'premium'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/login', { email, password })
          localStorage.setItem('eternity_token', data.token)
          set({ user: data.user, token: data.token, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await api.post('/auth/register', { name, email, password })
          localStorage.setItem('eternity_token', data.token)
          set({ user: data.user, token: data.token, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('eternity_token')
        set({ user: null, token: null })
      },

      checkAuth: async () => {
        const token = localStorage.getItem('eternity_token')
        if (!token) return
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user, token })
        } catch {
          localStorage.removeItem('eternity_token')
          set({ user: null, token: null })
        }
      },
    }),
    { name: 'eternity-auth', partialize: (s) => ({ token: s.token }) }
  )
)