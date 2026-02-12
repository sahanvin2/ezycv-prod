const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length > 0) {
      return admin.apps[0];
    }

    const projectId = process.env.FIREBASE_PROJECT_ID || 'ezycv-84859';

    // Option 1: Use service account JSON file path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId
      });
    }
    // Option 2: Use individual environment variables (full service account)
    else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
        }),
        projectId
      });
    }
    // Option 3: Initialize without credentials - token verification will use Google's public keys
    else {
      admin.initializeApp({ projectId });
      console.log('⚠️  Firebase Admin initialized without service account - some features may be limited');
    }

    console.log('✅ Firebase Admin SDK Initialized (Project: ' + projectId + ')');
    return admin.app();
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization error:', error.message);
    return null;
  }
};

/**
 * Verify Firebase ID Token
 * Uses Firebase Admin SDK if service account is configured,
 * otherwise falls back to manual JWT verification using Google's public keys
 */
const verifyIdToken = async (idToken) => {
  try {
    // Try Firebase Admin SDK first
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (adminError) {
    // If Admin SDK fails (no service account), verify manually using Google's public keys
    console.log('Firebase Admin verifyIdToken failed, trying manual verification...');
    
    try {
      const jwt = require('jsonwebtoken');
      const https = require('https');
      
      // Decode without verification first to get the key ID (kid)
      const decoded = jwt.decode(idToken, { complete: true });
      if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('Invalid Firebase token format');
      }
      
      // Fetch Google's public keys
      const publicKeys = await new Promise((resolve, reject) => {
        https.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } 
            catch (e) { reject(new Error('Failed to parse Google public keys')); }
          });
        }).on('error', reject);
      });
      
      const publicKey = publicKeys[decoded.header.kid];
      if (!publicKey) {
        throw new Error('Public key not found for token');
      }
      
      // Verify the token with the public key
      const projectId = process.env.FIREBASE_PROJECT_ID || 'ezycv-84859';
      const verified = jwt.verify(idToken, publicKey, {
        algorithms: ['RS256'],
        audience: projectId,
        issuer: `https://securetoken.google.com/${projectId}`,
      });
      
      // Add firebase sign_in_provider info
      if (!verified.firebase) {
        verified.firebase = { sign_in_provider: 'unknown' };
      }
      
      return verified;
    } catch (manualError) {
      console.error('Manual token verification also failed:', manualError.message);
      throw new Error('Invalid or expired Firebase token');
    }
  }
};

/**
 * Get Firebase user by UID
 */
const getFirebaseUser = async (uid) => {
  try {
    return await admin.auth().getUser(uid);
  } catch (error) {
    throw new Error('Firebase user not found');
  }
};

/**
 * Delete Firebase user by UID
 */
const deleteFirebaseUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid);
  } catch (error) {
    console.error('Error deleting Firebase user:', error.message);
  }
};

module.exports = {
  admin,
  verifyIdToken,
  getFirebaseUser,
  deleteFirebaseUser,
  initializeFirebase
};
