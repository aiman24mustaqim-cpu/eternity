import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'
import User from '../models/User'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      userPlan?: string
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No authentication token provided' })
      return
    }
    const token = header.split(' ')[1]
    const payload = verifyToken(token)
    if (!payload) {
      res.status(401).json({ message: 'Invalid or expired token. Please login again.' })
      return
    }
    const user = await User.findById(payload.userId).select('_id email plan')
    if (!user) {
      res.status(401).json({ message: 'User account no longer exists' })
      return
    }
    req.userId = payload.userId
    req.userEmail = user.email
    req.userPlan = user.plan
    next()
  } catch (err) {
    res.status(500).json({ message: 'Authentication error' })
  }
}