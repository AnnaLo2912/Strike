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
  // For classroom assignments
  classroomCourseId: {
    type: String
  },
  classroomAssignmentId: {
    type: String
  },
  // For task deadlines
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Event', eventSchema);