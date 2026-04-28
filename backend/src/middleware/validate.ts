import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ')
    res.status(400).json({ success: false, message: messages, errors: errors.array() })
    return
  }
  next()
}