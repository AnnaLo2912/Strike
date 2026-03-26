import express from 'express';
import {
  getAuthUrl,
  handleCallback,
  syncClassroom,
  disconnectClassroom,
  getClassroomStatus
} from '../controllers/googleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// OAuth routes
router.get('/auth-url', protect, getAuthUrl);
router.get('/callback', handleCallback); // No auth required for callback

// Classroom sync routes
router.get('/status', protect, getClassroomStatus);
router.post('/sync', protect, syncClassroom);
router.post('/disconnect', protect, disconnectClassroom);

export default router;