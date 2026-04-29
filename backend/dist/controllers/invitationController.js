"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRsvps = exports.submitGuestbook = exports.submitRsvp = exports.trackView = exports.getPublicInvitation = exports.updateSlug = exports.togglePublish = exports.deleteInvitation = exports.updateInvitation = exports.createInvitation = exports.getInvitation = exports.getInvitations = void 0;
const Invitation_1 = __importDefault(require("../models/Invitation"));
const User_1 = __importDefault(require("../models/User"));
const slug_1 = require("../utils/slug");
const getInvitations = async (req, res, next) => {
    try {
        const invitations = await Invitation_1.default.find({ userId: req.userId }).select('-rsvps -guestbook').sort({ createdAt: -1 });
        res.json({ success: true, invitations });
    }
    catch (err) {
        next(err);
    }
};
exports.getInvitations = getInvitations;
const getInvitation = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOne({ _id: req.params.id, userId: req.userId });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Invitation not found' });
            return;
        }
        res.json({ success: true, invitation });
    }
    catch (err) {
        next(err);
    }
};
exports.getInvitation = getInvitation;
const createInvitation = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const count = await Invitation_1.default.countDocuments({ userId: req.userId });
        if (!user.canCreateInvitation(count)) {
            res.status(403).json({ success: false, message: 'Upgrade your plan to create more invitations', upgradeRequired: true });
            return;
        }
        const brideName = req.body.customData?.brideName || 'bride';
        const groomName = req.body.customData?.groomName || 'groom';
        let slug = (0, slug_1.generateInvitationSlug)(brideName, groomName);
        while (await Invitation_1.default.findOne({ shareableSlug: slug })) {
            slug = (0, slug_1.generateInvitationSlug)(brideName, groomName);
        }
        const invitation = await Invitation_1.default.create({
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
        });
        res.status(201).json({ success: true, message: 'Invitation created!', invitation });
    }
    catch (err) {
        next(err);
    }
};
exports.createInvitation = createInvitation;
const updateInvitation = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { ...(req.body.title && { title: req.body.title }), ...(req.body.templateId && { templateId: req.body.templateId }), ...(req.body.customData && { customData: req.body.customData }) }, { new: true, runValidators: true });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Invitation not found' });
            return;
        }
        res.json({ success: true, message: 'Invitation updated', invitation });
    }
    catch (err) {
        next(err);
    }
};
exports.updateInvitation = updateInvitation;
const deleteInvitation = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Invitation not found' });
            return;
        }
        res.json({ success: true, message: 'Invitation deleted' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteInvitation = deleteInvitation;
const togglePublish = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOne({ _id: req.params.id, userId: req.userId });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        invitation.published = !invitation.published;
        await invitation.save();
        res.json({
            success: true,
            message: invitation.published ? 'Invitation is now live!' : 'Invitation unpublished',
            published: invitation.published,
            shareableSlug: invitation.shareableSlug,
            shareUrl: process.env.APP_URL + '/inv/' + invitation.shareableSlug,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.togglePublish = togglePublish;
const updateSlug = async (req, res, next) => {
    try {
        const { slug } = req.body;
        if (!slug || !/^[a-z0-9-]+$/.test(slug) || slug.length < 3) {
            res.status(400).json({ success: false, message: 'Invalid slug format' });
            return;
        }
        const exists = await Invitation_1.default.findOne({ shareableSlug: slug });
        if (exists && exists._id.toString() !== req.params.id) {
            res.status(400).json({ success: false, message: 'This URL is already taken' });
            return;
        }
        const invitation = await Invitation_1.default.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { shareableSlug: slug }, { new: true });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, shareableSlug: invitation.shareableSlug });
    }
    catch (err) {
        next(err);
    }
};
exports.updateSlug = updateSlug;
const getPublicInvitation = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOne({ shareableSlug: req.params.slug, published: true }).select('-userId');
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Invitation not found or not published' });
            return;
        }
        res.json({ success: true, invitation });
    }
    catch (err) {
        next(err);
    }
};
exports.getPublicInvitation = getPublicInvitation;
const trackView = async (req, res, next) => {
    try {
        await Invitation_1.default.findOneAndUpdate({ shareableSlug: req.params.slug, published: true }, { $inc: { views: 1 } });
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
};
exports.trackView = trackView;
const submitRsvp = async (req, res, next) => {
    try {
        const { name, phone, attending, guests, message } = req.body;
        if (!name || !attending) {
            res.status(400).json({ success: false, message: 'Name and attendance required' });
            return;
        }
        const invitation = await Invitation_1.default.findOneAndUpdate({ shareableSlug: req.params.slug, published: true }, { $push: { rsvps: { name, phone, attending, guests: guests || 1, message, createdAt: new Date() } } }, { new: true });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Invitation not found' });
            return;
        }
        res.json({ success: true, message: 'RSVP submitted! See you there!' });
    }
    catch (err) {
        next(err);
    }
};
exports.submitRsvp = submitRsvp;
const submitGuestbook = async (req, res, next) => {
    try {
        const { name, message } = req.body;
        if (!name || !message) {
            res.status(400).json({ success: false, message: 'Name and message required' });
            return;
        }
        const invitation = await Invitation_1.default.findOneAndUpdate({ shareableSlug: req.params.slug, published: true }, { $push: { guestbook: { name, message, createdAt: new Date() } } }, { new: true });
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, message: 'Wishes shared!' });
    }
    catch (err) {
        next(err);
    }
};
exports.submitGuestbook = submitGuestbook;
const getRsvps = async (req, res, next) => {
    try {
        const invitation = await Invitation_1.default.findOne({ _id: req.params.id, userId: req.userId }).select('rsvps title');
        if (!invitation) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        const summary = {
            total: invitation.rsvps.length,
            attending: invitation.rsvps.filter(r => r.attending === 'yes').length,
            notAttending: invitation.rsvps.filter(r => r.attending === 'no').length,
            maybe: invitation.rsvps.filter(r => r.attending === 'maybe').length,
        };
        res.json({ success: true, rsvps: invitation.rsvps, summary });
    }
    catch (err) {
        next(err);
    }
};
exports.getRsvps = getRsvps;
