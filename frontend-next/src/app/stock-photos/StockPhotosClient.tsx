'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Search, Loader2, Download, X } from 'lucide-react';

interface Photo {
  _id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  resolution: { width: number; height: number };
  downloads: number;
  likes: number;
  tags: string[];
  license: string;
}

const CATEGORIES = ['all', 'business', 'technology', 'people', 'nature', 'food', 'travel', 'fashion', 'sports', 'health', 'education'];
const LIMIT = 20;

export default function StockPhotosClient() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPages = Math.ceil(total / LIMIT);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), sort: '-createdAt' });
      if (category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      const res = await fetch(`/api/photos?${params}`);
      if (!res.ok) throw new Error('Failed to load photos');
      const data = await res.json();
      const items = data.photos ?? data;
      setPhotos(items);
      setTotal(data.pagination?.total ?? data.total ?? items.length);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load photos');
    } finally {
      setLoading(false);
    }
  }, [category, search, page]);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => { setSearch(val); setPage(1); }, 500);
  };

  const handleDownload = async (p: Photo) => {
    setDownloading(p._id);
    try {
      await fetch(`/api/photos/${p._id}/download`, { method: 'POST' });
      const a = document.createElement('a');
      a.href = p.imageUrl;
      a.download = `${p.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
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
      <section className="bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Free Stock Photos</h1>
          <p className="text-cyan-100 text-lg mb-6 max-w-2xl mx-auto">
            Thousands of high-quality photos for personal &amp; commercial use. No attribution required.
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search photos…"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap gap-2 items-center overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === c ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😞</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Could not load photos</h2>
            <p className="text-gray-500 mb-4">{error}</p>
            <button onClick={fetchPhotos} className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No photos found</h2>
            <p className="text-gray-500">Try a different category or search term.</p>
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">{total.toLocaleString()} photos found</p>
            {/* Masonry-style grid */}
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 space-y-3">
              {photos.map((p) => (
                <div
                  key={p._id}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gray-200 mb-3"
                  onClick={() => setLightbox(p)}
                >
                  <div className="relative w-full" style={{ paddingBottom: `${(p.resolution.height / p.resolution.width) * 100}%` }}>
                    <Image
                      src={p.thumbnailUrl || p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                      <p className="text-white text-xs font-medium truncate flex-1 mr-2">{p.title}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(p); }}
                        className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors flex-shrink-0"
                        title="Download"
                      >
                        {downloading === p._id ? (
                          <Loader2 className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-gray-800" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 bg-black/40 text-white text-[10px] rounded-full backdrop-blur-sm">
                      {p.license === 'free' ? 'Free' : p.license}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(pg => Math.max(1, pg - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  ← Prev
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const pg = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i;
                  return (
                    <button key={pg} onClick={() => setPage(pg)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${pg === page ? 'bg-teal-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {pg}
                    </button>
                  );
                })}
                <button onClick={() => setPage(pg => Math.min(totalPages, pg + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
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
                src={lightbox.imageUrl}
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
                {lightbox.description && <p className="text-gray-400 text-sm mt-0.5">{lightbox.description}</p>}
                <p className="text-gray-500 text-sm">{lightbox.resolution.width}×{lightbox.resolution.height} · {lightbox.category} · {lightbox.downloads} downloads</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lightbox.tags?.map(t => <span key={t} className="px-2 py-0.5 bg-white/10 text-gray-300 text-xs rounded-full">{t}</span>)}
                </div>
              </div>
              <button
                onClick={() => handleDownload(lightbox)}
                className="flex items-center gap-2 px-5 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-lg ml-4 flex-shrink-0"
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
