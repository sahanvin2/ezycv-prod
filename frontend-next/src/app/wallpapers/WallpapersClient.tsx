'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Search, Loader2, Download, X } from 'lucide-react';

interface Wallpaper {
  _id: string;
  title: string;
  category: string;
  deviceType: string;
  thumbnailUrl: string;
  previewUrl?: string;
  imageUrl: string;
  downloadUrl?: string;
  resolution: { width: number; height: number };
  downloads: number;
  likes: number;
  tags: string[];
}

const CATEGORIES = ['all', 'nature', 'abstract', 'space', 'animals', 'dark', 'minimalist', 'gradient', 'architecture', 'gaming'];
const DEVICE_TYPES = ['all', 'desktop', 'mobile', 'both'];

export default function WallpapersClient({ initialCategory = 'all' }: { initialCategory?: string }) {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(initialCategory);
  const [deviceType, setDeviceType] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Wallpaper | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const LIMIT = 24;
  const totalPages = Math.ceil(total / LIMIT);

  const fetchWallpapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), sort: 'trending' });
      if (category !== 'all') params.append('category', category);
      if (deviceType !== 'all') params.append('deviceType', deviceType);
      if (search) params.append('search', search);
      const res = await fetch(`/api/wallpapers?${params}`);
      if (!res.ok) throw new Error('Failed to load wallpapers');
      const data = await res.json();
      const items = data.wallpapers ?? data;
      setWallpapers(items);
      setTotal(data.pagination?.total ?? data.total ?? items.length);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load wallpapers');
    } finally {
      setLoading(false);
    }
  }, [category, deviceType, search, page]);

  useEffect(() => { fetchWallpapers(); }, [fetchWallpapers]);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setSearch(val); setPage(1); }, 500);
  };

  const handleDownload = async (w: Wallpaper) => {
    setDownloading(w._id);
    try {
      await fetch(`/api/wallpapers/${w._id}/download`, { method: 'POST' });
      const url = w.downloadUrl || w.imageUrl;
      const a = document.createElement('a');
      a.href = url;
      a.download = `${w.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Free HD Wallpapers</h1>
          <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto">
            Stunning wallpapers for desktop &amp; mobile. Download free, no sign-up needed.
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search wallpapers…"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">Category:</span>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${category === c ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            {DEVICE_TYPES.map((d) => (
              <button
                key={d}
                onClick={() => { setDeviceType(d); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${deviceType === d ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {d === 'all' ? '🖥️ All' : d === 'desktop' ? '🖥️ Desktop' : d === 'mobile' ? '📱 Mobile' : '✨ Both'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="aspect-video bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😞</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Could not load wallpapers</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={fetchWallpapers} className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && wallpapers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No wallpapers found</h2>
            <p className="text-gray-500">Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && wallpapers.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{total.toLocaleString()} wallpapers found</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {wallpapers.map((w) => (
                <div key={w._id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-900 aspect-video" onClick={() => setLightbox(w)}>
                  <Image
                    src={w.previewUrl || w.thumbnailUrl || w.imageUrl}
                    alt={w.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{w.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-300 text-xs">{w.resolution.width}×{w.resolution.height}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDownload(w); }}
                          className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors"
                          title="Download"
                        >
                          {downloading === w._id ? (
                            <Loader2 className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5 text-gray-800" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 bg-black/40 text-white text-[10px] rounded-full backdrop-blur-sm capitalize">{w.category}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                  return (
                    <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${p === page ? 'bg-purple-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="relative rounded-2xl overflow-hidden bg-gray-900" style={{ aspectRatio: `${lightbox.resolution.width}/${lightbox.resolution.height}`, maxHeight: '80vh' }}>
              <Image
                src={lightbox.previewUrl || lightbox.imageUrl}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">{lightbox.title}</h3>
                <p className="text-gray-400 text-sm">{lightbox.resolution.width}×{lightbox.resolution.height} · {lightbox.category} · {lightbox.downloads} downloads</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lightbox.tags?.map(t => <span key={t} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded-full">{t}</span>)}
                </div>
              </div>
              <button
                onClick={() => handleDownload(lightbox)}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                {downloading === lightbox._id ? 'Downloading…' : 'Free Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
