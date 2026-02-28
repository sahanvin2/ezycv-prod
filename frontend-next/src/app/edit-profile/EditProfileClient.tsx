'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { ChevronLeft } from 'lucide-react';

export default function EditProfileClient() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', bio: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) { router.replace('/login'); return; }
    setFormData({ name: user?.name || '', email: user?.email || '', phone: (user?.phone as string) || '', location: (user?.location as string) || '', bio: (user?.bio as string) || '' });
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (updateUser) updateUser(formData);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div><h3 className="font-semibold text-gray-900">{user?.name}</h3><p className="text-gray-500 text-sm">{user?.email}</p></div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your full name" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><input type="email" value={formData.email} disabled className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50" /><p className="text-xs text-gray-500 mt-1">Email cannot be changed</p></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Phone number" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Location</label><input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="City, Country" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Bio</label><textarea rows={4} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="About yourself..." /></div>
            <div className="flex gap-4 pt-4">
              <Link href="/dashboard" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-center">Cancel</Link>
              <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50">{isLoading ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
