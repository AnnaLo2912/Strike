import mongoose from 'mongoose';

const notebookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a notebook title'],
    trim: true
  },
  color: {
    type: String,
    default: '#f59e0b'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    email: {
      type: String
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true 
});

const pageSchema = new mongoose.Schema({
  notebook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notebook',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a page title'],
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  pageNumber: {
    type: Number,
    default: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

export const Notebook = mongoose.model('Notebook', notebookSchema);
export const Page = mongoose.model('Page', pageSchema);