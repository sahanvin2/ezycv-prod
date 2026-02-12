const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token middleware (supports both JWT and Firebase tokens)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Try JWT verification first
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }

      req.user = user;
      return next();
    } catch (jwtError) {
      // JWT failed - try Firebase token
      try {
        const { verifyIdToken } = require('../utils/firebase');
        const decodedToken = await verifyIdToken(token);
        const user = await User.findOne({ firebaseUid: decodedToken.uid }).select('-password');
        
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        return next();
      } catch (firebaseError) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Optional auth - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { auth, optionalAuth };
