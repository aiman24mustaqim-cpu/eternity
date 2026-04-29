"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const TEMPLATES = [
    { id: 'floral-romance', name: 'Floral Romance', category: 'floral', description: 'Soft botanical aesthetics', plan: 'free', colors: ['#f5e6d3', '#e8c9aa', '#C9A96E'] },
    { id: 'garden-serenity', name: 'Garden Serenity', category: 'floral', description: 'Lush green botanical', plan: 'basic', colors: ['#e8f0e8', '#c5d9c5', '#8A9E8C'] },
    { id: 'midnight-luxury', name: 'Midnight Luxury', category: 'luxury', description: 'Deep midnight with gold', plan: 'basic', colors: ['#1a1a2e', '#16213e', '#C9A96E'] },
    { id: 'islamic-elegance', name: 'Islamic Elegance', category: 'islamic', description: 'Geometric Islamic inspired', plan: 'basic', colors: ['#f5f0e6', '#e8dcc0', '#8B6914'] },
    { id: 'minimal-modern', name: 'Minimal Modern', category: 'minimal', description: 'Clean contemporary feel', plan: 'free', colors: ['#ffffff', '#f5f5f5', '#2C2825'] },
    { id: 'blush-velvet', name: 'Blush Velvet', category: 'modern', description: 'Luxurious blush tones', plan: 'basic', colors: ['#f5e8f0', '#e6c5da', '#C4847A'] },
    { id: 'ocean-breeze', name: 'Ocean Breeze', category: 'minimal', description: 'Clean teal for beach weddings', plan: 'free', colors: ['#e8f0f0', '#c5d9d9', '#4A8A8A'] },
    { id: 'golden-hour', name: 'Golden Hour', category: 'luxury', description: 'Warm sunset gold tones', plan: 'premium', colors: ['#f5f0e6', '#e8dcc0', '#A07840'] },
    { id: 'rose-duet', name: 'Rose Duet', category: 'floral', description: 'Romantic rose motifs', plan: 'basic', colors: ['#f0e8e8', '#d9c5c5', '#C4847A'] },
    { id: 'forest-vow', name: 'Forest Vow', category: 'minimal', description: 'Earthy greens for nature lovers', plan: 'basic', colors: ['#e8ede0', '#ccd9be', '#6a8a50'] },
];
router.get('/', (req, res) => {
    const { category } = req.query;
    let templates = TEMPLATES;
    if (category && category !== 'all') {
        templates = templates.filter(t => t.category === category);
    }
    res.json({ success: true, templates });
});
router.get('/:id', (req, res) => {
    const template = TEMPLATES.find(t => t.id === req.params.id);
    if (!template) {
        res.status(404).json({ success: false, message: 'Template not found' });
        return;
    }
    res.json({ success: true, template });
});
exports.default = router;
