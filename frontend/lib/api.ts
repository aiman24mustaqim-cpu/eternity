import axios from 'axios'
import { config } from './config'

const api = axios.create({
  baseURL: config.apiUrl,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every request
api.interceptors.request.use((req) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('eternity_token')
    if (token) req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eternity_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api