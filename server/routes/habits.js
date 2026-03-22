import express from 'express';
import {
  getHabits,
  createHabit,
  markHabitComplete,
  deleteHabit
} from '../controllers/habitController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.put('/:id/complete', markHabitComplete);
router.delete('/:id', deleteHabit);

export default router;