import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Download, Heart, ChevronLeft, ChevronRight, X, Trash2,
  Palette, Leaf, Sparkles, Bug, Landmark, Rocket, Gamepad2, Moon, Rainbow,
  Smartphone, Monitor, AlertTriangle, Image as ImageIcon,
  TrendingUp, LayoutGrid, Maximize2, Square
} from 'lucide-react';
import { useStatsStore, useAuthStore } from '../store/store';
import toast from 'react-hot-toast';
import { triggerSupportPopup } from '../components/SupportPopup';
import { 
  trackView, 
  trackDownload, 
  trackLike, 
  trackSessionStart, 
  getRecommendedCategoryOrder, 
  getPersonalizedLabel,
  updateEngagementStreak,
  trackInteraction,
  getEngagementPrompt
} from '../utils/userBehavior';

// Get or create session seed for consistent shuffling during same session
const getSessionSeed = () => {
  let seed = sessionStorage.getItem('wallpaper_shuffle_seed');
  if (!seed) {
    seed = Date.now().toString();
    sessionStorage.setItem('wallpaper_shuffle_seed', seed);
  }
  return parseInt(seed);
};

// Normalise API base – strip trailing /api so we can always append /api/<resource>
const _API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = _API_BASE.replace(/\/api\/?$/, '');

