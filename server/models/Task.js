import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board'
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
  // NEW: Mark task as important
  isImportant: {
    type: Boolean,
    default: false
  },
  // Soft delete for auto-delete feature (preserves stats)
  deleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Task', taskSchema);