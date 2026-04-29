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
exports.Invitation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InvitationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    templateId: { type: String, required: true, default: 'floral-romance' },
    title: { type: String, required: true, trim: true },
    customData: {
        brideName: { type: String, default: 'Bride' },
        groomName: { type: String, default: 'Groom' },
        brideFullName: String,
        groomFullName: String,
        date: { type: String, required: true },
        time: { type: String, default: '10:00' },
        endTime: String,
        venueName: { type: String, default: '' },
        venueAddress: { type: String, default: '' },
        venueMapUrl: String,
        message: String,
        background: { type: String, default: 'warm' },
        accentColor: { type: String, default: '#C9A96E' },
        textColor: { type: String, default: '#2C2825' },
        fontStyle: { type: String, default: "'Great Vibes', cursive" },
        galleryImages: [{ type: String }],
        coverImage: String,
        musicUrl: String,
        musicName: String,
        musicAutoPlay: { type: Boolean, default: false },
        rsvpDeadline: String,
        rsvpPhone: String,
        showCountdown: { type: Boolean, default: true },
        showGuestbook: { type: Boolean, default: true },
    },
    published: { type: Boolean, default: false, index: true },
    shareableSlug: { type: String, unique: true, index: true, trim: true, lowercase: true },
    views: { type: Number, default: 0, min: 0 },
    rsvps: [{
            name: { type: String, required: true },
            phone: String,
            attending: { type: String, enum: ['yes', 'no', 'maybe'], required: true },
            guests: { type: Number, default: 1 },
            message: String,
            createdAt: { type: Date, default: Date.now },
        }],
    guestbook: [{
            name: { type: String, required: true },
            message: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }],
}, { timestamps: true });
const Invitation = mongoose_1.default.model('Invitation', InvitationSchema);
exports.Invitation = Invitation;
exports.default = Invitation;
