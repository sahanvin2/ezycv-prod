const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest users
  },
  sessionId: {
    type: String,
    required: false // For guest users
  },
  template: {
    type: String,
    required: true,
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional', 'elegant']
  },
  personalInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    postalCode: { type: String },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    linkedIn: { type: String },
    website: { type: String },
    photo: { type: String }
  },
  summary: {
    type: String,
    maxlength: 1000
  },
  experience: [{
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    grade: { type: String },
    description: { type: String }
  }],
  skills: [{
    name: { type: String, required: true },
    level: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  languages: [{
    name: { type: String, required: true },
    proficiency: { 
      type: String, 
      enum: ['basic', 'conversational', 'fluent', 'native'],
      default: 'conversational'
    }
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String },
    date: { type: Date },
    expiryDate: { type: Date },
    credentialId: { type: String }
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    technologies: [String],
    link: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
  }],
  references: [{
    name: { type: String, required: true },
    position: { type: String },
    company: { type: String },
    email: { type: String },
    phone: { type: String },
    relationship: { type: String }
  }],
  customSections: [{
    title: { type: String },
    content: { type: String }
  }],
  b2BackupUrl: {
    type: String,
    default: null
  },
  settings: {
    primaryColor: { type: String, default: '#2563eb' },
    fontFamily: { type: String, default: 'Inter' },
    fontSize: { type: String, default: 'medium' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cvSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CV', cvSchema);
