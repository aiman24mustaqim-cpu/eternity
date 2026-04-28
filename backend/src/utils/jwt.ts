import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production'
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d'

export interface TokenPayload {
  userId: string
  email: string
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email } as TokenPayload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions)
}

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, SECRET) as TokenPayload
  } catch {
    return null
  }
}