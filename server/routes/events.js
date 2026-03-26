import express from 'express';
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(createEvent);

router.route('/:id')
  .put(updateEvent)
  .delete(deleteEvent);

export default router;