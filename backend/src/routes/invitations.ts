import { Router } from 'express'
import {
  getInvitations, getInvitation, createInvitation,
  updateInvitation, deleteInvitation, togglePublish,
  updateSlug, getPublicInvitation, trackView,
  submitRsvp, submitGuestbook, getRsvps,
} from '../controllers/invitationController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Protected routes
router.get('/', authenticate, getInvitations)
router.post('/', authenticate, createInvitation)
router.get('/:id', authenticate, getInvitation)
router.put('/:id', authenticate, updateInvitation)
router.delete('/:id', authenticate, deleteInvitation)
router.patch('/:id/publish', authenticate, togglePublish)
router.patch('/:id/slug', authenticate, updateSlug)
router.get('/:id/rsvps', authenticate, getRsvps)

// Public routes
router.get('/public/:slug', getPublicInvitation)
router.post('/public/:slug/view', trackView)
router.post('/public/:slug/rsvp', submitRsvp)
router.post('/public/:slug/guestbook', submitGuestbook)

export default router