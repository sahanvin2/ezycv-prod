import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPostBySlug, getRelatedPosts } from '../data/blogData';
import { CheckCircle, ChevronRight, Copy, Plus, FileText, Star, Rocket, Target } from 'lucide-react';

// Renders a single content block
const ContentBlock = ({ block }) => {
  switch (block.type) {
    case 'intro':
      return (
        <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-blue-500 pl-5 py-1 bg-blue-50 rounded-r-lg">
          {block.text}
        </p>
      );
    case 'heading':
      return (
        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2">
          {block.text}
        </h2>
      );
    case 'paragraph':
      return (
        <p className="text-gray-700 leading-relaxed mb-5 text-lg">
          {block.text}
        </p>
      );
    case 'quote':
      return (
        <blockquote className="my-6 px-6 py-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
          <p className="text-indigo-900 italic text-lg leading-relaxed">"{block.text}"</p>
        </blockquote>
      );
    case 'bullets':
      return (
        <ul className="mb-6 space-y-3">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-gray-700 text-base leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
            >
              <span className="flex-shrink-0 mt-0.5 text-blue-500">
                <CheckCircle className="w-5 h-5" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = getPostBySlug(slug);
  const relatedPosts = getRelatedPosts(slug, 3);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | EzyCV Blog`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post, slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6"><FileText className="w-16 h-16 mx-auto" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Article Not Found</h1>
          <p className="text-gray-500 mb-8">
            This article doesn't exist or may have been moved. Browse our other career guides.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <header className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-16">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-blue-300 text-sm mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 text-blue-500" />
            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4 text-blue-500" />
            <span className="text-white truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="px-3 py-1 bg-blue-600/80 text-white text-xs font-bold rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            <span className="px-3 py-1 bg-white/10 text-blue-200 text-xs font-medium rounded-full">
              ⏱ {post.readTime}
            </span>
            {post.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full uppercase tracking-wide">
                <Star className="w-3 h-3 fill-current" /> Featured
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-blue-200 leading-relaxed mb-8 max-w-2xl"
          >
            {post.excerpt}
          </motion.p>

          {/* Author + date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
              {post.authorAvatar}
            </div>
            <div>
              <p className="font-semibold text-white">{post.author}</p>
              <p className="text-blue-300 text-sm">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
            <path d="M0 60L48 54.7C96 49 192 39 288 33.3C384 28 480 28 576 33.3C672 39 768 49 864 49.3C960 49 1056 39 1152 33.3C1248 28 1344 28 1392 28L1440 28V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white" />
          </svg>
        </div>
      </header>

      {/* Cover Image */}
      <div className="max-w-4xl mx-auto px-4 -mt-8 mb-10 relative z-10">
        <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">

          {/* Article body */}
          <article>
            {post.content && post.content.map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                viewport={{ once: true }}
              >
                <ContentBlock block={block} />
              </motion.div>
            ))}

            {/* Tags footer */}
            <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Found this helpful? Share it:</p>
              <div className="flex gap-3">
                {[
                  {
                    label: 'Twitter / X',
                    color: 'bg-black text-white hover:bg-gray-800',
                    icon: '𝕏',
                    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://ezycv.org/blog/${post.slug}`)}`,
                  },
                  {
                    label: 'LinkedIn',
                    color: 'bg-blue-700 text-white hover:bg-blue-800',
                    icon: 'in',
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://ezycv.org/blog/${post.slug}`)}`,
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-4 py-2 ${s.color} rounded-lg text-sm font-semibold transition-colors`}
                  >
                    <span className="font-bold">{s.icon}</span>
                    {s.label}
                  </a>
                ))}
                <button
                  onClick={() => { navigator.clipboard.writeText(window.location.href); }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg text-sm font-semibold transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {/* Author card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
                  {post.authorAvatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{post.author}</p>
                  <p className="text-gray-500 text-xs">Career Expert</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Helping professionals build standout CVs and accelerate their careers since 2020.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 mb-6">
              <div className="mb-3"><Rocket className="w-5 h-5" /></div>
              <h3 className="font-bold text-lg mb-2">Build Your CV Today</h3>
              <p className="text-blue-200 text-sm mb-4">
                Put these tips into practice. Create a professional CV in minutes — 100% free.
              </p>
              <Link
                to="/cv-builder"
                className="block text-center px-4 py-2.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Start Building — Free →
              </Link>
            </div>

            {/* Table of Contents */}
            {post.content && post.content.filter(b => b.type === 'heading').length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">In This Article</h3>
                <ol className="space-y-2">
                  {post.content
                    .filter(b => b.type === 'heading')
                    .map((b, i) => (
                      <li key={i} className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer flex items-start gap-2">
                        <span className="text-blue-400 font-semibold flex-shrink-0">{i + 1}.</span>
                        <span className="leading-snug">{b.text}</span>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related, i) => (
                <motion.div
                  key={related.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/blog/${related.slug}`} className="block group h-full">
                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 bg-white/90 text-gray-700 text-xs font-semibold rounded-full">
                            {related.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-3 flex-1">{related.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{related.readTime}</span>
                          <span className="text-blue-500 font-medium">Read →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-5"><Target className="w-5 h-5" /></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Apply What You've Learned?
            </h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
              Build a professional, ATS-friendly CV in minutes using our free templates. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cv-builder"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30"
              >
                <Plus className="w-5 h-5" />
                Start Building — It's Free
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl hover:bg-white/20 transition-all border border-white/20"
              >
                ← More Articles
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
