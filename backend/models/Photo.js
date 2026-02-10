const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['business', 'technology', 'people', 'nature', 'food', 'travel', 'fashion', 'sports', 'health', 'education', 'other']
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  resolution: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  fileSize: {
    type: Number
  },
  tags: [String],
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  license: {
    type: String,
    enum: ['free', 'attribution', 'premium'],
    default: 'free'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  storageType: {
    type: String,
    enum: ['local', 'b2'],
    default: 'local'
  },
  storageKey: {
    type: String // B2 storage key for deletion
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

photoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Photo', photoSchema);
