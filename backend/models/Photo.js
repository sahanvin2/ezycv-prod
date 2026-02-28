const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    lowercase: true,
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
  previewUrl: {
    type: String  // WebP preview URL (same as thumbnailUrl for B2-hosted photos)
  },
  downloadUrl: {
    type: String  // 5K JPG download URL (same as imageUrl for B2-hosted photos)
  },
  resolution: {
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  fileSize: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  },
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
    default: 'b2'
  },
  storageKey: {
    type: String  // B2 key for the 5K JPG
  },
  previewKey: {
    type: String  // B2 key for the WebP preview
  },
  originalFileName: {
    type: String  // Original source filename for reference
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Full-text search index
photoSchema.index({ title: 'text', description: 'text', tags: 'text' });
photoSchema.index({ category: 1, createdAt: -1 });
photoSchema.index({ featured: 1, category: 1 });

module.exports = mongoose.model('Photo', photoSchema);