const Wallpapers = () => {
  const { category: urlCategory } = useParams();
  const { incrementDownloads, incrementWallpapers } = useStatsStore();
  const { isAuthenticated, user, token } = useAuthStore();
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [likedWallpapers, setLikedWallpapers] = useState(new Set());
  const [downloadingId, setDownloadingId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 24;
  
  // API error state – distinguishes network failure from empty results
  const [apiError, setApiError] = useState(false);

  // Shuffle seed for consistent randomization per session
  const shuffleSeed = useRef(getSessionSeed());

  // Get shuffled wallpapers for display - backend already randomizes, just pass-through
  const displayWallpapers = useMemo(() => {
    if (!wallpapers.length) return [];
    return wallpapers;
  }, [wallpapers]);

  // Swipe-down to close modal on mobile
  const touchStartY = useRef(null);
  const [swipeDelta, setSwipeDelta] = useState(0);

  const handleModalTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    setSwipeDelta(0);
  };

  const handleModalTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setSwipeDelta(delta);
  };

  const handleModalTouchEnd = () => {
    if (swipeDelta > 80) {
      setSelectedWallpaper(null);
    }
    touchStartY.current = null;
    setSwipeDelta(0);
  };

  // Related images state
  const [relatedWallpapers, setRelatedWallpapers] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [engagementPrompt, setEngagementPrompt] = useState(null);

  // Track session on mount and update engagement
  useEffect(() => {
    trackSessionStart();
    updateEngagementStreak();
    
    // Show engagement prompt after a short delay
    const promptTimer = setTimeout(() => {
      const prompt = getEngagementPrompt();
      if (prompt) {
        setEngagementPrompt(prompt);
      }
    }, 5000);
    
    // Track time-based interaction
    trackInteraction('page_visit');
    
    return () => clearTimeout(promptTimer);
  }, []);
  


  // Category icons — Lucide React components
  const categoryIcons = {
    all: <Palette className="w-4 h-4" />,
    nature: <Leaf className="w-4 h-4" />,
    abstract: <Sparkles className="w-4 h-4" />,
    animals: <Bug className="w-4 h-4" />,
    architecture: <Landmark className="w-4 h-4" />,
    space: <Rocket className="w-4 h-4" />,
    gaming: <Gamepad2 className="w-4 h-4" />,
    minimalist: <Square className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    gradient: <Rainbow className="w-4 h-4" />
  };

  const defaultCategories = [
    { id: 'all', name: 'All', color: 'from-violet-500 to-purple-600' },
    { id: 'nature', name: 'Nature', color: 'from-emerald-400 to-green-600' },
    { id: 'abstract', name: 'Abstract', color: 'from-fuchsia-500 to-purple-600' },
    { id: 'animals', name: 'Animals', color: 'from-amber-400 to-orange-600' },
    { id: 'architecture', name: 'Architecture', color: 'from-slate-400 to-gray-700' },
    { id: 'space', name: 'Space', color: 'from-indigo-400 to-blue-700' },
    { id: 'gaming', name: 'Gaming', color: 'from-red-500 to-rose-600' },
    { id: 'minimalist', name: 'Minimalist', color: 'from-gray-300 to-gray-500' },
    { id: 'dark', name: 'Dark', color: 'from-gray-700 to-gray-950' },
    { id: 'gradient', name: 'Gradient', color: 'from-cyan-400 to-blue-600' }
  ];

  // Personalize category order based on user behavior
  const categories = useMemo(() => 
    getRecommendedCategoryOrder(defaultCategories),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallpapers.length]
  );

  // Personalized sort label
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sortLabel = useMemo(() => getPersonalizedLabel(), [wallpapers.length]);

  const deviceTypes = [
    { id: 'all', name: 'All Devices' },
    { id: 'desktop', name: 'Desktop' },
    { id: 'mobile', name: 'Mobile' }
  ];

  // Fetch wallpapers from API
  const fetchWallpapers = useCallback(async (page = currentPage) => {
    setLoading(true);
    setApiError(false);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDevice !== 'all') params.append('deviceType', selectedDevice);
      params.append('page', page.toString());
      params.append('limit', ITEMS_PER_PAGE.toString());
      params.append('sort', 'random');
      
      const response = await fetch(`${API_URL}/api/wallpapers?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setWallpapers(data.wallpapers || []);
        if (data.pagination) {
          setTotalPages(data.pagination.pages || 1);
          setTotalCount(data.pagination.total || 0);
        } else {
          setTotalCount((data.wallpapers || []).length);
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Failed to fetch wallpapers:', response.status, errData);
        setWallpapers([]);
        setApiError(errData.hint || errData.message || `Server error (${response.status})`);
      }
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      setWallpapers([]);
      setApiError('Cannot reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedDevice, currentPage]);

  // Fetch related wallpapers when modal opens
  const fetchRelatedWallpapers = useCallback(async (wallpaperId) => {
    setRelatedLoading(true);
    setRelatedWallpapers([]);
    try {
      const response = await fetch(`${API_URL}/api/wallpapers/related/${wallpaperId}?limit=12`);
      if (response.ok) {
        const data = await response.json();
        setRelatedWallpapers(data);
      }
    } catch (error) {
      console.error('Error fetching related wallpapers:', error);
    } finally {
      setRelatedLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallpapers(currentPage);
  }, [selectedCategory, selectedDevice, currentPage, fetchWallpapers]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleDeviceChange = (deviceId) => {
    setSelectedDevice(deviceId);
    setCurrentPage(1);
  };

  // Open modal + fetch related + track view
  const openWallpaperModal = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    fetchRelatedWallpapers(wallpaper._id);
    trackView(wallpaper);
  };

  // Switch to a related wallpaper in modal
  const switchToRelated = (wallpaper) => {
    setSelectedWallpaper(wallpaper);
    fetchRelatedWallpapers(wallpaper._id);
    // Scroll modal to top
    const modalContent = document.getElementById('wallpaper-modal-content');
    if (modalContent) modalContent.scrollTop = 0;
  };

  // Pagination helpers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) pages.push('...');
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) pages.push(i);
      
      if (currentPage < totalPages - 2) pages.push('...');
      
      pages.push(totalPages);
    }
    return pages;
  };

  // Direct download without opening modal
  const handleDownload = async (e, wallpaper) => {
    e.stopPropagation(); // Prevent modal from opening
    
    if (downloadingId === wallpaper._id) return; // Prevent double-click

    proceedWithDownload(wallpaper);
  };
  
  // Actual download logic
  const proceedWithDownload = async (wallpaper) => {
    setDownloadingId(wallpaper._id);
    toast.loading('Preparing download...', { id: 'download-' + wallpaper._id });
    
    try {
      // Track download on server (don't wait for it)
      fetch(`${API_URL}/api/wallpapers/${wallpaper._id}/download`, {
        method: 'POST'
      }).catch(() => {});
      
      const fileName = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}-${wallpaper.resolution?.width || 1920}x${wallpaper.resolution?.height || 1080}.jpg`;
      const downloadSrc = wallpaper.downloadUrl || wallpaper.imageUrl;
      
      // Try to download via proxy first (for B2/cloud storage)
      try {
        const proxyUrl = `${API_URL}/api/wallpapers/${wallpaper._id}/proxy-download`;
        const response = await fetch(proxyUrl);
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('Proxy download failed');
        }
      } catch (proxyError) {
        // Fallback: Try direct fetch with no-cors or open in new tab
        try {
          const response = await fetch(downloadSrc, { mode: 'cors' });
          if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } else {
            throw new Error('Direct fetch failed');
          }
        } catch (fetchError) {
          // Final fallback: Open image in new tab for manual save
          const link = document.createElement('a');
          link.href = downloadSrc;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.dismiss('download-' + wallpaper._id);
          toast.success('Image opened in new tab - right-click to save', { icon: '🖼️', duration: 4000 });
          incrementDownloads();
          incrementWallpapers();
          setWallpapers(prev => prev.map(w => 
            w._id === wallpaper._id ? { ...w, downloads: (w.downloads || 0) + 1 } : w
          ));
          setDownloadingId(null);
          return;
        }
      }
      
      // Update live stats
      incrementDownloads();
      incrementWallpapers();
      
      // Update local download count
      setWallpapers(prev => prev.map(w => 
        w._id === wallpaper._id ? { ...w, downloads: (w.downloads || 0) + 1 } : w
      ));
      
      toast.dismiss('download-' + wallpaper._id);
      toast.success('Downloaded successfully!', { icon: '⬇️' });
      triggerSupportPopup();
      trackDownload(wallpaper);
    } catch (error) {
      console.error('Download failed:', error);
      toast.dismiss('download-' + wallpaper._id);
      toast.error('Download failed - try right-clicking the image to save');
    } finally {
      setDownloadingId(null);
    }
  };

  // Like wallpaper
  const handleLike = async (e, wallpaper) => {
    e.stopPropagation(); // Prevent modal from opening
    
    const isLiked = likedWallpapers.has(wallpaper._id);
    
    try {
      // Track like on server
      await fetch(`${API_URL}/api/wallpapers/${wallpaper._id}/like`, {
        method: 'POST'
      });
      
      // Update local state
      if (isLiked) {
        setLikedWallpapers(prev => {
          const newSet = new Set(prev);
          newSet.delete(wallpaper._id);
          return newSet;
        });
        setWallpapers(prev => prev.map(w => 
          w._id === wallpaper._id ? { ...w, likes: Math.max(0, (w.likes || 0) - 1) } : w
        ));
      } else {
        setLikedWallpapers(prev => new Set([...prev, wallpaper._id]));
        setWallpapers(prev => prev.map(w => 
          w._id === wallpaper._id ? { ...w, likes: (w.likes || 0) + 1 } : w
        ));
        toast.success('Added to favorites!', { icon: '❤️' });
        trackLike(wallpaper);
      }
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  // Delete wallpaper (only for owner)
  const handleDelete = async (e, wallpaper) => {
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this wallpaper?')) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/wallpapers/${wallpaper._id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        setWallpapers(prev => prev.filter(w => w._id !== wallpaper._id));
        setSelectedWallpaper(null);
        toast.success('Wallpaper deleted!', { icon: '🗑️' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete wallpaper');
    }
  };

  // Check if current user owns the wallpaper
  const isOwner = (wallpaper) => {
    return isAuthenticated && user && wallpaper.uploadedBy === user.id;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              HD Wallpapers
            </h1>
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto">
              Browse {totalCount > 0 ? `${totalCount.toLocaleString()}+ ` : ''}stunning wallpapers for your desktop and mobile devices. 
              All free in ultra-high 5K quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          {/* Categories */}
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-2 md:pb-3 mb-2 md:mb-3 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full whitespace-nowrap transition-all text-xs md:text-sm ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-purple-500/25`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className="flex items-center">{categoryIcons[cat.id] || <Palette className="w-4 h-4" />}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Device Types */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {deviceTypes.map((device) => (
                <button
                  key={device.id}
                  onClick={() => handleDeviceChange(device.id)}
                  className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    selectedDevice === device.id
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-0.5">{device.id === 'all' ? <><Smartphone className="w-4 h-4" /><Monitor className="w-4 h-4" /></> : device.id === 'desktop' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}</span>
                  {device.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Prompt Banner */}
      <AnimatePresence>
        {engagementPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white text-center py-2 px-4 text-sm"
          >
            <span>{engagementPrompt.message}</span>
            <button 
              onClick={() => setEngagementPrompt(null)} 
              className="ml-3 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Masonry Grid - Pinterest Style */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Results count */}
        {!loading && wallpapers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-2">
            <p className="text-gray-600 text-xs md:text-sm">
              Showing <span className="font-semibold text-gray-900">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}</span> of <span className="font-semibold text-gray-900">{totalCount.toLocaleString()}</span> wallpapers
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-purple-600 font-medium">
              <TrendingUp className="w-4 h-4" />
              {sortLabel}
            </div>
          </div>
        )}
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`bg-gray-200 rounded-xl skeleton break-inside-avoid ${
                  i % 3 === 0 ? 'h-60 md:h-80' : i % 3 === 1 ? 'h-48 md:h-60' : 'h-72 md:h-96'
                }`}
              ></div>
            ))}
          </div>
        ) : apiError ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4"><AlertTriangle className="w-16 h-16 text-amber-500" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Server unavailable</h3>
            <p className="text-gray-600 mb-4">The backend server is not reachable. Please make sure it is running on port 5000.</p>
            <button
              onClick={() => fetchWallpapers(currentPage)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : displayWallpapers.length === 0 ? (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4"><ImageIcon className="w-16 h-16 text-gray-400" /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No wallpapers found</h3>
            <p className="text-gray-600">Try adjusting your filters or come back later</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
            {displayWallpapers.map((wallpaper, index) => (
              <motion.div
                key={wallpaper._id || wallpaper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white mb-4"
                onClick={() => openWallpaperModal(wallpaper)}
              >
                <img
                  src={wallpaper.previewUrl || wallpaper.thumbnailUrl || wallpaper.imageUrl}
                  alt={wallpaper.title}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{
                    aspectRatio: wallpaper.deviceType === 'mobile' ? '9/16' : '16/10'
                  }}
                  loading="lazy"
                />
                
                {/* Quick Action Buttons - Always visible on hover */}
                <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {/* Download Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleDownload(e, wallpaper)}
                    disabled={downloadingId === wallpaper._id}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    title="Download"
                  >
                    {downloadingId === wallpaper._id ? (
                      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5 text-purple-600" />
                    )}
                  </motion.button>
                  
                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleLike(e, wallpaper)}
                    className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors ${
                      likedWallpapers.has(wallpaper._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 hover:bg-white text-gray-600'
                    }`}
                    title="Like"
                  >
                    <Heart className={`w-5 h-5 ${likedWallpapers.has(wallpaper._id) ? 'fill-current' : ''}`} />
                  </motion.button>
                  
                  {/* Delete Button (only for owner) */}
                  {isOwner(wallpaper) && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleDelete(e, wallpaper)}
                      className="w-10 h-10 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors text-white"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
                
                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{wallpaper.title}</h3>
                    <div className="flex items-center justify-between text-white/80 text-sm">
                      <span>{wallpaper.resolution?.width || 1920}x{wallpaper.resolution?.height || 1080}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {formatNumber(wallpaper.downloads || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4 fill-current" />
                          {formatNumber(wallpaper.likes || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                    wallpaper.deviceType === 'mobile' 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {wallpaper.deviceType || 'Desktop'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 md:gap-2 mt-8 md:mt-10 mb-4">
            {/* Previous */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-0.5 md:gap-1">
              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-1.5 md:px-2 py-2 text-gray-400 text-xs md:text-sm">•••</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`min-w-[32px] md:min-w-[40px] h-8 md:h-10 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-2.5 md:px-4 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        )}

        {/* Page info text */}
        {!loading && totalPages > 1 && (
          <p className="text-center text-xs md:text-sm text-gray-500 mb-6 md:mb-8">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Wallpaper Modal */}
      <AnimatePresence>
        {selectedWallpaper && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setSelectedWallpaper(null)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              id="wallpaper-modal-content"
              className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleModalTouchStart}
              onTouchMove={handleModalTouchMove}
              onTouchEnd={handleModalTouchEnd}
              style={swipeDelta > 0 ? { transform: `translateY(${Math.min(swipeDelta * 0.35, 60)}px)`, transition: 'none' } : {}}
            >
              {/* Swipe-down indicator — visible only on mobile */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-center text-xs text-gray-400 pb-1 md:hidden">Swipe down to close</p>
              {/* Image - use preview for fast loading */}
              <div className="relative bg-gray-900">
                <img
                  src={selectedWallpaper.previewUrl || selectedWallpaper.imageUrl}
                  alt={selectedWallpaper.title}
                  className="w-full max-h-[40vh] md:max-h-[55vh] object-contain"
                />
                <button
                  onClick={() => setSelectedWallpaper(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">{selectedWallpaper.title}</h2>
                    <div className="flex items-center gap-2 md:gap-4 text-gray-600 flex-wrap text-xs md:text-sm">
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" />
                        {selectedWallpaper.resolution?.width || 1920} x {selectedWallpaper.resolution?.height || 1080}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(selectedWallpaper.downloads || 0)} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 fill-current" />
                        {formatNumber(selectedWallpaper.likes || 0)} likes
                      </span>
                      <span className="capitalize text-sm bg-gray-100 px-2 py-0.5 rounded-md">{selectedWallpaper.category}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-semibold shrink-0 ${
                    selectedWallpaper.deviceType === 'mobile' 
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  }`}>
                    {selectedWallpaper.deviceType === 'mobile' ? <><Smartphone className="w-4 h-4 inline" /> Mobile</> : <><Monitor className="w-4 h-4 inline" /> Desktop</>}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(e, selectedWallpaper)}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      likedWallpapers.has(selectedWallpaper._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedWallpapers.has(selectedWallpaper._id) ? 'fill-current' : ''}`} />
                    {likedWallpapers.has(selectedWallpaper._id) ? 'Liked' : 'Like'}
                  </button>
                  
                  {/* Delete Button (only for owner) */}
                  {isOwner(selectedWallpaper) && (
                    <button
                      onClick={(e) => handleDelete(e, selectedWallpaper)}
                      className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  )}
                </div>
                
                {/* Download Button */}
                <button
                  onClick={(e) => handleDownload(e, selectedWallpaper)}
                  disabled={downloadingId === selectedWallpaper._id}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {downloadingId === selectedWallpaper._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloadingId === selectedWallpaper._id ? 'Downloading...' : 'Download Full 5K Wallpaper'}
                </button>

                {/* Related Wallpapers Section */}
                <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-purple-600" />
                    You May Also Like
                  </h3>
                  
                  {relatedLoading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-xl skeleton aspect-[3/4]" />
                      ))}
                    </div>
                  ) : relatedWallpapers.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {relatedWallpapers.map((rw) => (
                        <motion.div
                          key={rw._id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative rounded-xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-lg transition-shadow"
                          onClick={() => switchToRelated(rw)}
                        >
                          <img
                            src={rw.previewUrl || rw.thumbnailUrl || rw.imageUrl}
                            alt={rw.title}
                            className="w-full object-cover group-hover:brightness-110 transition-all"
                            style={{
                              aspectRatio: rw.deviceType === 'mobile' ? '9/16' : '16/10'
                            }}
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-2">
                              <p className="text-white text-xs font-medium truncate">{rw.title}</p>
                            </div>
                          </div>
                          {/* Device indicator dot */}
                          <div className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${
                            rw.deviceType === 'mobile' ? 'bg-pink-400' : 'bg-blue-400'
                          } ring-2 ring-white/80`} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No related wallpapers found</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallpapers;
