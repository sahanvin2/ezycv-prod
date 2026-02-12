import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Sign in with Google
 * Forces account selection every time to let user choose account
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  // Force account selection - always show account chooser
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

/**
 * Sign in with Facebook
 */
export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');
  // Force re-authentication
  provider.setCustomParameters({
    auth_type: 'reauthenticate'
  });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (email, password, displayName) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  await updateProfile(userCredential.user, { displayName });
  
  // Send email verification
  try {
    await sendEmailVerification(userCredential.user);
  } catch (e) {
    console.log('Email verification send failed:', e.message);
  }
  
  return userCredential.user;
};

/**
 * Login with email and password
 */
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Update user display name
 */
export const updateUserProfile = async (displayName, photoURL) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  const updateData = {};
  if (displayName) updateData.displayName = displayName;
  if (photoURL) updateData.photoURL = photoURL;
  
  await updateProfile(user, updateData);
  return user;
};

/**
 * Change user password
 */
export const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  
  // Re-authenticate first
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  
  // Update password
  await updatePassword(user, newPassword);
};

/**
 * Get current Firebase ID token for API calls
 */
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
};

/**
 * Get current Firebase ID token (force refresh)
 */
export const getIdTokenForced = async () => {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken(true);
};

/**
 * Setup reCAPTCHA verifier for phone auth
 */
export const setupRecaptcha = (containerId) => {
  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    }
  });
  return verifier;
};

/**
 * Send OTP to phone number
 */
export const sendPhoneOTP = async (phoneNumber, recaptchaVerifier) => {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return confirmationResult;
};

/**
 * Verify phone OTP and sign in
 */
export const verifyPhoneOTP = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

/**
 * Link phone number to existing account
 */
export const linkPhoneToAccount = async (phoneNumber, recaptchaVerifier) => {
  const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return confirmationResult;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Resend email verification
 */
export const resendVerificationEmail = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  await sendEmailVerification(user);
};
