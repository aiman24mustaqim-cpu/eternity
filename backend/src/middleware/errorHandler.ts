import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = 'Validation error'
  }
  if ((err as any).code === 11000) {
    statusCode = 400
    message = 'Duplicate entry — this value already exists'
  }
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  console.error(`[ERROR] ${statusCode} - ${message}`)

  res.status(statusCode).json({
    success: false,
    message,
    ...( process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}