import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
  // NEW: Security Questions for password reset
  securityQuestion: {
    type: String,
    select: false
  },
  securityAnswer: {
    type: String,
    select: false
  },
  // Google OAuth fields
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
  },
  // Password reset token fields
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, { 
  timestamps: true 
});

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// NEW: Hash security answer
userSchema.pre('save', async function () {
  if (!this.isModified('securityAnswer') || !this.securityAnswer) return;
  const salt = await bcrypt.genSalt(10);
  this.securityAnswer = await bcrypt.hash(this.securityAnswer.toLowerCase(), salt);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// NEW: Compare security answer
userSchema.methods.compareSecurityAnswer = async function (enteredAnswer) {
  if (!this.securityAnswer) return false;
  return await bcrypt.compare(enteredAnswer.toLowerCase(), this.securityAnswer);
};

// NEW: Generate password reset token
userSchema.methods.getPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash the token and save it
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // Token expires in 30 minutes
  this.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000);
  
  return resetToken;
};

export default mongoose.model('User', userSchema);