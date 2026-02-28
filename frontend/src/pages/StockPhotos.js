import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStatsStore, useAuthStore } from '../store/store';
import toast from 'react-hot-toast';
import { triggerSupportPopup } from '../components/SupportPopup';
import { trackView, trackDownload, trackLike, trackSearch, trackSessionStart, getRecommendedCategoryOrder } from '../utils/userBehavior';
import { Search, Loader2, Download, Heart, X, Palette, Briefcase, Monitor, Users, Leaf, UtensilsCrossed, Shirt, GraduationCap, AlertTriangle, Camera, Trash2 } from 'lucide-react';

// Normalise API base – strip trailing /api so we can always append /api/<resource>
const _API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL = _API_BASE.replace(/\/api\/?$/, '');

const StockPhotos = () => {
  const { incrementDownloads, incrementStockPhotos } = useStatsStore();
  const { isAuthenticated, user, token } = useAuthStore();
  const { category: urlCategory } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [downloadingId, setDownloadingId] = useState(null);

  // Track session on mount
  useEffect(() => {
    trackSessionStart();
  }, []);

  // Category emoji icons — vibrant and recognizable
  const categoryIcons = {
    all: <Palette className="w-4 h-4" />,
    business: <Briefcase className="w-4 h-4" />,
    technology: <Monitor className="w-4 h-4" />,
    people: <Users className="w-4 h-4" />,
    nature: <Leaf className="w-4 h-4" />,
    food: <UtensilsCrossed className="w-4 h-4" />,
    travel: '✈️',
    fashion: <Shirt className="w-4 h-4" />,
    health: <Heart className="w-4 h-4" />,
    education: <GraduationCap className="w-4 h-4" />
  };

  const defaultCategories = [
    { id: 'all', name: 'All', color: 'from-cyan-500 to-blue-600' },
    { id: 'business', name: 'Business', color: 'from-blue-500 to-indigo-600' },
    { id: 'technology', name: 'Technology', color: 'from-violet-500 to-purple-600' },
    { id: 'people', name: 'People', color: 'from-pink-400 to-rose-600' },
    { id: 'nature', name: 'Nature', color: 'from-emerald-400 to-green-600' },
    { id: 'food', name: 'Food & Drink', color: 'from-orange-400 to-red-500' },
    { id: 'travel', name: 'Travel', color: 'from-sky-400 to-blue-600' },
    { id: 'fashion', name: 'Fashion', color: 'from-fuchsia-400 to-pink-600' },
    { id: 'health', name: 'Health', color: 'from-red-400 to-rose-600' },
    { id: 'education', name: 'Education', color: 'from-amber-400 to-orange-600' }
  ];

  // Personalize category order based on user behavior
  const categories = useMemo(() => 
    getRecommendedCategoryOrder(defaultCategories),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [photos.length]
  );

  // Fetch photos from API
  const fetchPhotos = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '50');
      
      const response = await fetch(`${API_URL}/api/photos?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos || []);
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Failed to fetch photos:', response.status, errData);
        setPhotos([]);
        setApiError(errData.hint || errData.message || `Server error (${response.status})`);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
      setApiError('Cannot reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchQuery]);


  // Direct download without opening modal
  const handleDownload = async (e, photo) => {
    if (e) e.stopPropagation();
    
    if (downloadingId === photo._id) return;

    proceedWithDownload(photo);
  };
  
  // Actual download logic
  const proceedWithDownload = async (photo) => {
    setDownloadingId(photo._id);
    toast.loading('Preparing download...', { id: 'download-' + photo._id });
    
    try {
      // Track download on server (don't wait for it)
      fetch(`${API_URL}/api/photos/${photo._id}/download`, {
        method: 'POST'
      }).catch(() => {});
      
      const fileName = `${photo.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      
      // Try to download via proxy first (for B2/cloud storage)
      try {
        const proxyUrl = `${API_URL}/api/photos/${photo._id}/proxy-download`;
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
        // Fallback: Try direct fetch with cors
        try {
          const response = await fetch(photo.imageUrl, { mode: 'cors' });
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
          link.href = photo.imageUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.dismiss('download-' + photo._id);
          toast.success('Image opened in new tab - right-click to save', { icon: '🖼️', duration: 4000 });
          incrementDownloads();
          incrementStockPhotos();
          setPhotos(prev => prev.map(p => 
            p._id === photo._id ? { ...p, downloads: (p.downloads || 0) + 1 } : p
          ));
          setSelectedPhoto(null);
          setDownloadingId(null);
          return;
        }
      }
      
      // Update live stats
      incrementDownloads();
      incrementStockPhotos();
      
      // Update local download count
      setPhotos(prev => prev.map(p => 
        p._id === photo._id ? { ...p, downloads: (p.downloads || 0) + 1 } : p
      ));
      
      toast.dismiss('download-' + photo._id);
      toast.success('Downloaded successfully!', { icon: '⬇️' });
      triggerSupportPopup();
      trackDownload(photo);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Download failed:', error);
      toast.dismiss('download-' + photo._id);
      toast.error('Download failed - try right-clicking the image to save');
    } finally {
      setDownloadingId(null);
    }
  };

  // Like photo
  const handleLike = async (e, photo) => {
    if (e) e.stopPropagation();
    
    const isLiked = likedPhotos.has(photo._id);
    
    try {
      await fetch(`${API_URL}/api/photos/${photo._id}/like`, {
        method: 'POST'
      });
      
      if (isLiked) {
        setLikedPhotos(prev => {
          const newSet = new Set(prev);
          newSet.delete(photo._id);
          return newSet;
        });
        setPhotos(prev => prev.map(p => 
          p._id === photo._id ? { ...p, likes: Math.max(0, (p.likes || 0) - 1) } : p
        ));
      } else {
        setLikedPhotos(prev => new Set([...prev, photo._id]));
        setPhotos(prev => prev.map(p => 
          p._id === photo._id ? { ...p, likes: (p.likes || 0) + 1 } : p
        ));
        toast.success('Added to favorites!', { icon: '❤️' });
        trackLike(photo);
      }
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  // Delete photo (only for owner)
  const handleDelete = async (e, photo) => {
    if (e) e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    
    try {
      const response = await fetch(
        `${API_URL}/api/photos/${photo._id}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.ok) {
        setPhotos(prev => prev.filter(p => p._id !== photo._id));
        setSelectedPhoto(null);
        toast.success('Photo deleted!', { icon: '🗑️' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete photo');
    }
  };

  // Check if current user owns the photo
  const isOwner = (photo) => {
    return isAuthenticated && user && photo.uploadedBy === user.id;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  };

  // Swipe-down to close modal on mobile
  const photoTouchStartY = useRef(null);
  const [photoSwipeDelta, setPhotoSwipeDelta] = useState(0);

  const handlePhotoTouchStart = (e) => {
    photoTouchStartY.current = e.touches[0].clientY;
    setPhotoSwipeDelta(0);
  };

  const handlePhotoTouchMove = (e) => {
    if (photoTouchStartY.current === null) return;
    const delta = e.touches[0].clientY - photoTouchStartY.current;
    if (delta > 0) setPhotoSwipeDelta(delta);
  };

  const handlePhotoTouchEnd = () => {
    if (photoSwipeDelta > 80) {
      setSelectedPhoto(null);
    }
    photoTouchStartY.current = null;
    setPhotoSwipeDelta(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Free Stock Photos
            </h1>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto mb-8">
              High-quality stock photos for personal and commercial use. 
              No attribution required.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.length > 2) trackSearch(e.target.value);
                  }}
                  placeholder="Search for photos..."
                  className="w-full px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-cyan-500/25`
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className="text-base flex items-center">{categoryIcons[cat.id] || <Palette className="w-4 h-4" />}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Photos Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl skeleton"></div>
                ))}
              </div>
            ) : apiError ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4"><AlertTriangle className="w-16 h-16 text-yellow-500" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Server unavailable</h3>
                <p className="text-gray-600 mb-4">{typeof apiError === 'string' ? apiError : 'The backend server is not reachable. Please make sure it is running on port 5000.'}</p>
                <button
                  onClick={fetchPhotos}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : photos.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4"><Camera className="w-16 h-16 text-gray-400" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo._id || photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                    onClick={() => { setSelectedPhoto(photo); trackView(photo); }}
                  >
                    <div className="aspect-[4/3]">
                      <img
                        src={photo.thumbnailUrl || photo.imageUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Quick Action Buttons */}
                    <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {/* Download Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleDownload(e, photo)}
                        disabled={downloadingId === photo._id}
                        className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                        title="Download"
                      >
                        {downloadingId === photo._id ? (
                          <Loader2 className="w-4 h-4 text-cyan-600 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 text-cyan-600" />
                        )}
                      </motion.button>
                      
                      {/* Like Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleLike(e, photo)}
                        className={`w-9 h-9 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-colors ${
                          likedPhotos.has(photo._id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 hover:bg-white text-gray-600'
                        }`}
                        title="Like"
                      >
                        <Heart className={`w-4 h-4 ${likedPhotos.has(photo._id) ? 'fill-current' : ''}`} />
                      </motion.button>
                      
                      {/* Delete Button (only for owner) */}
                      {isOwner(photo) && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleDelete(e, photo)}
                          className="w-9 h-9 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors text-white"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                    
                    {/* Overlay with info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-semibold mb-1">{photo.title}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {formatNumber(photo.downloads || 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4 fill-current" />
                            {formatNumber(photo.likes || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Free Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500 text-white">
                        FREE
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* End of photo grid */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['business', 'technology', 'nature', 'people', 'office', 'work', 'team', 'creative'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need a CV?</h3>
              <p className="text-cyan-100 text-sm mb-4">
                Create your professional CV for free with our easy-to-use builder.
              </p>
              <a
                href="/cv-builder"
                className="block w-full py-2 bg-white text-cyan-600 text-center rounded-lg font-medium hover:bg-cyan-50 transition-colors"
              >
                Create CV Now
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handlePhotoTouchStart}
              onTouchMove={handlePhotoTouchMove}
              onTouchEnd={handlePhotoTouchEnd}
              style={photoSwipeDelta > 0 ? { transform: `translateY(${Math.min(photoSwipeDelta * 0.35, 60)}px)`, transition: 'none' } : {}}
            >
              {/* Swipe-down indicator -- mobile only */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
              <p className="text-center text-xs text-gray-400 pb-1 md:hidden">Swipe down to close</p>
              {/* Image */}
              <div className="relative bg-gray-100">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full max-h-[60vh] object-contain"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPhoto.title}</h2>
                    <div className="flex items-center gap-4 text-gray-600">
                      <span>{selectedPhoto.resolution.width} x {selectedPhoto.resolution.height}</span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {formatNumber(selectedPhoto.downloads)} downloads
                      </span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    Free License
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPhoto.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(e, selectedPhoto)}
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      likedPhotos.has(selectedPhoto._id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPhotos.has(selectedPhoto._id) ? 'fill-current' : ''}`} />
                    {likedPhotos.has(selectedPhoto._id) ? 'Liked' : 'Like'}
                  </button>
                  
                  {/* Delete Button (only for owner) */}
                  {isOwner(selectedPhoto) && (
                    <button
                      onClick={(e) => handleDelete(e, selectedPhoto)}
                      className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  )}
                </div>
                
                <button
                  onClick={(e) => handleDownload(e, selectedPhoto)}
                  disabled={downloadingId === selectedPhoto._id}
                  className="w-full py-4 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {downloadingId === selectedPhoto._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {downloadingId === selectedPhoto._id ? 'Downloading...' : 'Download Free'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockPhotos;
