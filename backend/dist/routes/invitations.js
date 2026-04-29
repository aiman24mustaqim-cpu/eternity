"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitationController_1 = require("../controllers/invitationController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protected routes
router.get('/', auth_1.authenticate, invitationController_1.getInvitations);
router.post('/', auth_1.authenticate, invitationController_1.createInvitation);
router.get('/:id', auth_1.authenticate, invitationController_1.getInvitation);
router.put('/:id', auth_1.authenticate, invitationController_1.updateInvitation);
router.delete('/:id', auth_1.authenticate, invitationController_1.deleteInvitation);
router.patch('/:id/publish', auth_1.authenticate, invitationController_1.togglePublish);
router.patch('/:id/slug', auth_1.authenticate, invitationController_1.updateSlug);
router.get('/:id/rsvps', auth_1.authenticate, invitationController_1.getRsvps);
// Public routes
router.get('/public/:slug', invitationController_1.getPublicInvitation);
router.post('/public/:slug/view', invitationController_1.trackView);
router.post('/public/:slug/rsvp', invitationController_1.submitRsvp);
router.post('/public/:slug/guestbook', invitationController_1.submitGuestbook);
exports.default = router;
