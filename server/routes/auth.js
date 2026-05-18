import express from 'express';
import { 
  register, 
  login, 
  getCurrentUser,
  getSecurityQuestion,      // NEW
  verifySecurityQuestion,   // NEW
  resetPassword,            // NEW
  forgotPassword,           // NEW
  resetPasswordWithToken    // NEW
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

// NEW: Password reset routes
router.get('/security-question', getSecurityQuestion);
router.post('/verify-security-answer', verifySecurityQuestion);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);           // NEW
router.post('/reset-password-token', resetPasswordWithToken); // NEW

export default router;