import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/store';
import { authAPI } from '../services/api';
import { signInWithGoogle, signInWithFacebook } from '../services/firebaseAuth';
import toast from 'react-hot-toast';
import { UserPlus, Check, FileText, EyeOff, Eye, Loader2 } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(response.data.user, response.data.token);
      
      // Show success notification (welcome email sent via Brevo)
      const firstName = response.data.user?.name?.split(' ')[0] || formData.name.split(' ')[0];
      toast.success(`Welcome, ${firstName}! 🎉 Check your email for a welcome message.`, {
        duration: 5000,
        icon: '💜'
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    try {
      let firebaseUser;
      if (provider === 'google') {
        firebaseUser = await signInWithGoogle();
      } else if (provider === 'facebook') {
        firebaseUser = await signInWithFacebook();
      }

      const idToken = await firebaseUser.getIdToken();
      const response = await authAPI.firebaseLogin(idToken);
      login(response.data.user, response.data.token);
      
      const firstName = response.data.user?.name?.split(' ')[0] || 'friend';
      if (response.data.isNewUser) {
        // Welcome email sent via Brevo - show simple confirmation
        toast.success(`Welcome, ${firstName}! 🎉 Check your email for a welcome message.`, {
          duration: 5000,
          icon: '💜'
        });
      } else {
        toast.success(`Welcome back, ${firstName}! 🎊`, {
          duration: 3000,
          icon: '👋'
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(`${provider} login error:`, error);
      let errorMessage = `${provider.charAt(0).toUpperCase() + provider.slice(1)} sign up failed`;
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign up cancelled';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email using a different sign-in method';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-blue-600 items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <UserPlus className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Ezy CV</h2>
            <p className="text-purple-100 text-lg">
              Create an account to save your CVs, track downloads, and access exclusive features!
            </p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span>Save and manage multiple CVs</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span>Track your download history</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span>Access to premium templates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h1>
            <p className="text-gray-600">Start building your professional CV today</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="input-field pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded mt-1" required />
                  <span className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading === 'google'}
                className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span>{socialLoading === 'google' ? 'Signing up...' : 'Continue with Google'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                disabled={socialLoading === 'facebook'}
                className="w-full py-3 px-4 bg-[#1877F2] text-white rounded-xl font-medium hover:bg-[#166FE5] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {socialLoading === 'facebook' ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                <span>{socialLoading === 'facebook' ? 'Signing up...' : 'Continue with Facebook'}</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>

        </motion.div>
      </div>
    </div>
  );
};

export default Register;
