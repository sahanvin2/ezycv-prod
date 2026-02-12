const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { verifyIdToken, initializeFirebase } = require('../utils/firebase');

// Initialize Firebase Admin on load
initializeFirebase();

// @route   POST /api/auth/firebase-login
// @desc    Login/Register via Firebase (Google, Facebook, Phone, Email)
// @access  Public
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'Firebase ID token is required' });
    }

    // Verify the Firebase token
    const decodedToken = await verifyIdToken(idToken);
    const { uid, email, name, picture, phone_number, firebase } = decodedToken;
    
    // Determine auth provider
    const signInProvider = firebase?.sign_in_provider || 'unknown';
    let authProvider = 'local';
    if (signInProvider === 'google.com') authProvider = 'google';
    else if (signInProvider === 'facebook.com') authProvider = 'facebook';
    else if (signInProvider === 'phone') authProvider = 'phone';

    // Try to find user by Firebase UID first, then by email
    let user = await User.findOne({ firebaseUid: uid });
    let isNewUser = false;
    
    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      // Create new user
      isNewUser = true;
      user = new User({
        name: name || decodedToken.display_name || email?.split('@')[0] || `User_${uid.substring(0, 6)}`,
        email: email || `${uid}@firebase.user`,
        firebaseUid: uid,
        authProvider,
        avatar: picture || '',
        phoneNumber: phone_number || '',
        emailVerified: decodedToken.email_verified || false
      });
      await user.save();

      // Send welcome email for new users (non-blocking)
      if (email) {
        sendWelcomeEmail({ name: user.name, email }).catch(err => {
          console.log('Welcome email failed:', err.message);
        });
      }
    } else {
      // Update existing user with Firebase info
      user.firebaseUid = uid;
      if (!user.authProvider || user.authProvider === 'local') {
        user.authProvider = authProvider;
      }
      if (picture && !user.avatar) user.avatar = picture;
      if (phone_number && !user.phoneNumber) user.phoneNumber = phone_number;
      if (decodedToken.email_verified) user.emailVerified = true;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token for our API
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      },
      isNewUser
    });
  } catch (error) {
    console.error('Firebase login error:', error.message);
    res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({ name, email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ name, email }).catch(err => {
      console.log('Welcome email failed:', err.message);
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, avatar } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If an account exists, a password reset email has been sent.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user, resetToken);

    res.json({ message: 'If an account exists, a password reset email has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/seed-demo
// @desc    Create demo user for testing
// @access  Public
router.post('/seed-demo', async (req, res) => {
  try {
    const demoEmail = 'demo@cvmaker.com';
    const demoPassword = 'demo123456';
    
    // Check if demo user exists
    let user = await User.findOne({ email: demoEmail });
    
    if (user) {
      return res.json({ 
        message: 'Demo user already exists',
        credentials: {
          email: demoEmail,
          password: demoPassword
        }
      });
    }

    // Create demo user
    user = new User({ 
      name: 'Demo User', 
      email: demoEmail, 
      password: demoPassword 
    });
    await user.save();

    res.status(201).json({
      message: 'Demo user created successfully',
      credentials: {
        email: demoEmail,
        password: demoPassword
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
