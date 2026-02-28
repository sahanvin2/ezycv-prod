import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStatsStore } from '../store/store';
import { FileText, Image, Camera, ArrowRight, Check, FileDown, ImageIcon, CameraIcon, Download, CheckCircle, Lock, Lightbulb, Star } from 'lucide-react';

// Strip trailing /api if present so we can always append /api/<resource>
const _API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = _API_BASE.replace(/\/api\/?$/, '');

const Home = () => {
  // Subscribe directly to individual stat values for granular reactivity
  const cvsCreated = useStatsStore(state => state.stats.cvsCreated);
  const totalDownloads = useStatsStore(state => state.stats.totalDownloads);
  const wallpapersStore = useStatsStore(state => state.stats.wallpapers);
  const stockPhotosStore = useStatsStore(state => state.stats.stockPhotos);
  
  const [apiStats, setApiStats] = useState({ wallpapers: null, stockPhotos: null, cvsCreated: null, totalDownloads: null });
  
  // Fetch real counts from API on mount + periodic refresh
  const fetchRealCounts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/wallpapers/stats`);
      if (res.ok) {
        const data = await res.json();
        setApiStats({
          wallpapers: data.wallpapers || null,
          stockPhotos: data.stockPhotos || null,
          cvsCreated: data.cvsCreated || null,
          totalDownloads: data.totalDownloads || null
        });
      }
    } catch (err) {
      // Silently fallback to store values
    }
  }, []);

  useEffect(() => {
    fetchRealCounts();
    // Refresh stats every 30 seconds for live feel
    const interval = setInterval(fetchRealCounts, 30000);
    return () => clearInterval(interval);
  }, [fetchRealCounts]);

  // Compute final display values — API data takes priority
  const displayStats = {
    cvsCreated: apiStats.cvsCreated ?? cvsCreated,
    totalDownloads: apiStats.totalDownloads ?? totalDownloads,
    wallpapers: apiStats.wallpapers ?? wallpapersStore,
    stockPhotos: apiStats.stockPhotos ?? stockPhotosStore
  };
  
  // Format number with K+ suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K+';
    }
    return num.toString();
  };
  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Free CV Builder',
      description: 'Create professional CVs with our easy-to-use builder. Multiple templates available.',
      link: '/cv-builder',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: 'HD Wallpapers',
      description: 'Download stunning wallpapers for desktop and mobile devices.',
      link: '/wallpapers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'Stock Photos',
      description: 'Free high-quality stock photos for personal and commercial use.',
      link: '/stock-photos',
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  const liveStats = [
    { number: displayStats.cvsCreated, label: 'CVs Created', icon: <FileText className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-blue-500 to-indigo-600' },
    { number: displayStats.totalDownloads, label: 'Downloads', icon: <FileDown className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-green-500 to-emerald-600' },
    { number: displayStats.wallpapers, label: 'Wallpapers', icon: <ImageIcon className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-purple-500 to-pink-600' },
    { number: displayStats.stockPhotos, label: 'Stock Photos', icon: <CameraIcon className="w-7 h-7 md:w-8 md:h-8" />, color: 'from-orange-500 to-red-600' }
  ];

  // Enhanced template previews with unique designs
  const TemplatePreview = ({ template, index }) => {
    const renderTemplatePreview = () => {
      switch (template.id) {
        case 'modern':
          return (
            <div className="h-full bg-white flex">
              {/* Left sidebar */}
              <div className="w-1/3 bg-gradient-to-b from-blue-600 to-blue-700 p-2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white/30 mb-2"></div>
                <div className="h-1.5 w-10 bg-white/60 rounded mb-3"></div>
                <div className="w-full space-y-2">
                  <div className="h-1 bg-white/40 rounded"></div>
                  <div className="h-1 bg-white/40 rounded w-3/4"></div>
                  <div className="h-1 bg-white/40 rounded w-1/2"></div>
                </div>
                <div className="mt-auto space-y-1 w-full">
                  <div className="h-0.5 bg-white/30 rounded"></div>
                  <div className="h-0.5 bg-white/30 rounded"></div>
                </div>
              </div>
              {/* Right content */}
              <div className="flex-1 p-2">
                <div className="h-2 bg-blue-600 rounded w-3/4 mb-2"></div>
                <div className="space-y-1 mb-2">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-1.5 bg-blue-100 rounded w-1/2 mb-1"></div>
                <div className="space-y-0.5">
                  <div className="h-0.5 bg-gray-100 rounded"></div>
                  <div className="h-0.5 bg-gray-100 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          );
        
        case 'classic':
          return (
            <div className="h-full bg-white p-3">
              {/* Centered header */}
              <div className="text-center mb-2 pb-1 border-b border-gray-300">
                <div className="h-2 bg-gray-800 rounded w-1/2 mx-auto mb-1"></div>
                <div className="h-1 bg-gray-400 rounded w-1/3 mx-auto"></div>
              </div>
              {/* Two columns */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-700 rounded w-2/3 mb-1"></div>
                  <div className="h-0.5 bg-gray-200 rounded"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 bg-gray-700 rounded w-2/3 mb-1"></div>
                  <div className="h-0.5 bg-gray-200 rounded"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="mt-2 pt-1 border-t border-gray-200">
                <div className="h-1 bg-gray-600 rounded w-1/3 mb-1"></div>
                <div className="h-0.5 bg-gray-100 rounded"></div>
                <div className="h-0.5 bg-gray-100 rounded w-5/6 mt-0.5"></div>
              </div>
            </div>
          );
        
        case 'creative':
          return (
            <div className="h-full bg-gradient-to-br from-purple-50 to-pink-50 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-purple-200/50"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-pink-200/50"></div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                  <div>
                    <div className="h-1.5 bg-purple-600 rounded w-16 mb-1"></div>
                    <div className="h-1 bg-purple-300 rounded w-10"></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-purple-200 rounded"></div>
                  <div className="h-1 bg-purple-200 rounded w-4/5"></div>
                </div>
                <div className="mt-2 flex gap-1">
                  <div className="px-1.5 py-0.5 bg-purple-500 rounded text-[4px] text-white">Skill</div>
                  <div className="px-1.5 py-0.5 bg-pink-500 rounded text-[4px] text-white">Skill</div>
                </div>
              </div>
            </div>
          );
        
        case 'minimal':
          return (
            <div className="h-full bg-white p-3">
              <div className="mb-3">
                <div className="h-2.5 bg-black rounded w-1/2 mb-1"></div>
                <div className="h-1 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="border-t border-black pt-2">
                <div className="space-y-2">
                  <div>
                    <div className="h-1 bg-black rounded w-1/4 mb-1"></div>
                    <div className="h-0.5 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-1 bg-black rounded w-1/4 mb-1"></div>
                    <div className="h-0.5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        
        case 'professional':
          return (
            <div className="h-full bg-white">
              {/* Top header bar */}
              <div className="bg-sky-700 p-2 text-center">
                <div className="w-7 h-7 rounded-full bg-white mx-auto mb-1"></div>
                <div className="h-1.5 bg-white rounded w-1/2 mx-auto mb-0.5"></div>
                <div className="h-1 bg-sky-200 rounded w-1/3 mx-auto"></div>
              </div>
              <div className="p-2">
                <div className="grid grid-cols-3 gap-1 mb-2">
                  <div className="text-center">
                    <div className="w-3 h-3 rounded bg-sky-100 mx-auto mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded bg-sky-100 mx-auto mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 rounded bg-sky-100 mx-auto mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-1 bg-sky-600 rounded w-1/3 mb-1"></div>
                <div className="h-0.5 bg-gray-100 rounded"></div>
              </div>
            </div>
          );
        
        case 'elegant':
          return (
            <div className="h-full bg-white p-3 border-l-4 border-rose-700">
              <div className="mb-2">
                <div className="h-2 bg-rose-700 rounded w-2/3 mb-1"></div>
                <div className="h-1 bg-rose-200 rounded w-1/3"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-br from-rose-200 to-rose-300"></div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-1 bg-gray-200 rounded"></div>
                  <div className="h-1 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-1 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>
              <div className="mt-2 pt-1 border-t border-rose-100">
                <div className="h-1 bg-rose-600 rounded w-1/4"></div>
              </div>
            </div>
          );
        
        case 'executive':
          return (
            <div className="h-full bg-slate-900 text-white p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20"></div>
                <div>
                  <div className="h-1.5 bg-white rounded w-14 mb-1"></div>
                  <div className="h-1 bg-slate-500 rounded w-10"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-1 bg-slate-700 rounded w-1/3 mb-0.5"></div>
                <div className="h-0.5 bg-slate-600 rounded"></div>
                <div className="h-0.5 bg-slate-600 rounded w-4/5"></div>
              </div>
              <div className="mt-2 flex gap-1">
                <div className="h-2 w-6 bg-amber-500 rounded-sm"></div>
                <div className="h-2 w-6 bg-slate-600 rounded-sm"></div>
                <div className="h-2 w-6 bg-slate-600 rounded-sm"></div>
              </div>
            </div>
          );
        
        case 'tech':
          return (
            <div className="h-full bg-gray-900 p-3 relative overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                backgroundSize: '8px 8px'
              }}></div>
              <div className="relative">
                <div className="flex items-center gap-1 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="h-1.5 bg-emerald-500 rounded w-16"></div>
                </div>
                <div className="h-1 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400"></div>
                    <div className="h-0.5 bg-gray-600 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-400"></div>
                    <div className="h-0.5 bg-gray-600 rounded flex-1 w-4/5"></div>
                  </div>
                </div>
                <div className="mt-2 flex gap-0.5">
                  <div className="px-1 py-0.5 bg-emerald-600 rounded text-[3px] text-white">JS</div>
                  <div className="px-1 py-0.5 bg-emerald-600 rounded text-[3px] text-white">React</div>
                </div>
              </div>
            </div>
          );
        
        case 'academic':
          return (
            <div className="h-full bg-white p-3">
              {/* Academic header */}
              <div className="text-center border-b-2 border-indigo-800 pb-1 mb-2">
                <div className="h-2 bg-indigo-800 rounded w-2/3 mx-auto mb-1"></div>
                <div className="h-1 bg-indigo-300 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="h-1 bg-indigo-700 rounded w-1/3 mb-0.5 font-serif"></div>
                  <div className="h-0.5 bg-gray-200 rounded"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-5/6 mt-0.5"></div>
                </div>
                <div>
                  <div className="h-1 bg-indigo-700 rounded w-1/4 mb-0.5"></div>
                  <div className="h-0.5 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          );
        
        case 'compact':
          return (
            <div className="h-full bg-white p-2">
              {/* Compact two-column layout */}
              <div className="flex gap-2 h-full">
                <div className="w-1/3 bg-gray-100 rounded p-1.5">
                  <div className="w-6 h-6 rounded-full bg-gray-400 mx-auto mb-1"></div>
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-gray-400 rounded"></div>
                    <div className="h-0.5 bg-gray-400 rounded w-4/5 mx-auto"></div>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="h-1 bg-gray-500 rounded w-full"></div>
                    <div className="h-0.5 bg-gray-300 rounded"></div>
                    <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div>
                    <div className="h-1 bg-gray-700 rounded w-1/2 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded"></div>
                  </div>
                  <div>
                    <div className="h-1 bg-gray-700 rounded w-1/3 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div>
                    <div className="h-1 bg-gray-700 rounded w-1/4 mb-0.5"></div>
                    <div className="h-0.5 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        
        default:
          return (
            <div className="h-full p-4 flex flex-col" style={{ borderTop: `4px solid ${template.color}` }}>
              <div className="w-8 h-8 rounded-full mb-2" style={{ backgroundColor: template.color + '20' }}></div>
              <div className="h-2 rounded w-3/4 mb-2" style={{ backgroundColor: template.color }}></div>
              <div className="space-y-1 flex-1">
                <div className="h-1 bg-gray-200 rounded"></div>
                <div className="h-1 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        className="group"
      >
        <Link
          to={`/cv-builder?template=${template.id}`}
          className="block aspect-[3/4] rounded-xl shadow-md overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
        >
          {renderTemplatePreview()}
        </Link>
        <p className="text-center text-sm font-medium text-gray-600 mt-2 group-hover:text-blue-600 transition-colors">
          {template.name}
        </p>
      </motion.div>
    );
  };

  const templates = [
    { id: 'modern', name: 'Modern', color: '#2563eb', hasPhoto: true },
    { id: 'classic', name: 'Classic', color: '#374151', hasPhoto: true },
    { id: 'creative', name: 'Creative', color: '#9333ea', hasPhoto: true },
    { id: 'minimal', name: 'Minimal', color: '#000000', hasPhoto: false },
    { id: 'professional', name: 'Professional', color: '#0369a1', hasPhoto: true },
    { id: 'elegant', name: 'Elegant', color: '#be123c', hasPhoto: true },
    { id: 'executive', name: 'Executive', color: '#1e293b', hasPhoto: true },
    { id: 'tech', name: 'Tech', color: '#059669', hasPhoto: true },
    { id: 'academic', name: 'Academic', color: '#3730a3', hasPhoto: true },
    { id: 'compact', name: 'Compact', color: '#4b5563', hasPhoto: false }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptLTEyLTQydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bS0xMi00MnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2em0wIDEydjZoLTZ2LTZoNnptMCAxMnY2aC02di02aDZ6bTAgMTJ2NmgtNnYtNmg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        {/* Floating gradient orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-blue-100 mb-6 border border-white/20"
              >
                <motion.span 
                  className="w-2 h-2 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Trusted by 100+ professionals
              </motion.div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block"
                >
                  Create Your Perfect CV
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  100% Free
                </motion.span>
              </h1>
              <motion.p 
                className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Build professional CVs in minutes with our easy-to-use builder. 
                Choose from multiple templates and download as PDF instantly.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/cv-builder"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  >
                    Create CV Now 
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/cv-templates"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30"
                  >
                    View Templates
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <motion.div 
                  className="absolute -top-4 -right-4 w-72 h-96 bg-purple-500/30 rounded-2xl"
                  animate={{ 
                    rotate: [0, 2, 0, -2, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-72 h-96 bg-blue-400/30 rounded-2xl"
                  animate={{ 
                    rotate: [0, -2, 0, 2, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div 
                  className="relative bg-white rounded-2xl shadow-2xl p-6 text-gray-800"
                  whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"
                      animate={{ 
                        boxShadow: [
                          "0 0 0 0 rgba(59, 130, 246, 0)",
                          "0 0 0 8px rgba(59, 130, 246, 0.1)",
                          "0 0 0 0 rgba(59, 130, 246, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <h3 className="font-bold text-lg">John Doe</h3>
                      <p className="text-gray-500 text-sm">Software Developer</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[100, 83, 66].map((width, i) => (
                      <motion.div 
                        key={i}
                        className="h-3 bg-gray-200 rounded"
                        style={{ width: `${width}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
                      />
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <motion.div 
                      className="text-xs text-gray-500 mb-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      EXPERIENCE
                    </motion.div>
                    <div className="space-y-2">
                      {[100, 75].map((width, i) => (
                        <motion.div 
                          key={i}
                          className="h-2 bg-blue-100 rounded"
                          style={{ width: `${width}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Success indicator */}
                  <motion.div
                    className="absolute -top-3 -right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  >
                    <Check className="w-5 h-5 text-white" strokeWidth={3} />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center hidden md:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
            >
              <motion.div 
                className="w-1.5 h-3 bg-white/60 rounded-full"
                animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {liveStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`text-2xl md:text-3xl mb-1 md:mb-2 inline-flex bg-gradient-to-r ${stat.color} bg-clip-text`}>{stat.icon}</div>
                  <div 
                    className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-0.5 md:mb-1`}
                  >
                    {formatNumber(stat.number)}
                  </div>
                  <div className="text-gray-600 text-xs md:text-sm font-medium">{stat.label}</div>
                </div>
                
                {/* Live indicator */}
                <div className="absolute top-2 right-2 md:top-3 md:right-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[8px] md:text-[10px] text-green-600 font-medium hidden sm:inline">LIVE</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4"
            >
              Our Services
            </motion.span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Everything You Need
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              From creating professional CVs to stunning wallpapers and stock photos, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={feature.link}
                  className="block bg-white rounded-2xl p-5 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 card-hover h-full border border-gray-100 group"
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-3 md:mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1.5 md:mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-3 md:mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-3 md:mb-4">
              10 Professional Templates
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
              Choose Your Perfect CV Template
            </h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
              From classic to creative, find the template that matches your style and industry
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            {templates.map((template, index) => (
              <TemplatePreview key={template.id} template={template} index={index} />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/cv-templates"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              View All Templates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Wallpapers Preview Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-3 md:mb-4">
                🖼️ Free HD Wallpapers
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Stunning Wallpapers Collection
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Refresh your screens with beautiful, high-quality wallpapers. Free for desktop and mobile!
              </p>
            </motion.div>
          </div>

          {/* Wallpaper Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
            {[
              { name: 'Nature', icon: '🌿', color: 'from-green-400 to-emerald-500' },
              { name: 'Abstract', icon: '🔮', color: 'from-purple-400 to-fuchsia-500' },
              { name: 'Space', icon: '🚀', color: 'from-blue-400 to-indigo-600' },
              { name: 'Animals', icon: '🦋', color: 'from-orange-400 to-amber-500' },
              { name: 'Dark', icon: '🌙', color: 'from-gray-600 to-gray-800' }
            ].map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/wallpapers/${cat.name.toLowerCase()}`}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r ${cat.color} text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Wallpaper Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { preview: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', title: 'Mountain Sunrise', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80', title: 'Cosmic Galaxy', category: 'space' },
              { preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80', title: 'Fluid Colors', category: 'abstract' },
              { preview: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', title: 'Ocean Waves', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80', title: 'Nebula Dreams', category: 'space' },
              { preview: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&q=80', title: 'Gradient Art', category: 'abstract' },
              { preview: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=80', title: 'Foggy Forest', category: 'nature' },
              { preview: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80', title: 'Night Sky', category: 'dark' }
            ].map((wallpaper, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-[4/3]"
              >
                <Link to={`/wallpapers/${wallpaper.category}`}>
                  <img
                    src={wallpaper.preview}
                    alt={wallpaper.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-medium text-sm truncate">{wallpaper.title}</p>
                      <p className="text-white/70 text-xs capitalize">{wallpaper.category}</p>
                    </div>
                  </div>
                  {/* Download hint */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Download className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <Link
              to="/wallpapers"
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-pink-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Explore All Wallpapers
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                ⭐ Success Stories
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
                Loved by Job Seekers Worldwide
              </h2>
              <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
                Real stories from people who landed their dream jobs using Ezy CV
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-8">
            {[
              {
                name: 'Michael Rodriguez',
                role: 'Software Engineer at Tech Corp',
                initials: 'MR',
                color: 'from-blue-500 to-indigo-600',
                quote: 'Ezy CV helped me create a professional resume in under 10 minutes. I got 3 interview calls in the first week!',
                rating: 5
              },
              {
                name: 'Sarah Thompson',
                role: 'Marketing Manager at StartUp Inc',
                initials: 'ST',
                color: 'from-pink-500 to-rose-600',
                quote: 'The templates are beautiful and easy to customize. I landed my dream job thanks to the modern CV I created here.',
                rating: 5
              },
              {
                name: 'David Chen',
                role: 'Graphic Designer at Creative Agency',
                initials: 'DC',
                color: 'from-emerald-500 to-teal-600',
                quote: 'As a designer, I appreciate good design. Ezy CV exceeded my expectations with its creative templates!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 text-blue-100 text-4xl md:text-6xl font-serif">"</div>
                
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                  {testimonial.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-11 h-11 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center ring-4 ring-blue-100`}>
                    <span className="text-white font-bold text-sm md:text-base">{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-8 px-6 md:px-8 py-4 md:py-6 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="font-semibold text-gray-700">100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-6 h-6 text-blue-500" />
                <span className="font-semibold text-gray-700">Privacy Focused</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-500" />
                <span className="font-semibold text-gray-700">Easy to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="font-semibold text-gray-700">4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              Ready to Create Your CV?
            </h2>
            <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have created their professional CVs with us. It's completely free!
            </p>
            <Link
              to="/cv-builder"
              className="inline-flex items-center gap-2 px-8 md:px-10 py-4 md:py-5 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl text-base md:text-lg"
            >
              Start Building Now
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
