import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  allDay: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#c18db4'
  },
  type: {
    type: String,
    enum: ['personal', 'classroom', 'task'],
    default: 'personal'
  },
  classroomCourseId: {
    type: String
  },
  classroomAssignmentId: {
    type: String
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // NEW: Track who created it
  createdBy: {
    type: String
  },
  // NEW: Mark event as important
  isImportant: {
    type: Boolean,
    default: false
  },
  // NEW: Mark event as deadline
  isDeadline: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Event', eventSchema);