"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Stripe webhook (raw body needed)
router.post('/webhook', (req, res) => {
    // TODO: add Stripe webhook logic when you add STRIPE_SECRET_KEY
    res.json({ received: true });
});
// Create checkout session
router.post('/create-checkout-session', auth_1.authenticate, async (req, res, next) => {
    try {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey || stripeKey === 'sk_test_add_later') {
            res.status(503).json({
                success: false,
                message: 'Payment not configured yet. Add STRIPE_SECRET_KEY to your .env file.',
            });
            return;
        }
        // Full Stripe logic goes here once key is added
        res.json({ success: true, message: 'Stripe integration ready' });
    }
    catch (err) {
        next(err);
    }
});
// Payment history
router.get('/history', auth_1.authenticate, async (_req, res) => {
    res.json({ success: true, payments: [] });
});
// Current plan
router.get('/plan', auth_1.authenticate, async (req, res, next) => {
    try {
        const User = (await Promise.resolve().then(() => __importStar(require('../models/User')))).default;
        const user = await User.findById(req.userId);
        res.json({ success: true, plan: user?.plan || 'free' });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
