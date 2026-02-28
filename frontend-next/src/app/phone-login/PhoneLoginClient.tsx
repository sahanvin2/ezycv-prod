'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } from '@/lib/firebaseAuth';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { Smartphone } from 'lucide-react';

const countryCodes = [
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
];

export default function PhoneLoginClient() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => { if (isAuthenticated) router.push('/dashboard'); }, [isAuthenticated, router]);
  useEffect(() => { if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(r => r - 1), 1000); return () => clearTimeout(t); } }, [resendTimer]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 7) { toast.error('Please enter a valid phone number'); return; }
    setLoading(true);
    try {
      if (!recaptchaRef.current) recaptchaRef.current = setupRecaptcha('recaptcha-container');
      const result = await sendPhoneOTP(`${countryCode}${phoneNumber}`, recaptchaRef.current);
      setConfirmationResult(result);
      setStep('otp');
      setResendTimer(60);
      toast.success('OTP sent to your phone!');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const msgs: Record<string, string> = {
        'auth/invalid-phone-number': 'Invalid phone number',
        'auth/too-many-requests': 'Too many attempts. Try again later',
      };
      toast.error(msgs[err.code || ''] || err.message || 'Failed to send OTP');
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { toast.error('Enter the complete 6-digit OTP'); return; }
    setLoading(true);
    try {
      const firebaseUser = await verifyPhoneOTP(confirmationResult!, code);
      const idToken = await firebaseUser.getIdToken();
      const response = await authAPI.firebaseLogin(idToken);
      login(response.data.user, response.data.token);
      toast.success(response.data.isNewUser ? 'Account created!' : 'Welcome back!');
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      const msgs: Record<string, string> = {
        'auth/invalid-verification-code': 'Invalid OTP. Try again',
        'auth/code-expired': 'OTP expired. Request a new one',
      };
      toast.error(msgs[err.code || ''] || err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Phone Login</h1>
          <p className="text-gray-600">{step === 'phone' ? 'Enter your phone number to receive an OTP' : 'Enter the 6-digit code sent to your phone'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="px-3 py-3 border border-gray-200 rounded-xl text-sm">
                    {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
                  <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone number" className="input-field flex-1" required />
                </div>
              </div>
              <div id="recaptcha-container" />
              <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">{loading ? 'Sending...' : 'Send OTP'}</button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input key={i} ref={el => { otpRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOTPChange(i, e.target.value)} onKeyDown={e => { if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); }} className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
                ))}
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">{loading ? 'Verifying...' : 'Verify OTP'}</button>
              <div className="text-center">
                {resendTimer > 0 ? <p className="text-sm text-gray-500">Resend in {resendTimer}s</p> : <button type="button" onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }} className="text-sm text-blue-600 hover:text-blue-700">Resend OTP</button>}
              </div>
            </form>
          )}
          <div className="mt-6 text-center"><Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">Back to Login</Link></div>
        </div>
      </motion.div>
    </div>
  );
}
