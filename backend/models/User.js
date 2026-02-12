const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6
    // Not required - social login users won't have a password
  },
  avatar: {
    type: String,
    default: ''
  },
  // Firebase / Social Auth fields
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // allows null values without unique constraint conflict
  },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'facebook', 'phone'],
    default: 'local'
  },
  phoneNumber: {
    type: String,
    sparse: true
  },
  cvs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CV'
  }],
  downloads: [{
    itemType: {
      type: String,
      enum: ['wallpaper', 'photo', 'cv']
    },
    itemId: mongoose.Schema.Types.ObjectId,
    downloadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpiry: {
    type: Date
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving (only for local auth users)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
