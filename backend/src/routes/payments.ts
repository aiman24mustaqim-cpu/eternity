import { Router } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

// Stripe webhook (raw body needed)
router.post('/webhook', (req, res) => {
  // TODO: add Stripe webhook logic when you add STRIPE_SECRET_KEY
  res.json({ received: true })
})

// Create checkout session
router.post('/create-checkout-session', authenticate, async (req, res, next) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (!stripeKey || stripeKey === 'sk_test_add_later') {
      res.status(503).json({
        success: false,
        message: 'Payment not configured yet. Add STRIPE_SECRET_KEY to your .env file.',
      })
      return
    }
    // Full Stripe logic goes here once key is added
    res.json({ success: true, message: 'Stripe integration ready' })
  } catch (err) {
    next(err)
  }
})

// Payment history
router.get('/history', authenticate, async (_req, res) => {
  res.json({ success: true, payments: [] })
})

// Current plan
router.get('/plan', authenticate, async (req, res, next) => {
  try {
    const User = (await import('../models/User')).default
    const user = await User.findById(req.userId)
    res.json({ success: true, plan: user?.plan || 'free' })
  } catch (err) {
    next(err)
  }
})

export default router