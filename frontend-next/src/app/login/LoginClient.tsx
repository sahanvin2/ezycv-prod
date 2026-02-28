'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import { signInWithGoogle, signInWithFacebook } from '@/lib/firebaseAuth';
import { FileText, Eye, EyeOff } from 'lucide-react';

export default function LoginClient() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      login(response.data.user, response.data.token);
      const userName = response.data.user?.name?.split(' ')[0] || 'friend';
      toast.success(`Welcome back, ${userName}! 🎉`, { duration: 3000, icon: '👋' });
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setSocialLoading(provider);
    try {
      const firebaseUser = provider === 'google' ? await signInWithGoogle() : await signInWithFacebook();
      const idToken = await firebaseUser.getIdToken();
      const response = await authAPI.firebaseLogin(idToken);
      login(response.data.user, response.data.token);
      const userName = response.data.user?.name?.split(' ')[0] || 'friend';
      toast.success(response.data.isNewUser ? `Welcome, ${userName}! 🎉` : `Welcome back, ${userName}! 🎊`, { duration: 3000 });
      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { code?: string; response?: { data?: { message?: string } } };
      let msg = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed`;
      if (err.code === 'auth/popup-closed-by-user') msg = 'Login cancelled';
      else if (err.code === 'auth/account-exists-with-different-credential') msg = 'Account exists with different sign-in method';
      else if (err.response?.data?.message) msg = err.response.data.message;
      toast.error(msg);
    } finally {
      setSocialLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Your email address" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Your password" className="input-field pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm text-gray-600">Remember me</span></label>
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">Forgot password?</Link>
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500">Or continue with</span></div>
            </div>

            <div className="space-y-3">
              <button type="button" onClick={() => handleSocialLogin('google')} disabled={!!socialLoading} className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                {socialLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
              </button>
              <button type="button" onClick={() => handleSocialLogin('facebook')} disabled={!!socialLoading} className="w-full py-3 px-4 bg-[#1877F2] text-white rounded-xl font-medium hover:bg-[#166FE5] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                {socialLoading === 'facebook' ? 'Signing in...' : 'Continue with Facebook'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">Don&apos;t have an account? <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">Sign up</Link></p>
            </div>
          </form>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-purple-700 items-center justify-center p-8">
        <div className="text-center text-white max-w-lg">
          <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Create Your Perfect CV</h2>
          <p className="text-blue-100 text-lg">Build professional CVs, download stunning wallpapers, and access thousands of stock photos — all for free!</p>
        </div>
      </div>
    </div>
  );
}
