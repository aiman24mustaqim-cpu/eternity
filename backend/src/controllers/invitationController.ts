import { Request, Response, NextFunction } from 'express'
import Invitation from '../models/Invitation'
import User from '../models/User'
import { generateInvitationSlug } from '../utils/slug'

export const getInvitations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitations = await Invitation.find({ userId: req.userId }).select('-rsvps -guestbook').sort({ createdAt: -1 })
    res.json({ success: true, invitations })
  } catch (err) { next(err) }
}

export const getInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOne({ _id: req.params.id, userId: req.userId })
    if (!invitation) { res.status(404).json({ success: false, message: 'Invitation not found' }); return }
    res.json({ success: true, invitation })
  } catch (err) { next(err) }
}

export const createInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId)
    if (!user) { res.status(404).json({ success: false, message: 'User not found' }); return }

    const count = await Invitation.countDocuments({ userId: req.userId })
    if (!user.canCreateInvitation(count)) {
      res.status(403).json({ success: false, message: 'Upgrade your plan to create more invitations', upgradeRequired: true })
      return
    }

    const brideName = req.body.customData?.brideName || 'bride'
    const groomName = req.body.customData?.groomName || 'groom'
    let slug = generateInvitationSlug(brideName, groomName)
    while (await Invitation.findOne({ shareableSlug: slug })) {
      slug = generateInvitationSlug(brideName, groomName)
    }

    const invitation = await Invitation.create({
      userId: req.userId,
      templateId: req.body.templateId || 'floral-romance',
      title: req.body.title || (brideName + ' & ' + groomName),
      customData: req.body.customData || {
        brideName, groomName,
        date: new Date().toISOString().split('T')[0],
        time: '10:00', venueName: '', venueAddress: '',
        background: 'warm', accentColor: '#C9A96E', textColor: '#2C2825',
        fontStyle: "'Great Vibes', cursive", galleryImages: [],
        musicAutoPlay: false, showCountdown: true, showGuestbook: true,
      },
      shareableSlug: slug,
    })
    res.status(201).json({ success: true, message: 'Invitation created!', invitation })
  } catch (err) { next(err) }
}

export const updateInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { ...(req.body.title && { title: req.body.title }), ...(req.body.templateId && { templateId: req.body.templateId }), ...(req.body.customData && { customData: req.body.customData }) },
      { new: true, runValidators: true }
    )
    if (!invitation) { res.status(404).json({ success: false, message: 'Invitation not found' }); return }
    res.json({ success: true, message: 'Invitation updated', invitation })
  } catch (err) { next(err) }
}

export const deleteInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!invitation) { res.status(404).json({ success: false, message: 'Invitation not found' }); return }
    res.json({ success: true, message: 'Invitation deleted' })
  } catch (err) { next(err) }
}

export const togglePublish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOne({ _id: req.params.id, userId: req.userId })
    if (!invitation) { res.status(404).json({ success: false, message: 'Not found' }); return }
    invitation.published = !invitation.published
    await invitation.save()
    res.json({
      success: true,
      message: invitation.published ? 'Invitation is now live!' : 'Invitation unpublished',
      published: invitation.published,
      shareableSlug: invitation.shareableSlug,
      shareUrl: process.env.APP_URL + '/inv/' + invitation.shareableSlug,
    })
  } catch (err) { next(err) }
}

export const updateSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.body
    if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
      res.status(400).json({ success: false, message: 'Invalid slug format' }); return
    }
    const exists = await Invitation.findOne({ shareableSlug: slug })
    if (exists && exists._id.toString() !== req.params.id) {
      res.status(400).json({ success: false, message: 'This URL is already taken' }); return
    }
    const invitation = await Invitation.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { shareableSlug: slug }, { new: true })
    if (!invitation) { res.status(404).json({ success: false, message: 'Not found' }); return }
    res.json({ success: true, shareableSlug: invitation.shareableSlug })
  } catch (err) { next(err) }
}

export const getPublicInvitation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOne({ shareableSlug: req.params.slug, published: true }).select('-userId')
    if (!invitation) { res.status(404).json({ success: false, message: 'Invitation not found or not published' }); return }
    res.json({ success: true, invitation })
  } catch (err) { next(err) }
}

export const trackView = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Invitation.findOneAndUpdate({ shareableSlug: req.params.slug, published: true }, { $inc: { views: 1 } })
    res.json({ success: true })
  } catch (err) { next(err) }
}

export const submitRsvp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, phone, attending, guests, message } = req.body
    if (!name || !attending) { res.status(400).json({ success: false, message: 'Name and attendance required' }); return }
    const invitation = await Invitation.findOneAndUpdate(
      { shareableSlug: req.params.slug, published: true },
      { $push: { rsvps: { name, phone, attending, guests: guests || 1, message, createdAt: new Date() } } },
      { new: true }
    )
    if (!invitation) { res.status(404).json({ success: false, message: 'Invitation not found' }); return }
    res.json({ success: true, message: 'RSVP submitted! See you there!' })
  } catch (err) { next(err) }
}

export const submitGuestbook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, message } = req.body
    if (!name || !message) { res.status(400).json({ success: false, message: 'Name and message required' }); return }
    const invitation = await Invitation.findOneAndUpdate(
      { shareableSlug: req.params.slug, published: true },
      { $push: { guestbook: { name, message, createdAt: new Date() } } },
      { new: true }
    )
    if (!invitation) { res.status(404).json({ success: false, message: 'Not found' }); return }
    res.json({ success: true, message: 'Wishes shared!' })
  } catch (err) { next(err) }
}

export const getRsvps = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const invitation = await Invitation.findOne({ _id: req.params.id, userId: req.userId }).select('rsvps title')
    if (!invitation) { res.status(404).json({ success: false, message: 'Not found' }); return }
    const summary = {
      total: invitation.rsvps.length,
      attending: invitation.rsvps.filter(r => r.attending === 'yes').length,
      notAttending: invitation.rsvps.filter(r => r.attending === 'no').length,
      maybe: invitation.rsvps.filter(r => r.attending === 'maybe').length,
    }
    res.json({ success: true, rsvps: invitation.rsvps, summary })
  } catch (err) { next(err) }
}