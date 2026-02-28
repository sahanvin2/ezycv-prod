'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Search, Loader2, Download, X, ChevronDown,
  Briefcase, Monitor, Users, Leaf, UtensilsCrossed,
  Shirt, GraduationCap, Heart, Plane, LayoutGrid,
  Camera, AlertTriangle
} from 'lucide-react';

interface Photo {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  previewUrl?: string;
  downloadUrl?: string;
  resolution: { width: number; height: number };
  downloads: number;
  likes: number;
  tags: string[];
  license: string;
  storageType?: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; gradient: string }> = {
  all:        { label: 'All Photos',   gradient: 'from-teal-500 to-cyan-600' },
  business:   { label: 'Business',     gradient: 'from-blue-500 to-indigo-600' },
  technology: { label: 'Technology',   gradient: 'from-violet-500 to-purple-600' },
  people:     { label: 'People',       gradient: 'from-pink-400 to-rose-600' },
  nature:     { label: 'Nature',       gradient: 'from-emerald-400 to-green-600' },
  food:       { label: 'Food & Drink', gradient: 'from-orange-400 to-red-500' },
  travel:     { label: 'Travel',       gradient: 'from-sky-400 to-blue-600' },
  fashion:    { label: 'Fashion',      gradient: 'from-fuchsia-400 to-pink-600' },
  health:     { label: 'Health',       gradient: 'from-red-400 to-rose-600' },
  education:  { label: 'Education',    gradient: 'from-amber-400 to-orange-600' },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  all:        <LayoutGrid className="w-3.5 h-3.5" />,
  business:   <Briefcase className="w-3.5 h-3.5" />,
  technology: <Monitor className="w-3.5 h-3.5" />,
  people:     <Users className="w-3.5 h-3.5" />,
  nature:     <Leaf className="w-3.5 h-3.5" />,
  food:       <UtensilsCrossed className="w-3.5 h-3.5" />,
  travel:     <Plane className="w-3.5 h-3.5" />,
  fashion:    <Shirt className="w-3.5 h-3.5" />,
  health:     <Heart className="w-3.5 h-3.5" />,
  education:  <GraduationCap className="w-3.5 h-3.5" />,
};

const CATEGORIES = Object.keys(CATEGORY_CONFIG);
const LIMIT = 24;

