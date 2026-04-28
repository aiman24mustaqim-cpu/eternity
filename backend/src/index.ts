import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/auth'
import invitationRoutes from './routes/invitations'
import templateRoutes from './routes/templates'
import packageRoutes from './routes/packages'
import paymentRoutes from './routes/payments'
import uploadRoutes from './routes/uploads'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || '5000'

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}))

app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api', limiter)

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/templates', templateRoutes)
app.use('/api/packages', packageRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/uploads', uploadRoutes)

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', app: process.env.APP_NAME || 'Eternity' })
})

app.use('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`\n✦ Eternity API running on port ${PORT}`)
    console.log(`✦ Environment: ${process.env.NODE_ENV}\n`)
  })
}

startServer()
export default app