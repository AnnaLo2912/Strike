import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Please provide an email'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'] 
  },
  password: { 
    type: String, 
    minlength: [6, 'Password must be at least 6 characters'], 
    select: false 
  },
  // NEW: Google OAuth fields
  googleId: {
    type: String,
    sparse: true
  },
  googleAccessToken: {
    type: String,
    select: false
  },
  googleRefreshToken: {
    type: String,
    select: false
  },
  classroomSyncEnabled: {
    type: Boolean,
    default: false
  },
  lastClassroomSync: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Password is now optional (for Google OAuth users)
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);