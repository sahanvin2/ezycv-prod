import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics, type Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    'AIzaSyChtWYeAzuWVBQKoNk07EhJEO_q4GFFxrw',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'ezycv-84859.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ezycv-84859',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'ezycv-84859.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '64846124094',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    '1:64846124094:web:d6e3b335833323b663ad6f',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-9NK500YYG8',
};

// Prevent reinitialisation in dev hot-reload
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch {
    /* analytics unavailable */
  }
}

export { app, auth, analytics };
export default app;
