const mongoose = require('mongoose');

const wallpaperSchema = new mongoose.Schema({
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
    enum: ['nature', 'abstract', 'animals', 'architecture', 'space', 'gaming', 'minimalist', 'dark', 'gradient']
  },
  deviceType: {
    type: String,
    required: true,
    enum: ['desktop', 'mobile']
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
    type: String  // Fast WebP preview for grid display
  },
  downloadUrl: {
    type: String  // Optimized 5K JPG for downloads
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  originalFileName: {
    type: String  // Source file name for re-processing
  },
  resolution: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  fileSize: {
    type: Number // in bytes
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

// Add text index for search
wallpaperSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Wallpaper', wallpaperSchema);
