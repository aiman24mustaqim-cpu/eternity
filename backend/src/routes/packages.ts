import { Router } from 'express'

const router = Router()

const PACKAGES = [
  {
    id: 'free', name: 'Free', price: 0, currency: 'myr', displayPrice: 'Free',
    highlighted: false,
    features: { maxInvitations: 1, maxPhotos: 5, musicUpload: false, customSlug: false, removeBranding: false, rsvpManagement: false, analytics: false }
  },
  {
    id: 'basic', name: 'Basic', price: 5900, currency: 'myr', displayPrice: 'RM59',
    highlighted: true, badge: 'Most Popular',
    features: { maxInvitations: 3, maxPhotos: 20, musicUpload: true, customSlug: true, removeBranding: true, rsvpManagement: false, analytics: false }
  },
  {
    id: 'premium', name: 'Premium', price: 12900, currency: 'myr', displayPrice: 'RM129',
    highlighted: false, badge: 'Best Value',
    features: { maxInvitations: -1, maxPhotos: -1, musicUpload: true, customSlug: true, removeBranding: true, rsvpManagement: true, analytics: true }
  },
]

router.get('/', (_req, res) => {
  res.json({ success: true, packages: PACKAGES })
})

router.get('/:id', (req, res) => {
  const pkg = PACKAGES.find(p => p.id === req.params.id)
  if (!pkg) { res.status(404).json({ success: false, message: 'Package not found' }); return }
  res.json({ success: true, package: pkg })
})

export default router