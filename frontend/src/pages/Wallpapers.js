import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatsStore, useAuthStore } from '../store/store';
import toast from 'react-hot-toast';
import { showAdBeforeDownload } from '../utils/adHelper';
import { 
  trackView, 
  trackDownload, 
  trackLike, 
  trackSessionStart, 
  getRecommendedCategoryOrder, 
  getPersonalizedLabel,
  updateEngagementStreak,
  trackInteraction,
  getEngagementPrompt,
  getTimeBasedRecommendation
} from '../utils/userBehavior';

// Fisher-Yates shuffle with seeded random for consistent per-session shuffling
const seededShuffle = (array, seed) => {
  const shuffled = [...array];
  let currentSeed = seed;
  
  const seededRandom = () => {
    const x = Math.sin(currentSeed++) * 10000;
    return x - Math.floor(x);
  };
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get or create session seed for consistent shuffling during same session
const getSessionSeed = () => {
  let seed = sessionStorage.getItem('wallpaper_shuffle_seed');
  if (!seed) {
    seed = Date.now().toString();
    sessionStorage.setItem('wallpaper_shuffle_seed', seed);
  }
  return parseInt(seed);
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  
  // Shuffle seed for consistent randomization per session
  const shuffleSeed = useRef(getSessionSeed());
  
  // Get shuffled wallpapers for display - ensures variety on each category visit
  const displayWallpapers = useMemo(() => {
    if (!wallpapers.length) return [];
    // Create category-specific seed to ensure different order per category
    const categorySeed = shuffleSeed.current + selectedCategory.charCodeAt(0) * 1000 + currentPage * 100;
    return seededShuffle(wallpapers, categorySeed);
  }, [wallpapers, selectedCategory, currentPage]);

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
  
  // Refresh shuffle - gives users fresh content order
  const refreshShuffle = () => {
    const newSeed = Date.now().toString();
    sessionStorage.setItem('wallpaper_shuffle_seed', newSeed);
    shuffleSeed.current = parseInt(newSeed);
    // Force re-render by triggering a state change
    setCurrentPage(prev => prev);
    toast.success('Fresh order! Enjoy discovering!', { icon: '🔄' });
  };

  // Category emoji icons — vibrant and instantly recognizable
  const categoryIcons = {
    all: '🎨',
    nature: '🌿',
    abstract: '🔮',
    animals: '🦋',
    architecture: '🏛️',
    space: '🚀',
    gaming: '🎮',
    minimalist: '◻️',
    dark: '🌙',
    gradient: '🌈'
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
  const sortLabel = useMemo(() => getPersonalizedLabel(), [wallpapers.length]);

  const deviceTypes = [
    { id: 'all', name: 'All Devices' },
    { id: 'desktop', name: 'Desktop' },
    { id: 'mobile', name: 'Mobile' }
  ];

  // Fetch wallpapers from API
  const fetchWallpapers = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDevice !== 'all') params.append('deviceType', selectedDevice);
      params.append('page', page.toString());
      params.append('limit', ITEMS_PER_PAGE.toString());
      params.append('sort', 'trending');
      
      const response = await fetch(`${API_URL}/api/wallpapers?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setWallpapers(data.wallpapers || []);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
          setTotalCount(data.pagination.total);
        }
      } else {
        console.error('Failed to fetch wallpapers');
        setWallpapers([]);
      }
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      setWallpapers([]);
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
    
    // Show ad before starting download
    showAdBeforeDownload(() => {
      proceedWithDownload(wallpaper);
    }, 'wallpaper');
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
                <span className="text-base">{categoryIcons[cat.id] || '🎨'}</span>
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
                  <span>{device.id === 'all' ? '📱💻' : device.id === 'desktop' ? '💻' : '📱'}</span>
                  {device.name}
                </button>
              ))}
            </div>
            
            {/* Shuffle button */}
            <motion.button
              onClick={refreshShuffle}
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-1.5 md:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs md:text-sm font-medium shadow-md hover:shadow-lg transition-all"
              title="Shuffle for fresh content"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Shuffle</span>
            </motion.button>
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
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
        ) : displayWallpapers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No wallpapers found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
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
                      <svg className="w-5 h-5 text-purple-600 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
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
                    <svg className="w-5 h-5" fill={likedWallpapers.has(wallpaper._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {formatNumber(wallpaper.downloads || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
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
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              id="wallpaper-modal-content"
              className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Info */}
              <div className="p-4 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">{selectedWallpaper.title}</h2>
                    <div className="flex items-center gap-2 md:gap-4 text-gray-600 flex-wrap text-xs md:text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        {selectedWallpaper.resolution?.width || 1920} x {selectedWallpaper.resolution?.height || 1080}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {formatNumber(selectedWallpaper.downloads || 0)} downloads
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
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
                    {selectedWallpaper.deviceType === 'mobile' ? '📱 Mobile' : '🖥️ Desktop'}
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
                    <svg className="w-5 h-5" fill={likedWallpapers.has(selectedWallpaper._id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {likedWallpapers.has(selectedWallpaper._id) ? 'Liked' : 'Like'}
                  </button>
                  
                  {/* Delete Button (only for owner) */}
                  {isOwner(selectedWallpaper) && (
                    <button
                      onClick={(e) => handleDelete(e, selectedWallpaper)}
                      className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  {downloadingId === selectedWallpaper._id ? 'Downloading...' : 'Download Full 5K Wallpaper'}
                </button>

                {/* Related Wallpapers Section */}
                <div className="mt-6 md:mt-8 border-t pt-4 md:pt-6">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
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
