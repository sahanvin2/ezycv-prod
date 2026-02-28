'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';

const categories: Record<string, string[]> = {
  wallpaper: ['nature', 'abstract', 'animals', 'architecture', 'space', 'gaming', 'minimalist', 'dark', 'gradient'],
  photo: ['business', 'nature', 'people', 'technology', 'food', 'travel', 'animals', 'architecture'],
};

export default function UploadClient() {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();
  const [uploadType, setUploadType] = useState<'wallpaper' | 'photo'>('wallpaper');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', category: 'nature', tags: '', deviceType: 'desktop' });

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  useEffect(() => {
    const verify = async () => {
      if (token) try { await authAPI.getMe(); } catch { router.replace('/login'); }
    };
    verify();
  }, [token, router]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (dropped.length) setFiles(prev => [...prev, ...dropped.slice(0, 5 - prev.length)]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    setFiles(prev => [...prev, ...selected.slice(0, 5 - prev.length)]);
  };

  const handleUpload = async () => {
    if (!files.length) { toast.error('Please select at least one image'); return; }
    if (!formData.title.trim()) { toast.error('Please enter a title'); return; }
    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('images', f));
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('tags', formData.tags);
      fd.append('type', uploadType);
      if (uploadType === 'wallpaper') fd.append('deviceType', formData.deviceType);

      const iv = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 200);
      const res = await fetch(`/api/${uploadType === 'wallpaper' ? 'wallpapers' : 'photos'}/upload`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd,
      });
      clearInterval(iv);
      setUploadProgress(100);
      if (res.ok) {
        toast.success(`${files.length} ${uploadType}(s) uploaded!`);
        setFiles([]);
        setFormData({ title: '', description: '', category: categories[uploadType][0], tags: '', deviceType: 'desktop' });
      } else {
        const err = await res.json();
        toast.error(err.message || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />Welcome, {user?.name}!
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upload Content</h1>
          <p className="text-gray-600 max-w-xl mx-auto">Share your amazing images with the community.</p>
        </motion.div>

        {/* Type Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {(['wallpaper', 'photo'] as const).map(type => (
            <button key={type} onClick={() => setUploadType(type)} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all ${uploadType === type ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
              {type === 'wallpaper' ? '🖼️' : '📷'} {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
            <p className="text-gray-500 mb-4">Drag and drop images here, or click to browse</p>
            <input type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="px-6 py-3 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 transition-colors">Browse Files</label>
          </div>

          {files.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <AnimatePresence>
                {files.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="relative w-24 h-24 rounded-xl overflow-hidden border">
                    <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Title</label><input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="input-field" placeholder="Give your upload a title" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="input-field">
                {categories[uploadType].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label><input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="input-field" placeholder="nature, landscape, mountain" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field resize-none" placeholder="Describe your upload..." /></div>
          </div>

          {uploading && (
            <div className="mt-6"><div className="h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} /></div><p className="text-sm text-gray-500 mt-2 text-center">{uploadProgress}%</p></div>
          )}

          <button onClick={handleUpload} disabled={uploading || !files.length} className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50">
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
