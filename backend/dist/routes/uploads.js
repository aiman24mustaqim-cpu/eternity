"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const musicDir = path_1.default.join(uploadDir, 'music');
const imagesDir = path_1.default.join(uploadDir, 'images');
[uploadDir, musicDir, imagesDir].forEach(dir => {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
});
const storage = multer_1.default.diskStorage({
    destination: (req, _file, cb) => {
        const type = req.query.type || 'images';
        cb(null, type === 'music' ? musicDir : imagesDir);
    },
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path_1.default.extname(file.originalname));
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});
router.post('/', auth_1.authenticate, upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
    }
    const type = req.query.type || 'images';
    const subDir = type === 'music' ? 'music' : 'images';
    const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${subDir}/${req.file.filename}`;
    res.json({ success: true, url, filename: req.file.filename });
});
router.delete('/', auth_1.authenticate, (req, res) => {
    const { filename, type } = req.body;
    if (!filename) {
        res.status(400).json({ success: false, message: 'Filename required' });
        return;
    }
    const subDir = type === 'music' ? 'music' : 'images';
    const filePath = path_1.default.join(uploadDir, subDir, path_1.default.basename(filename));
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        res.json({ success: true, message: 'File deleted' });
    }
    else {
        res.status(404).json({ success: false, message: 'File not found' });
    }
});
exports.default = router;
