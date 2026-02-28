'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useStatsStore } from '@/lib/store';
import {
  FileText, ImageIcon, Camera, ArrowRight, Check, FileDown,
  Image as ImageLucide, Camera as CameraLucide, Star,
  Leaf, Sparkles, Rocket, Bug, Moon
} from 'lucide-react';

export default function HomePage() {
  const cvsCreated = useStatsStore((s) => s.stats.cvsCreated);
  const totalDownloads = useStatsStore((s) => s.stats.totalDownloads);
  const wallpapersStore = useStatsStore((s) => s.stats.wallpapers);
  const stockPhotosStore = useStatsStore((s) => s.stats.stockPhotos);

  const [apiStats, setApiStats] = useState<{ wallpapers: number | null; stockPhotos: number | null; cvsCreated: number | null; totalDownloads: number | null }>({
    wallpapers: null, stockPhotos: null, cvsCreated: null, totalDownloads: null,
  });

  const fetchRealCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/wallpapers/stats');
      if (res.ok) {
        const data = await res.json();
        setApiStats({ wallpapers: data.wallpapers ?? null, stockPhotos: data.stockPhotos ?? null, cvsCreated: data.cvsCreated ?? null, totalDownloads: data.totalDownloads ?? null });
      }
    } catch { /* fallback to store */ }
  }, []);

  useEffect(() => { fetchRealCounts(); const i = setInterval(fetchRealCounts, 30000); return () => clearInterval(i); }, [fetchRealCounts]);

  const displayStats = {
    cvsCreated: apiStats.cvsCreated ?? cvsCreated,
    totalDownloads: apiStats.totalDownloads ?? totalDownloads,
    wallpapers: apiStats.wallpapers ?? wallpapersStore,
    stockPhotos: apiStats.stockPhotos ?? stockPhotosStore,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
    return num.toString() + '+';
  };

  const features = [
    { icon: <FileText className="w-8 h-8" />, title: 'Free CV Builder', description: 'Create professional CVs with our easy-to-use builder. Multiple templates available.', link: '/cv-builder', color: 'from-blue-500 to-blue-600' },
    { icon: <ImageLucide className="w-8 h-8" />, title: 'HD Wallpapers', description: 'Download stunning wallpapers for desktop and mobile devices.', link: '/wallpapers', color: 'from-purple-500 to-purple-600' },
    { icon: <Camera className="w-8 h-8" />, title: 'Stock Photos', description: 'Free high-quality stock photos for personal and commercial use.', link: '/stock-photos', color: 'from-cyan-500 to-cyan-600' },
  ];

  const liveStats = [
    { number: displayStats.cvsCreated, label: 'CVs Created', icon: <FileText className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-blue-500 to-indigo-600' },
    { number: displayStats.totalDownloads, label: 'Downloads', icon: <FileDown className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-green-500 to-emerald-600' },
    { number: displayStats.wallpapers, label: 'Wallpapers', icon: <ImageIcon className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-purple-500 to-pink-600' },
    { number: displayStats.stockPhotos, label: 'Stock Photos', icon: <CameraLucide className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-orange-500 to-red-600' },
  ];

  const templates = [
    { id: 'modern', name: 'Modern' }, { id: 'classic', name: 'Classic' }, { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' }, { id: 'professional', name: 'Professional' }, { id: 'elegant', name: 'Elegant' },
    { id: 'executive', name: 'Executive' }, { id: 'tech', name: 'Tech' }, { id: 'academic', name: 'Academic' }, { id: 'compact', name: 'Compact' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptLTEyLTQydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bS0xMi00MnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <motion.div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20">
                <motion.span className="w-2 h-2 bg-green-400 rounded-full" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                Trusted by 100+ professionals
              </motion.div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="block">Create Your Perfect CV</motion.span>
                <motion.span className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>100% Free</motion.span>
              </h1>
              <motion.p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                Build professional CVs in minutes with our easy-to-use builder. Choose from multiple templates and download as PDF instantly.
              </motion.p>
              <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/cv-builder" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl group">
                    Create CV Now <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/cv-templates" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30">
                    View Templates
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* CV Preview Card */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden md:block">
              <div className="relative">
                <motion.div className="absolute -top-4 -right-4 w-72 h-96 bg-purple-500/30 rounded-2xl" animate={{ rotate: [0, 2, 0, -2, 0], scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute -bottom-4 -left-4 w-72 h-96 bg-blue-400/30 rounded-2xl" animate={{ rotate: [0, -2, 0, 2, 0], scale: [1, 1.02, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} />
                <motion.div className="relative bg-white rounded-2xl shadow-2xl p-6 text-gray-800" whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} transition={{ duration: 0.3 }}>
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0)', '0 0 0 8px rgba(59,130,246,0.1)', '0 0 0 0 rgba(59,130,246,0)'] }} transition={{ duration: 2, repeat: Infinity }} />
                    <div><h3 className="font-bold text-lg">John Doe</h3><p className="text-gray-500 text-sm">Software Developer</p></div>
                  </div>
                  <div className="space-y-3">
                    {[100, 83, 66].map((w, i) => <motion.div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${w}%` }} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }} />)}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <motion.div className="text-xs text-gray-500 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>EXPERIENCE</motion.div>
                    <div className="space-y-2">
                      {[100, 75].map((w, i) => <motion.div key={i} className="h-2 bg-blue-100 rounded" style={{ width: `${w}%` }} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }} />)}
                    </div>
                  </div>
                  <motion.div className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}>
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {liveStats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="relative bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative z-10 text-center">
                  <div className="text-2xl md:text-3xl mb-1 md:mb-2 flex justify-center"><span className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.icon}</span></div>
                  <div className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-0.5 md:mb-1`}>{formatNumber(stat.number)}</div>
                  <div className="text-gray-600 text-xs md:text-sm font-medium">{stat.label}</div>
                </div>
                <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[8px] md:text-[10px] text-green-600 font-medium hidden sm:inline">LIVE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <motion.span initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">Our Services</motion.span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">From creating professional CVs to stunning wallpapers and stock photos, we&apos;ve got you covered.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={f.link} className="block bg-white rounded-2xl p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 card-hover h-full border border-gray-100 group">
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white mb-3 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>{f.icon}</div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                  <div className="mt-3 md:mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Templates Preview ─────────────────────────── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3 md:mb-4">10 Professional Templates</span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Choose Your Perfect CV Template</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">From classic to creative, find the template that matches your style and industry</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {templates.map((t, i) => (
              <motion.div key={t.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="group">
                <Link href={`/cv-builder?template=${t.id}`} className="block aspect-[3/4] rounded-xl shadow-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-xl bg-white p-3">
                  <div className="h-2 bg-blue-600 rounded w-3/4 mb-2" />
                  <div className="space-y-1 mb-2"><div className="h-1 bg-gray-200 rounded" /><div className="h-1 bg-gray-200 rounded w-5/6" /></div>
                  <div className="h-1.5 bg-blue-100 rounded w-1/2 mb-1" />
                  <div className="space-y-0.5"><div className="h-0.5 bg-gray-100 rounded" /><div className="h-0.5 bg-gray-100 rounded w-4/5" /></div>
                </Link>
                <p className="text-center text-sm font-medium text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">{t.name}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link href="/cv-templates" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-sm md:text-base">
              View All Templates <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Wallpapers Preview ────────────────────────── */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-3 md:mb-4"><ImageLucide className="w-4 h-4 inline mr-1" /> Free HD Wallpapers</span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Stunning Wallpapers Collection</h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">Refresh your screens with beautiful, high-quality wallpapers. Free for desktop and mobile!</p>
            </motion.div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {[{ name: 'Nature', icon: <Leaf className="w-4 h-4" />, color: 'from-green-400 to-emerald-500' }, { name: 'Abstract', icon: <Sparkles className="w-4 h-4" />, color: 'from-purple-400 to-fuchsia-500' }, { name: 'Space', icon: <Rocket className="w-4 h-4" />, color: 'from-blue-400 to-indigo-600' }, { name: 'Animals', icon: <Bug className="w-4 h-4" />, color: 'from-orange-400 to-amber-500' }, { name: 'Dark', icon: <Moon className="w-4 h-4" />, color: 'from-gray-600 to-gray-800' }].map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/wallpapers/${cat.name.toLowerCase()}`} className={`inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${cat.color} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all`}>
                  <span>{cat.icon}</span><span>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', title: 'Mountain Sunrise', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80', title: 'Cosmic Galaxy', category: 'space' },
              { preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80', title: 'Fluid Colors', category: 'abstract' },
              { preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', title: 'Ocean Waves', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80', title: 'Nebula Dreams', category: 'space' },
              { preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80', title: 'Gradient Art', category: 'abstract' },
              { preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', title: 'Foggy Forest', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80', title: 'Night Sky', category: 'dark' },
            ].map((wp, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3]">
                <Link href={`/wallpapers/${wp.category}`}>
                  <Image src={wp.preview} alt={wp.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3"><p className="text-white font-medium text-sm truncate">{wp.title}</p><p className="text-white/70 text-xs capitalize">{wp.category}</p></div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link href="/wallpapers" className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-sm md:text-base">
              Explore All Wallpapers <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4"><Star className="w-4 h-4 inline mr-1" /> Success Stories</span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Loved by Job Seekers Worldwide</h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">Real stories from people who landed their dream jobs using Ezy CV</p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            {[
              { name: 'Michael Rodriguez', role: 'Software Engineer at Tech Corp', initials: 'MR', color: 'from-blue-500 to-indigo-600', quote: 'Ezy CV helped me create a professional resume in under 10 minutes. I got 3 interview calls in the first week!' },
              { name: 'Sarah Thompson', role: 'Marketing Manager at StartUp Inc', initials: 'ST', color: 'from-pink-500 to-rose-600', quote: "The templates are beautiful and easy to customize. I landed my dream job thanks to the modern CV I created here." },
              { name: 'David Chen', role: 'Graphic Designer at Creative Agency', initials: 'DC', color: 'from-emerald-500 to-teal-600', quote: 'As a designer, I appreciate good design. Ezy CV exceeded my expectations with its creative templates!' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow relative">
                <div className="absolute top-4 right-4 md:top-6 md:right-6 text-blue-100 text-4xl md:text-6xl font-serif">&quot;</div>
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-gray-700 mb-6 leading-relaxed relative z-10">{t.quote}</p>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center ring-4 ring-blue-100`}><span className="text-white font-bold text-sm md:text-base">{t.initials}</span></div>
                  <div><div className="font-bold text-gray-900">{t.name}</div><div className="text-sm text-gray-600">{t.role}</div></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog / Resume Tips ────────────────────── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-3 md:mb-4"><FileText className="w-4 h-4 inline mr-1" /> Resume Tips</span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Career Tips &amp; Guides</h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">Expert advice to help you build a better CV and land your dream job.</p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {[
              { title: 'How to Write a Professional CV in 2025', excerpt: 'Learn the essential tips and best practices for creating a standout CV.', slug: 'how-to-write-a-professional-cv', tag: 'CV Tips', date: 'Jan 15, 2025' },
              { title: 'Top 10 CV Mistakes to Avoid in 2025', excerpt: 'Avoid these common CV mistakes that could be costing you job interviews.', slug: 'top-10-cv-mistakes-to-avoid', tag: 'Career Advice', date: 'Jan 20, 2025' },
            ].map((post, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/blog/${post.slug}`} className="block bg-gray-50 rounded-2xl p-6 md:p-8 hover:shadow-lg transition-all group">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-3">{post.tag}</span>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm md:text-base">
              Read All Articles <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Ready to Create Your CV?</h2>
            <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">Join thousands of job seekers who have created their professional CVs with us. It&apos;s completely free!</p>
            <Link href="/cv-builder" className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl text-base md:text-lg">
              Start Building Now <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
