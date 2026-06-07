import express from 'express';
import { upload, uploadImage } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/upload', protect, upload.single('image'), uploadImage);

export { router as uploadRoutes };
