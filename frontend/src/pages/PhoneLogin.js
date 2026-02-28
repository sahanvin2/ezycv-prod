import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/store';
import { authAPI } from '../services/api';
import { setupRecaptcha, sendPhoneOTP, verifyPhoneOTP } from '../services/firebaseAuth';
import toast from 'react-hot-toast';
import { Smartphone, Loader2, Mail } from 'lucide-react';

const PhoneLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+94'); // Sri Lanka default
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);
  const recaptchaRef = useRef(null);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const countryCodes = [
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  ];

  const startResendTimer = () => {
    setResendTimer(60);
  };

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // Setup reCAPTCHA
      if (!recaptchaRef.current) {
        recaptchaRef.current = setupRecaptcha('recaptcha-container');
      }

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await sendPhoneOTP(fullPhoneNumber, recaptchaRef.current);
      setConfirmationResult(result);
      setStep('otp');
      startResendTimer();
      toast.success('OTP sent to your phone!');
    } catch (error) {
      console.error('Phone OTP error:', error);
      let errorMessage = 'Failed to send OTP';
      
      switch (error.code) {
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later';
          break;
        case 'auth/quota-exceeded':
          errorMessage = 'SMS quota exceeded. Please try again later';
          break;
        case 'auth/captcha-check-failed':
          errorMessage = 'reCAPTCHA verification failed. Please refresh and try again';
          break;
        default:
          errorMessage = error.message || 'Failed to send OTP';
      }
      
      toast.error(errorMessage);
      // Reset reCAPTCHA on error
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').split('').slice(0, 6);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP with Firebase
      const firebaseUser = await verifyPhoneOTP(confirmationResult, otpCode);
      
      // Get Firebase ID token and sync with backend
      const idToken = await firebaseUser.getIdToken();
      const response = await authAPI.firebaseLogin(idToken);
      
      // Store user with token
      login(response.data.user, response.data.token);
      
      if (response.data.isNewUser) {
        toast.success('Account created successfully!');
      } else {
        toast.success('Welcome back!');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('OTP verification error:', error);
      let errorMessage = 'Invalid OTP';
      
      switch (error.code) {
        case 'auth/invalid-verification-code':
          errorMessage = 'Invalid OTP code. Please try again';
          break;
        case 'auth/code-expired':
          errorMessage = 'OTP has expired. Please request a new one';
          break;
        default:
          errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    try {
      recaptchaRef.current = null;
      recaptchaRef.current = setupRecaptcha('recaptcha-container');
      
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const result = await sendPhoneOTP(fullPhoneNumber, recaptchaRef.current);
      setConfirmationResult(result);
      setOtp(['', '', '', '', '', '']);
      startResendTimer();
      toast.success('New OTP sent!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
      recaptchaRef.current = null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      {/* reCAPTCHA container - invisible */}
      <div id="recaptcha-container"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Phone Sign In' : 'Enter OTP'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Sign in or create an account with your phone number' 
              : `We sent a 6-digit code to ${countryCode}${phoneNumber}`}
          </p>
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="input-field w-32 text-sm"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="7X XXX XXXX"
                    className="input-field flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We'll send you a verification code via SMS
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or use</span>
              </div>
            </div>

            <Link
              to="/login"
              className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <Mail className="w-5 h-5" />
              Sign in with Email
            </Link>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-6">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                  Enter 6-digit verification code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleOTPKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  'Verify & Sign In'
                )}
              </button>

              {/* Resend OTP */}
              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in <span className="font-semibold text-blue-600">{resendTimer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Change number */}
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setConfirmationResult(null);
                  recaptchaRef.current = null;
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
              >
                Change phone number
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up with email
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default PhoneLogin;