export default function StockPhotosClient() {
  const [photos, setPhotos]           = useState<Photo[]>([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [category, setCategory]       = useState('all');
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage]               = useState(1);
  const [total, setTotal]             = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [lightbox, setLightbox]       = useState<Photo | null>(null);
  const [relatedPhotos, setRelatedPhotos] = useState<Photo[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMore = photos.length < total;

  const fetchPhotos = useCallback(async (pg = 1, append = false) => {
    if (append) setLoadingMore(true);
    else { setLoading(true); setError(null); }
    try {
      const params = new URLSearchParams({ page: String(pg), limit: String(LIMIT), sort: '-createdAt' });
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const res = await fetch(`/api/photos?${params}`);
      if (!res.ok) throw new Error('Failed to load photos');
      const data = await res.json();
      const items: Photo[] = data.photos ?? data;
      // Shuffle for random display order
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      setPhotos(prev => append ? [...prev, ...shuffled] : shuffled);
      setTotal(data.pagination?.total ?? data.total ?? items.length);
      setPage(pg);
    } catch (e: unknown) {
      if (!append) setError(e instanceof Error ? e.message : 'Failed to load photos');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [category, search]);

  useEffect(() => { fetchPhotos(1, false); }, [fetchPhotos]);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setSearch(val); setPage(1); }, 500);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1);
    setPhotos([]);
  };

  const fetchRelatedPhotos = async (photo: Photo) => {
    if (!photo?.category) return;
    setLoadingRelated(true);
    setRelatedPhotos([]);
    try {
      const params = new URLSearchParams({ category: photo.category, limit: '13' });
      const res = await fetch(`/api/photos?${params}`);
      if (res.ok) {
        const data = await res.json();
        const related = (data.photos as Photo[] || [])
          .filter((p: Photo) => p._id !== photo._id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setRelatedPhotos(related);
      }
    } catch { /* ignore */ }
    finally { setLoadingRelated(false); }
  };

  const openLightbox = (photo: Photo) => {
    setLightbox(photo);
    fetchRelatedPhotos(photo);
  };

  const handleDownload = async (p: Photo) => {
    if (downloading === p._id) return;
    setDownloading(p._id);
    try {
      const proxyRes = await fetch(`/api/photos/${p._id}/proxy-download`);
      if (proxyRes.ok) {
        const blob = await proxyRes.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${(p.slug || p.title).replace(/\s+/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        await fetch(`/api/photos/${p._id}/download`, { method: 'POST' }).catch(() => {});
        const a = document.createElement('a');
        a.href = p.downloadUrl || p.imageUrl;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } finally {
      setDownloading(null);
    }
  };

  const imgSrc = (p: Photo) => p.previewUrl || p.thumbnailUrl || p.imageUrl;
  const resBadge = (p: Photo) => p.resolution?.width >= 3000 ? '5K' : p.resolution?.width >= 1920 ? 'HD' : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Camera className="w-12 h-12 mx-auto mb-4 text-cyan-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Free Stock Photos</h1>
          <p className="text-cyan-100 text-lg mb-2 max-w-2xl mx-auto">
            Thousands of high-quality photos for personal &amp; commercial use. No attribution required.
          </p>
          {total > 0 && (
            <p className="text-cyan-200 text-sm mb-6">
              {total.toLocaleString()}+ photos across {CATEGORIES.length - 1} categories &mdash; all free, all in 5K quality
            </p>
          )}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for photos"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((c) => {
              const cfg = CATEGORY_CONFIG[c];
              return (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    category === c
                      ? `bg-gradient-to-r ${cfg.gradient} text-white shadow-md`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {CATEGORY_ICONS[c]}
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="break-inside-avoid mb-3 rounded-xl bg-gray-200 animate-pulse" style={{ height: `${160 + (i % 3) * 40}px` }} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Could not load photos</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={() => fetchPhotos(1)} className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">No photos found</h2>
            <p className="text-gray-500">Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Showing <strong>{photos.length.toLocaleString()}</strong> of <strong>{total.toLocaleString()}</strong> photos
            </p>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3">
              {photos.map((p) => {
                const badge = resBadge(p);
                return (
                  <div
                    key={p._id}
                    className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-200 mb-3"
                    onClick={() => openLightbox(p)}
                  >
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: p.resolution?.height && p.resolution?.width ? `${(p.resolution.height / p.resolution.width) * 100}%` : '75%' }}
                    >
                      <Image
                        src={imgSrc(p)}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <p className="text-white text-xs font-medium truncate flex-1 mr-2">{p.title}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(p); }}
                          className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors flex-shrink-0 shadow"
                          title="Download free"
                        >
                          {downloading === p._id ? <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" /> : <Download className="w-3.5 h-3.5 text-gray-800" />}
                        </button>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      <span className="px-1.5 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full">FREE</span>
                      {badge && <span className="px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full">{badge}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => fetchPhotos(page + 1, true)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-60 shadow-md"
                >
                  {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronDown className="w-5 h-5" />}
                  {loadingMore ? 'Loading' : 'Load More Photos'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative bg-gray-900 flex-shrink-0" style={{ height: '52vh' }}>
              <Image
                src={lightbox.previewUrl || lightbox.thumbnailUrl || lightbox.imageUrl}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm z-10"
              >
                <X className="w-5 h-5" />
              </button>
              {/* Quality badges on image */}
              <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
                <span className="px-2.5 py-1 bg-green-500 text-white text-[11px] font-bold rounded-full shadow">FREE</span>
                {(lightbox.storageType === 'b2' || (lightbox.resolution?.width ?? 0) >= 3000) && (
                  <span className="px-2.5 py-1 bg-purple-600 text-white text-[11px] font-bold rounded-full shadow">5K Quality</span>
                )}
              </div>
            </div>

            {/* Scrollable info */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-5">
              {/* Title + meta */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">{lightbox.title}</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
                    <span className="font-mono">{lightbox.resolution?.width ?? '?'} × {lightbox.resolution?.height ?? '?'}</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {(lightbox.downloads ?? 0).toLocaleString()} downloads
                    </span>
                    <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-full text-xs">{lightbox.category}</span>
                  </div>
                </div>
                <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Free License</span>
              </div>

              {/* Description */}
              {lightbox.description && (
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{lightbox.description}</p>
              )}

              {/* Tags */}
              {lightbox.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lightbox.tags.map((t) => (
                    <button
                      key={t}
                      onClick={() => { setSearch(t); setLightbox(null); }}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-teal-50 hover:text-teal-700 text-gray-600 text-xs rounded-full transition-colors"
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}

              {/* Download + heart */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => handleDownload(lightbox)}
                  disabled={downloading === lightbox._id}
                  className="flex-1 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-60"
                >
                  {downloading === lightbox._id
                    ? <Loader2 className="w-5 h-5 animate-spin" />
                    : <Download className="w-5 h-5" />}
                  <span>
                    {downloading === lightbox._id
                      ? 'Downloading…'
                      : (lightbox.storageType === 'b2' || (lightbox.resolution?.width ?? 0) >= 3000)
                        ? 'Download Free — 5K'
                        : 'Download Free'}
                  </span>
                </button>
                <button
                  onClick={() => fetch(`/api/photos/${lightbox._id}/like`, { method: 'POST' }).catch(() => {})}
                  className="px-4 py-3.5 bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-600 rounded-xl transition-colors"
                  title="Like"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Related / Similar Photos */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-gray-400" />
                  Similar Photos
                </h3>
                {loadingRelated ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : relatedPhotos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {relatedPhotos.map((rp) => (
                      <div
                        key={rp._id}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 hover:scale-105 transition-all relative group shadow-sm"
                        onClick={() => { openLightbox(rp); }}
                      >
                        <Image
                          src={rp.previewUrl || rp.thumbnailUrl || rp.imageUrl}
                          alt={rp.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 256px"
                        />
                        {(rp.storageType === 'b2' || (rp.resolution?.width ?? 0) >= 3000) && (
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-purple-600/90 text-white text-[9px] font-bold rounded-full">5K</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">No similar photos found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
