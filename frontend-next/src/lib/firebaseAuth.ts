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
  signInWithPopup,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from './firebase';

/** Sign in with Google (forces account picker) */
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

/** Sign in with Facebook */
export const signInWithFacebook = async (): Promise<User> => {
  const provider = new FacebookAuthProvider();
  provider.addScope('email');
  provider.addScope('public_profile');
  provider.setCustomParameters({ auth_type: 'reauthenticate' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

/** Register with email & password */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string,
): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  try {
    await sendEmailVerification(cred.user);
  } catch {
    /* verification send may fail */
  }
  return cred.user;
};

/** Login with email & password */
export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

/** Logout */
export const logoutUser = () => signOut(auth);

/** Send password-reset email */
export const resetPassword = (email: string) =>
  sendPasswordResetEmail(auth, email);

/** Update display name / photo */
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string,
): Promise<User> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');
  const data: { displayName?: string; photoURL?: string } = {};
  if (displayName) data.displayName = displayName;
  if (photoURL) data.photoURL = photoURL;
  await updateProfile(user, data);
  return user;
};

/** Change password (requires re-auth) */
export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('No user logged in');
  const cred = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, cred);
  await updatePassword(user, newPassword);
};

/** Get current Firebase ID token */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  return user ? user.getIdToken() : null;
};

/** Get current Firebase ID token (force refresh) */
export const getIdTokenForced = async (): Promise<string | null> => {
  const user = auth.currentUser;
  return user ? user.getIdToken(true) : null;
};

/** Setup invisible reCAPTCHA */
export const setupRecaptcha = (containerId: string) =>
  new RecaptchaVerifier(auth, containerId, { size: 'invisible', callback: () => {} });

/** Send phone OTP */
export const sendPhoneOTP = (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier,
): Promise<ConfirmationResult> =>
  signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);

/** Verify phone OTP */
export const verifyPhoneOTP = async (
  confirmationResult: ConfirmationResult,
  otp: string,
): Promise<User> => {
  const result = await confirmationResult.confirm(otp);
  return result.user;
};

/** Listen to auth state changes */
export const onAuthChange = (cb: (user: User | null) => void) =>
  onAuthStateChanged(auth, cb);

/** Get current user */
export const getCurrentUser = () => auth.currentUser;
