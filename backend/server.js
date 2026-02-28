const dns = require('dns');
// ─────────────────────────────────────────────────────────────────────────────
// DNS PATCH: Windows DNS sometimes can't resolve MongoDB Atlas SRV records.
// We intercept dns.lookup for known Atlas shard hostnames and return their IPs
// directly, bypassing the OS resolver.  Run this BEFORE any network call.
// IPs resolved via Google DNS (8.8.8.8) — update if Atlas migrates the cluster.
// ─────────────────────────────────────────────────────────────────────────────
const _origLookup = dns.lookup.bind(dns);
const _mongoIpMap = {
  'ac-pxurk0o-shard-00-00.gmcrohr.mongodb.net': '89.192.55.41',
  'ac-pxurk0o-shard-00-01.gmcrohr.mongodb.net': '89.192.57.141',
  'ac-pxurk0o-shard-00-02.gmcrohr.mongodb.net': '89.192.57.123',
};
dns.lookup = (hostname, options, callback) => {
  if (typeof options === 'function') { callback = options; options = {}; }
  const ip = _mongoIpMap[hostname];
  if (ip) return process.nextTick(callback, null, ip, 4);
  return _origLookup(hostname, options, callback);
};

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const compression = require('compression');
const { checkConnection: checkB2Connection } = require('./utils/b2Storage');
const { verifyConnection: verifyEmailConnection } = require('./utils/emailService');

// Load environment variables from correct path
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Performance Middleware
app.use(compression()); // Gzip compression for faster responses

// CORS configuration for production
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

// Body parsing with limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads (fallback for local files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));

// MongoDB Atlas Connection with optimized settings
const mongoOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  retryWrites: true,
  w: 'majority'
};

mongoose.connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected Successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('⚠️  Server will keep running and retry the connection.');
    console.error('   Fix: whitelist your IP on MongoDB Atlas → Network Access → Add IP Address');
    // Do NOT exit – mongoose will keep retrying; once Atlas IP is whitelisted the DB will come back
  });

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected');
});

// Check B2 Storage Connection
async function initializeServices() {
  // B2 Storage
  if (process.env.B2_ENDPOINT) {
    const b2Result = await checkB2Connection();
    if (b2Result.connected) {
      console.log(`✅ B2 Storage Ready - Bucket: ${b2Result.bucket}`);
    }
  } else {
    console.log('⚠️  B2 Storage not configured - using local storage');
  }

  // Email Service
  if (process.env.MAIL_HOST) {
    const emailResult = await verifyEmailConnection();
    if (emailResult.connected) {
      console.log(`✅ Email Service Ready - ${process.env.MAIL_HOST}`);
    }
  } else {
    console.log('⚠️  Email Service not configured');
  }
}

// Initialize services after a short delay to ensure env vars are loaded
setTimeout(initializeServices, 1000);

// Middleware: return 503 quickly when DB is not connected (avoids long Mongoose buffer hangs)
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database not connected. Check your MongoDB Atlas IP whitelist and connection string.',
      hint: 'MongoDB Atlas → Security → Network Access → Add 0.0.0.0/0'
    });
  }
  next();
};

// Routes
app.use('/api/auth', requireDb, require('./routes/auth'));
app.use('/api/cv', requireDb, require('./routes/cv'));
app.use('/api/wallpapers', requireDb, require('./routes/wallpapers'));
app.use('/api/photos', requireDb, require('./routes/photos'));

// Health check route with full status
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  // Check MongoDB
  const mongoStatus = {
    connected: mongoose.connection.readyState === 1,
    database: mongoose.connection.name,
    host: mongoose.connection.host
  };
  
  // Check B2
  let b2Status = { configured: false };
  if (process.env.B2_ENDPOINT) {
    b2Status = await checkB2Connection();
    b2Status.configured = true;
  }
  
  // Check Email
  let emailStatus = { configured: false };
  if (process.env.MAIL_HOST) {
    emailStatus = await verifyEmailConnection();
    emailStatus.configured = true;
  }
  
  const responseTime = Date.now() - startTime;
  
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    services: {
      mongodb: mongoStatus,
      b2Storage: b2Status,
      email: emailStatus
    },
    performance: {
      responseTimeMs: responseTime,
      uptime: process.uptime()
    },
    timestamp: new Date().toISOString()
  });
});

// Storage status endpoint
app.get('/api/storage/status', async (req, res) => {
  try {
    let b2Status = { 
      configured: false, 
      connected: false,
      endpoint: null 
    };
    
    if (process.env.B2_ENDPOINT) {
      b2Status = await checkB2Connection();
      b2Status.configured = true;
      b2Status.endpoint = process.env.B2_ENDPOINT;
      b2Status.bucket = process.env.B2_BUCKET;
      b2Status.publicBase = process.env.B2_PUBLIC_BASE;
    }
    
    res.json({
      success: true,
      storage: {
        primary: b2Status.connected ? 'B2 Cloud' : 'Local',
        b2: b2Status,
        local: {
          enabled: true,
          path: '/uploads'
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Email test endpoint (for testing)
app.post('/api/email/test', async (req, res) => {
  try {
    const { sendEmail } = require('./utils/emailService');
    const { to, subject, message } = req.body;
    
    if (!to || !subject) {
      return res.status(400).json({ success: false, error: 'Email and subject required' });
    }
    
    const result = await sendEmail({
      to,
      subject,
      html: `<p>${message || 'Test email from Ezy CV'}</p>`
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contact form endpoint - sends message to ezycv22@gmail.com
app.post('/api/contact', async (req, res) => {
  try {
    const { sendContactFormEmail, sendContactConfirmationEmail } = require('./utils/emailService');
    const { name, email, subject, message } = req.body;
    
    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required (name, email, subject, message)' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }
    
    // Send email to support (ezycv22@gmail.com)
    const supportResult = await sendContactFormEmail({ name, email, subject, message });
    
    if (!supportResult.success) {
      console.error('Failed to send contact form email:', supportResult.error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      });
    }
    
    // Send confirmation to user (non-blocking)
    sendContactConfirmationEmail({ name, email, subject }).catch(err => {
      console.log('Confirmation email failed:', err.message);
    });
    
    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully! We\'ll get back to you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { sendNewsletterSubscriptionEmail } = require('./utils/emailService');
    const { email } = req.body;
    
    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }
    
    // Send welcome email
    const result = await sendNewsletterSubscriptionEmail(email);
    
    if (!result.success) {
      console.error('Failed to send newsletter subscription email:', result.error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to subscribe. Please try again later.' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Thanks for subscribing! Check your email for a welcome message 🎉' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File too large. Maximum size is 15MB.' });
  }
  
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  mongoose.connection.close(false, () => {
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api\n`);
});

// Handle port already in use gracefully (prevents nodemon unhandled exception)
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error('   Kill the existing process and try again:');
    console.error(`   npx kill-port ${PORT}  OR  Get-Process node | Stop-Process`);
    process.exit(1);
  } else {
    throw err;
  }
});
