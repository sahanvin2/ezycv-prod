'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore, useStatsStore } from '@/lib/store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function SettingToggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div><h4 className="font-medium text-gray-900">{label}</h4><p className="text-sm text-gray-500">{description}</p></div>
      <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}

export default function SettingsClient() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { resetUserStats } = useStatsStore();
  const [settings, setSettings] = useState({ emailNotifications: true, marketingEmails: false, darkMode: false, autoSave: true });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Setting updated');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ChevronLeft className="w-5 h-5 mr-2" />Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences</p>
        </motion.div>

        {/* Account Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2"><span className="text-gray-600">Name</span><span className="font-medium text-gray-900">{user?.name}</span></div>
            <div className="flex justify-between py-2"><span className="text-gray-600">Email</span><span className="font-medium text-gray-900">{user?.email}</span></div>
          </div>
          <Link href="/edit-profile" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">Edit Profile <ChevronRight className="w-4 h-4 ml-1" /></Link>
        </motion.div>

        {/* Notifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <SettingToggle label="Email Notifications" description="Receive updates about your account" checked={settings.emailNotifications} onChange={() => handleToggle('emailNotifications')} />
          <SettingToggle label="Marketing Emails" description="Receive tips and promotional content" checked={settings.marketingEmails} onChange={() => handleToggle('marketingEmails')} />
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
          <SettingToggle label="Auto-save CVs" description="Automatically save your CV progress" checked={settings.autoSave} onChange={() => handleToggle('autoSave')} />
          <SettingToggle label="Dark Mode" description="Use dark theme (coming soon)" checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div><h4 className="font-medium text-gray-900">Clear Statistics</h4><p className="text-sm text-gray-500">Reset all your usage statistics</p></div>
              <button onClick={() => { resetUserStats?.(); toast.success('Stats cleared'); }} className="px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 text-sm font-medium">Clear</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div><h4 className="font-medium text-gray-900">Delete Account</h4><p className="text-sm text-gray-500">Permanently delete your account</p></div>
              <button onClick={() => setShowDeleteModal(true)} className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 text-sm font-medium">Delete</button>
            </div>
          </div>
        </motion.div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Account?</h3>
              <p className="text-gray-600 mb-6">This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={() => { toast.success('Account deletion requested'); setShowDeleteModal(false); logout(); }} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
