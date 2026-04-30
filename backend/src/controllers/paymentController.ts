import { Request, Response, NextFunction } from 'express'
import Stripe from 'stripe'
import User from '../models/User'
import Payment from '../models/Payment'
import { PACKAGES, formatPrice } from '../config/packages'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

/**
 * ================================================================
 * PAYMENT FLOW (Step-by-step for beginners):
 * 
 * 1. User clicks "Buy Basic Plan" on frontend
 * 2. Frontend calls POST /api/payments/create-checkout-session
 * 3. Backend creates a Stripe Checkout Session
 * 4. Backend returns a checkout URL
 * 5. Frontend redirects user to Stripe's checkout page
 * 6. User enters card details on Stripe (not on your site!)
 * 7. Stripe processes payment
 * 8. On success: Stripe redirects to success_url
 * 9. On failure: Stripe redirects to cancel_url
 * 10. Stripe also sends a webhook to /api/payments/webhook
 * 11. Webhook updates database (upgrades user plan)
 * 
 * WHY WEBHOOK? 
 * The redirect alone isn't reliable (user might close browser).
 * Webhooks are server-to-server and always fire.
 * ================================================================
 */

// ── Create Stripe Checkout Session ──
export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key_here') {
      res.status(503).json({
        success: false,
        message: 'Payment system not configured. Please add STRIPE_SECRET_KEY to backend .env',
        devNote: 'Get your Stripe keys from https://dashboard.stripe.com/apikeys',
      })
      return
    }

    const { packageId } = req.body
    const pkg = PACKAGES[packageId]

    if (!pkg || packageId === 'free') {
      res.status(400).json({ success: false, message: 'Invalid package' })
      return
    }

    const user = await User.findById(req.userId)
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    // Already on this plan
    if (user.plan === packageId) {
      res.status(400).json({ success: false, message: 'You are already on this plan' })
      return
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      })
      customerId = customer.id
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'payment',         // One-time payment (use 'subscription' for recurring)
      line_items: [
        {
          price_data: {
            currency: pkg.currency,
            product_data: {
              name: `Eternity ${pkg.name} Plan`,
              description: pkg.description,
              images: [`${process.env.APP_URL}/logo.png`].filter(Boolean),
            },
            unit_amount: pkg.price,  // Amount in smallest unit (e.g., 5900 = RM59.00)
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        packageId,
        userEmail: user.email,
      },
      success_url: `${process.env.APP_URL}/dashboard?payment=success&package=${packageId}`,
      cancel_url: `${process.env.APP_URL}/packages?payment=cancelled`,
    })

    // Create pending payment record
    await Payment.create({
      userId: user._id,
      packageId,
      amount: pkg.price,
      currency: pkg.currency,
      status: 'pending',
      stripeSessionId: session.id,
    })

    res.json({ success: true, url: session.url })
  } catch (err) {
    next(err)
  }
}

// ── Handle Stripe Webhook ──
export const handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'] as string
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    if (endpointSecret) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
      } catch (err) {
        console.error('Webhook signature verification failed:', err)
        res.status(400).send(`Webhook Error: ${(err as Error).message}`)
        return
      }
    } else {
      event = req.body as Stripe.Event
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { userId, packageId } = session.metadata || {}

        if (userId && packageId) {
          // Update payment status
          await Payment.findOneAndUpdate(
            { stripeSessionId: session.id },
            { status: 'completed', stripePaymentIntentId: session.payment_intent as string }
          )

          // Upgrade user plan
          const planExpiresAt = new Date()
          planExpiresAt.setMonth(planExpiresAt.getMonth() + 1) // 1 month validity

          await User.findByIdAndUpdate(userId, {
            plan: packageId,
            planExpiresAt,
          })

          console.log(`✅ Payment completed for user ${userId}, plan upgraded to ${packageId}`)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
}

// ── Get Payment History ──
export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-stripePaymentIntentId')

    const formatted = payments.map((p) => ({
      ...p.toObject(),
      formattedAmount: formatPrice(p.amount, p.currency),
    }))

    res.json({ success: true, payments: formatted })
  } catch (err) {
    next(err)
  }
}

// ── Get current plan details ──
export const getPlanDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' })
      return
    }

    const pkg = PACKAGES[user.plan]
    const invitationCount = await (await import('../models/Invitation')).default.countDocuments({ userId: req.userId })

    res.json({
      success: true,
      plan: {
        ...pkg,
        currentPlan: user.plan,
        invitationsUsed: invitationCount,
        invitationsRemaining: pkg.features.maxInvitations === -1
          ? 'unlimited'
          : Math.max(0, pkg.features.maxInvitations - invitationCount),
      },
    })
  } catch (err) {
    next(err)
  }
}