import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyChtWYeAzuWVBQKoNk07EhJEO_q4GFFxrw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "ezycv-84859.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "ezycv-84859",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "ezycv-84859.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "64846124094",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:64846124094:web:d6e3b335833323b663ad6f",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9NK500YYG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Analytics (only in production)
let analytics = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (e) {
    console.log('Analytics not available');
  }
}

export { app, auth, analytics };
export default app;
