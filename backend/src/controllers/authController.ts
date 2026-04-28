import { Request, Response, NextFunction } from 'express'
import User from '../models/User'
import { generateToken } from '../utils/jwt'

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(400).json({ success: false, message: 'Email is already registered' })
      return
    }
    const user = await User.create({ name, email, password })
    const token = generateToken(user._id.toString(), user.email)
    res.status(201).json({ success: true, message: 'Account created!', token, user })
  } catch (err) { next(err) }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }
    const token = generateToken(user._id.toString(), user.email)
    const userObj = user.toObject() as any
    delete userObj.password
    res.json({ success: true, message: 'Welcome back!', token, user: userObj })
  } catch (err) { next(err) }
}

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return }
    res.json({ success: true, user })
  } catch (err) { next(err) }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.userId, { name: req.body.name, avatar: req.body.avatar }, { new: true })
    res.json({ success: true, user })
  } catch (err) { next(err) }
}