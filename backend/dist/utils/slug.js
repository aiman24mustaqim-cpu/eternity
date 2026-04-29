"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomSlug = exports.generateInvitationSlug = void 0;
const generateInvitationSlug = (bride, groom) => {
    const clean = (str) => str.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 20);
    const suffix = Math.random().toString(36).substring(2, 6);
    return `${clean(bride) || 'bride'}-${clean(groom) || 'groom'}-${suffix}`;
};
exports.generateInvitationSlug = generateInvitationSlug;
const generateRandomSlug = () => {
    return Math.random().toString(36).substring(2, 12);
};
exports.generateRandomSlug = generateRandomSlug;
