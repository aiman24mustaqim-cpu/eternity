import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { authenticate } from '../middleware/auth'

const router = Router()

const uploadDir = process.env.UPLOAD_DIR || 'uploads'
const musicDir = path.join(uploadDir, 'music')
const imagesDir = path.join(uploadDir, 'images')

;[uploadDir, musicDir, imagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
})

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const type = req.query.type || 'images'
    cb(null, type === 'music' ? musicDir : imagesDir)
  },
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post('/', authenticate, upload.single('file'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No file uploaded' })
    return
  }
  const type = (req.query.type as string) || 'images'
  const subDir = type === 'music' ? 'music' : 'images'
  const baseUrl = process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`
  const url = `${baseUrl}/uploads/${subDir}/${req.file.filename}`
  res.json({ success: true, url, filename: req.file.filename })
})

router.delete('/', authenticate, (req, res) => {
  const { filename, type } = req.body
  if (!filename) { res.status(400).json({ success: false, message: 'Filename required' }); return }
  const subDir = type === 'music' ? 'music' : 'images'
  const filePath = path.join(uploadDir, subDir, path.basename(filename))
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    res.json({ success: true, message: 'File deleted' })
  } else {
    res.status(404).json({ success: false, message: 'File not found' })
  }
})

export default router