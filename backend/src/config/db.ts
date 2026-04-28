import mongoose from 'mongoose'

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternity'
  try {
    const conn = await mongoose.connect(uri)
    console.log(`✦ MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error('MongoDB connection failed:', err)
    process.exit(1)
  }
}