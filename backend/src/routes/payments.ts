// payments.ts
import { Router as PRouter } from 'express'
import {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getPlanDetails,
} from '../controllers/paymentController'
import { authenticate } from '../middleware/auth'

const paymentRouter = PRouter()

// Webhook must use raw body — configured in index.ts
paymentRouter.post('/webhook', handleWebhook)
paymentRouter.post('/create-checkout-session', authenticate, createCheckoutSession)
paymentRouter.get('/history', authenticate, getPaymentHistory)
paymentRouter.get('/plan', authenticate, getPlanDetails)

export { paymentRouter as default }