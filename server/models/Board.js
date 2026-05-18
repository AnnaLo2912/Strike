import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a board name'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#c18db4'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // NEW: Track who created it
  createdBy: {
    type: String  // User's name
  }
}, { 
  timestamps: true 
});

// Auto-populate createdBy before saving
boardSchema.pre('save', async function(next) {
  if (this.isNew && this.user) {
    const User = mongoose.model('User');
    const user = await User.findById(this.user);
    if (user) {
      this.createdBy = user.name;
    }
  }
  // next();
});

export default mongoose.model('Board', boardSchema);