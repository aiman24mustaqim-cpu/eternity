import { Router } from 'express'
import { upload, uploadFile, deleteFile } from '../controllers/uploadController'
import { authenticate } from '../middleware/auth'

const router = Router()

// Upload single file (image or music)
// Query param: ?type=images or ?type=music
router.post('/', authenticate, upload.single('file'), uploadFile)

// Delete file
router.delete('/', authenticate, deleteFile)

export { router as default }