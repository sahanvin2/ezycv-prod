import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts, categories as allCategories } from '../data/blogData';
import { Search, ArrowRight, ChevronDown, Plus, Star, MailOpen, BookOpen, FileText, Target, BadgeCheck } from 'lucide-react';

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => { document.title = 'Blog — Career Tips & CV Guides | EzyCV'; }, []);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPost = blogPosts.find(p => p.featured);
  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm mb-6 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Fresh content weekly
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Career Tips &<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                CV Writing Guides
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto mb-10">
              Expert advice, actionable tips, and proven strategies to help you craft the perfect CV and accelerate your career growth.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles, tips, guides..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(6); }}
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'All' && searchQuery === '' && (
        <section className="max-w-6xl mx-auto px-4 -mt-4 mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to={`/blog/${featuredPost.slug}`} className="block group">
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full uppercase tracking-wider shadow-lg">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{featuredPost.authorAvatar}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{featuredPost.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(featuredPost.date).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        <span className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                          Read Article
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Category Filter */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setVisibleCount(6); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Count */}
      <section className="max-w-6xl mx-auto px-4 mb-6">
        <p className="text-sm text-gray-500">
          {filteredPosts.length === 0 ? 'No articles found' : `Showing ${Math.min(visibleCount, filteredPosts.length)} of ${filteredPosts.length} articles`}
        </p>
      </section>

      {/* Blog Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <AnimatePresence mode="wait">
          {filteredPosts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="mb-4"><Search className="w-12 h-12 mx-auto" /></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayedPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <Link to={`/blog/${post.slug}`} className="block h-full">
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col border border-gray-100">
                      {/* Image */}
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold rounded-full">
                            {post.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{post.authorAvatar}</span>
                            <div>
                              <p className="text-xs font-semibold text-gray-800">{post.author}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg transition-all duration-300"
            >
              Load More Articles
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="mb-4 block"><MailOpen className="w-6 h-6 mx-auto" /></span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss a Career Tip</h2>
            <p className="text-blue-200 mb-8 text-lg">
              Join thousands of job seekers who get our best CV tips, interview guides, and career advice delivered straight to their inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-5 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap">
                Subscribe Free
              </button>
            </div>
            <p className="text-blue-300 text-xs mt-4">No spam. Unsubscribe anytime. We respect your privacy.</p>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10+', label: 'Expert Articles', icon: <BookOpen className="w-5 h-5" /> },
              { number: '500+', label: 'CVs Created', icon: <FileText className="w-5 h-5" /> },
              { number: '95%', label: 'Success Rate', icon: <Target className="w-5 h-5" /> },
              { number: '100%', label: 'Free Templates', icon: <BadgeCheck className="w-5 h-5" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <span className="text-3xl block mb-2">{stat.icon}</span>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Dream CV?</h2>
            <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
              Put these tips into practice. Create a stunning, ATS-friendly CV in minutes with our free professional templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cv-builder"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
              >
                <Plus className="w-5 h-5" />
                Start Building — It's Free
              </Link>
              <Link
                to="/cv-templates"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
