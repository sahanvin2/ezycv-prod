const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const CV = require('../models/CV');
const { auth, optionalAuth } = require('../middleware/auth');

// @route   POST /api/cv
// @desc    Create a new CV
// @access  Public (with optional auth)
router.post('/', optionalAuth, [
  body('personalInfo.fullName').notEmpty().withMessage('Full name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('template').isIn(['modern', 'classic', 'creative', 'minimal', 'professional', 'elegant'])
    .withMessage('Invalid template')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cvData = {
      ...req.body,
      user: req.user ? req.user._id : null,
      sessionId: req.body.sessionId || null
    };

    const cv = new CV(cvData);
    await cv.save();

    res.status(201).json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cv
// @desc    Get all CVs for logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(cvs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cv/:id
// @desc    Get CV by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }
    res.json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cv/:id
// @desc    Update CV
// @access  Public (owner check if logged in)
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    let cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Check ownership if user is logged in
    if (req.user && cv.user && cv.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    cv = await CV.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    res.json(cv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cv/:id
// @desc    Delete CV
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    if (cv.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await cv.deleteOne();
    res.json({ message: 'CV deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/cv/templates/list
// @desc    Get available CV templates
// @access  Public
router.get('/templates/list', async (req, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design with bold headers',
        preview: '/templates/modern.png',
        colors: ['#2563eb', '#1e40af', '#3b82f6']
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout',
        preview: '/templates/classic.png',
        colors: ['#1f2937', '#374151', '#4b5563']
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Unique design for creative professionals',
        preview: '/templates/creative.png',
        colors: ['#7c3aed', '#8b5cf6', '#a78bfa']
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant minimalist design',
        preview: '/templates/minimal.png',
        colors: ['#171717', '#262626', '#404040']
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Corporate-style professional template',
        preview: '/templates/professional.png',
        colors: ['#0369a1', '#0284c7', '#0ea5e9']
      },
      {
        id: 'elegant',
        name: 'Elegant',
        description: 'Sophisticated design with elegant typography',
        preview: '/templates/elegant.png',
        colors: ['#b91c1c', '#dc2626', '#ef4444']
      }
    ];
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
