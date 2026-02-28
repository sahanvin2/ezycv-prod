import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resetPassword } from '../services/firebaseAuth';
import toast from 'react-hot-toast';
import { KeyRound, MailCheck, Loader2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      const errorCode = error.code;
      let errorMessage = 'Failed to send reset email';
      
      switch (errorCode) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many requests. Please try again later';
          break;
        default:
          errorMessage = error.message || 'Failed to send reset email';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {sent 
              ? 'Check your email for reset instructions' 
              : 'Enter your email and we\'ll send you a reset link'}
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MailCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent!</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Try Another Email
              </button>
              <Link
                to="/login"
                className="block w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5" />
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
