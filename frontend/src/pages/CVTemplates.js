import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LargeBannerAd, NativeBannerAd } from '../components/Ads/AdComponents';
import { useStatsStore } from '../store/store';
import { User, ArrowRight, BookOpen, Briefcase, Palette, Sparkles, ScrollText, Star, Camera, Ruler, CheckCircle } from 'lucide-react';

const CVTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { trackTemplateUsed } = useStatsStore();

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      category: 'professional',
      description: 'Clean and contemporary design with bold headers and a professional look. Perfect for tech and startup roles.',
      color: '#2563eb',
      gradient: 'from-blue-500 to-blue-700',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Bold header design', 'Photo support', 'Skills visualization', 'ATS friendly'],
      popular: true
    },
    {
      id: 'classic',
      name: 'Classic',
      category: 'traditional',
      description: 'Traditional professional layout that works for all industries. Timeless design that never goes out of style.',
      color: '#374151',
      gradient: 'from-gray-700 to-gray-900',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Traditional layout', 'Photo support', 'Print optimized', 'Universal appeal'],
      popular: false
    },
    {
      id: 'creative',
      name: 'Creative',
      category: 'creative',
      description: 'Eye-catching two-column design perfect for creative professionals, designers, and artists.',
      color: '#9333ea',
      gradient: 'from-purple-500 via-pink-500 to-orange-400',
      hasPhoto: true,
      photoPosition: 'Sidebar top',
      layout: 'Two column',
      features: ['Sidebar layout', 'Large photo', 'Skill bars', 'Creative styling'],
      popular: true
    },
    {
      id: 'minimal',
      name: 'Minimal',
      category: 'modern',
      description: 'Simple and elegant minimalist design focusing purely on content. Less is more approach.',
      color: '#000000',
      gradient: 'from-gray-800 to-black',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Single column',
      features: ['Clean design', 'No photo', 'Content focused', 'Easy to read'],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      category: 'professional',
      description: 'Corporate-style template ideal for business, finance, and management roles.',
      color: '#0369a1',
      gradient: 'from-sky-600 to-sky-800',
      hasPhoto: true,
      photoPosition: 'Center header',
      layout: 'Single column',
      features: ['Corporate style', 'Centered photo', 'Structured layout', 'Business ready'],
      popular: false
    },
    {
      id: 'elegant',
      name: 'Elegant',
      category: 'creative',
      description: 'Sophisticated design with elegant typography and refined details for executive positions.',
      color: '#be123c',
      gradient: 'from-rose-600 to-rose-800',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Sophisticated style', 'Elegant fonts', 'Photo support', 'Premium feel'],
      popular: false
    },
    {
      id: 'executive',
      name: 'Executive',
      category: 'professional',
      description: 'Premium two-column layout designed for senior executives and leadership roles.',
      color: '#1e293b',
      gradient: 'from-slate-800 to-slate-900',
      hasPhoto: true,
      photoPosition: 'Header with sidebar',
      layout: 'Two column (right sidebar)',
      features: ['Executive style', 'Timeline layout', 'Right sidebar', 'Leadership focus'],
      popular: true
    },
    {
      id: 'tech',
      name: 'Tech',
      category: 'modern',
      description: 'Developer-friendly template with technical aesthetics. Perfect for software engineers and IT pros.',
      color: '#059669',
      gradient: 'from-emerald-500 to-teal-700',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Tech aesthetic', 'Code-like styling', 'Photo support', 'Developer focused'],
      popular: true
    },
    {
      id: 'academic',
      name: 'Academic',
      category: 'traditional',
      description: 'Formal template designed for academics, researchers, and educational professionals.',
      color: '#3730a3',
      gradient: 'from-indigo-800 to-indigo-900',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Academic format', 'Photo support', 'Publication ready', 'Research focused'],
      popular: false
    },
    {
      id: 'compact',
      name: 'Compact',
      category: 'modern',
      description: 'Space-efficient two-column design that fits more content. Great for experienced professionals.',
      color: '#4b5563',
      gradient: 'from-gray-600 to-gray-700',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Two column',
      features: ['Space efficient', 'No photo', 'Compact layout', 'Content dense'],
      popular: false
    },
    {
      id: 'developer',
      name: 'Developer',
      category: 'modern',
      description: 'Perfect for software developers and programmers. Dark theme with terminal-inspired aesthetics.',
      color: '#22c55e',
      gradient: 'from-gray-900 to-gray-700',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Dark theme', 'Code aesthetic', 'Green accents', 'Tech focused'],
      popular: true
    },
    {
      id: 'corporate',
      name: 'Corporate',
      category: 'professional',
      description: 'Business-focused template ideal for corporate environments and Fortune 500 companies.',
      color: '#1e3a5f',
      gradient: 'from-blue-900 to-blue-700',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Corporate style', 'Navy theme', 'Professional', 'Business ready'],
      popular: false
    },
    {
      id: 'designer',
      name: 'Designer',
      category: 'creative',
      description: 'Bold and colorful template perfect for graphic designers, UI/UX designers, and artists.',
      color: '#ec4899',
      gradient: 'from-pink-500 to-violet-600',
      hasPhoto: true,
      photoPosition: 'Sidebar top',
      layout: 'Two column',
      features: ['Bold colors', 'Creative layout', 'Visual appeal', 'Portfolio style'],
      popular: true
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      category: 'professional',
      description: 'Clean and trustworthy design for medical professionals, nurses, doctors, and healthcare workers.',
      color: '#0d9488',
      gradient: 'from-teal-600 to-cyan-600',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Medical style', 'Clean design', 'Trustworthy', 'Healthcare focused'],
      popular: false
    },
    {
      id: 'finance',
      name: 'Finance',
      category: 'professional',
      description: 'Sophisticated template for bankers, accountants, financial analysts, and investment professionals.',
      color: '#166534',
      gradient: 'from-green-800 to-green-600',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Finance focused', 'Green theme', 'Sophisticated', 'Trust building'],
      popular: false
    },
    {
      id: 'bold',
      name: 'Bold',
      category: 'creative',
      description: 'Eye-catching template with vibrant colors and bold design. Perfect for making a strong impression.',
      color: '#dc2626',
      gradient: 'from-red-600 to-orange-500',
      hasPhoto: true,
      photoPosition: 'Center header',
      layout: 'Single column',
      features: ['Bold design', 'Vibrant colors', 'Photo support', 'Stand out'],
      popular: true
    },
    {
      id: 'simple',
      name: 'Simple',
      category: 'modern',
      description: 'Ultra-minimal design with no distractions. Focus purely on your content and experience.',
      color: '#6b7280',
      gradient: 'from-gray-400 to-gray-600',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Single column',
      features: ['Ultra minimal', 'No photo', 'Clean lines', 'Content first'],
      popular: false
    },
    {
      id: 'vibrant',
      name: 'Vibrant',
      category: 'creative',
      description: 'Colorful two-column design that showcases your personality. Perfect for creative industries.',
      color: '#f59e0b',
      gradient: 'from-yellow-400 via-red-500 to-pink-500',
      hasPhoto: true,
      photoPosition: 'Sidebar top',
      layout: 'Two column',
      features: ['Colorful design', 'Sidebar layout', 'Photo support', 'Creative flair'],
      popular: true
    },
    {
      id: 'monochrome',
      name: 'Monochrome',
      category: 'modern',
      description: 'Sleek black and white design. Timeless elegance with maximum impact.',
      color: '#000000',
      gradient: 'from-black to-gray-900',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Single column',
      features: ['Black & white', 'No photo', 'Timeless', 'High contrast'],
      popular: false
    },
    {
      id: 'artistic',
      name: 'Artistic',
      category: 'creative',
      description: 'Gradient colors and artistic touches. Perfect for designers, artists, and creative professionals.',
      color: '#8b5cf6',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Artistic gradient', 'Photo support', 'Creative style', 'Visual appeal'],
      popular: true
    },
    {
      id: 'clean',
      name: 'Clean',
      category: 'modern',
      description: 'Fresh and clean two-column design with excellent readability. Professional yet modern.',
      color: '#3b82f6',
      gradient: 'from-blue-400 to-blue-600',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Two column (right sidebar)',
      features: ['Clean layout', 'No photo', 'Easy to read', 'Modern style'],
      popular: false
    },
    {
      id: 'manager',
      name: 'Manager',
      category: 'professional',
      description: 'Executive-level template for management and leadership positions. Authority and professionalism.',
      color: '#475569',
      gradient: 'from-slate-700 to-slate-900',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Executive style', 'Leadership focus', 'Photo support', 'Authority'],
      popular: false
    },
    {
      id: 'startup',
      name: 'Startup',
      category: 'modern',
      description: 'Dynamic template for startup enthusiasts and entrepreneurs. Modern and energetic design.',
      color: '#06b6d4',
      gradient: 'from-cyan-500 to-blue-600',
      hasPhoto: true,
      photoPosition: 'Sidebar top',
      layout: 'Two column',
      features: ['Startup vibe', 'Energetic', 'Photo support', 'Innovation focused'],
      popular: true
    },
    {
      id: 'lawyer',
      name: 'Lawyer',
      category: 'professional',
      description: 'Traditional and authoritative design for legal professionals. Trustworthy and formal.',
      color: '#92400e',
      gradient: 'from-amber-900 to-yellow-800',
      hasPhoto: true,
      photoPosition: 'Center header',
      layout: 'Single column',
      features: ['Legal style', 'Formal design', 'Photo support', 'Authority'],
      popular: false
    },
    {
      id: 'engineer',
      name: 'Engineer',
      category: 'modern',
      description: 'Technical template for engineers and technical professionals. Structure and precision.',
      color: '#ea580c',
      gradient: 'from-orange-600 to-red-600',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Technical style', 'Structured', 'Photo support', 'Engineering focus'],
      popular: true
    },
    {
      id: 'teacher',
      name: 'Teacher',
      category: 'traditional',
      description: 'Warm and approachable design for educators and training professionals. Educational excellence.',
      color: '#65a30d',
      gradient: 'from-lime-600 to-green-600',
      hasPhoto: true,
      photoPosition: 'Left side',
      layout: 'Single column',
      features: ['Educational style', 'Warm colors', 'Photo support', 'Approachable'],
      popular: false
    },
    {
      id: 'sales',
      name: 'Sales',
      category: 'creative',
      description: 'Dynamic and persuasive template for sales and marketing professionals. Results-oriented design.',
      color: '#c026d3',
      gradient: 'from-fuchsia-600 to-purple-600',
      hasPhoto: true,
      photoPosition: 'Sidebar top',
      layout: 'Two column',
      features: ['Dynamic design', 'Sales focused', 'Photo support', 'Persuasive'],
      popular: true
    },
    {
      id: 'scientist',
      name: 'Scientist',
      category: 'traditional',
      description: 'Academic and research-focused design for scientists and researchers. Scholarly excellence.',
      color: '#6d28d9',
      gradient: 'from-violet-700 to-purple-800',
      hasPhoto: true,
      photoPosition: 'Right side',
      layout: 'Single column',
      features: ['Research style', 'Academic', 'Photo support', 'Scientific'],
      popular: false
    },
    {
      id: 'consultant',
      name: 'Consultant',
      category: 'professional',
      description: 'Strategic and professional template for consultants and advisors. Expertise and trust.',
      color: '#075985',
      gradient: 'from-sky-800 to-blue-900',
      hasPhoto: false,
      photoPosition: 'None',
      layout: 'Two column (right sidebar)',
      features: ['Consultant style', 'Professional', 'No photo', 'Strategic focus'],
      popular: false
    },
    {
      id: 'analyst',
      name: 'Analyst',
      category: 'professional',
      description: 'Data-driven design for analysts and researchers. Clean, structured, and analytical.',
      color: '#44403c',
      gradient: 'from-neutral-800 to-stone-900',
      hasPhoto: true,
      photoPosition: 'Center header',
      layout: 'Single column',
      features: ['Analytical style', 'Data focused', 'Photo support', 'Structured'],
      popular: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: <BookOpen className="w-4 h-4" />, count: templates.length },
    { id: 'professional', name: 'Professional', icon: <Briefcase className="w-4 h-4" />, count: templates.filter(t => t.category === 'professional').length },
    { id: 'creative', name: 'Creative', icon: <Palette className="w-4 h-4" />, count: templates.filter(t => t.category === 'creative').length },
    { id: 'modern', name: 'Modern', icon: <Sparkles className="w-4 h-4" />, count: templates.filter(t => t.category === 'modern').length },
    { id: 'traditional', name: 'Traditional', icon: <ScrollText className="w-4 h-4" />, count: templates.filter(t => t.category === 'traditional').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const TemplatePreview = ({ template }) => {
    const isPhotoTemplate = template.hasPhoto;
    const isTwoColumn = template.layout.includes('Two column');

    return (
      <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden transform scale-[0.6] origin-top-left">
        {isTwoColumn ? (
          // Two column preview
          <div className="flex h-full">
            <div className="w-1/3 p-2" style={{ backgroundColor: template.color }}>
              {isPhotoTemplate && (
                <div className="w-8 h-8 rounded-full bg-white/30 mx-auto mb-2"></div>
              )}
              <div className="space-y-1">
                <div className="h-1.5 bg-white/40 rounded w-3/4 mx-auto"></div>
                <div className="h-1 bg-white/30 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="mt-3 space-y-1">
                <div className="h-1 bg-white/20 rounded"></div>
                <div className="h-1 bg-white/20 rounded w-3/4"></div>
              </div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-2 rounded w-3/4 mb-2" style={{ backgroundColor: template.color }}></div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-200 rounded"></div>
                <div className="h-1 bg-gray-200 rounded w-5/6"></div>
                <div className="h-1 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="h-1.5 rounded w-1/2 mt-3 mb-1" style={{ backgroundColor: template.color + '60' }}></div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-100 rounded"></div>
                <div className="h-1 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ) : (
          // Single column preview
          <div className="h-full">
            <div className="p-3 flex items-center gap-2" style={{ backgroundColor: template.color }}>
              {isPhotoTemplate && template.photoPosition.includes('Left') && (
                <div className="w-8 h-8 rounded-full bg-white/30 flex-shrink-0"></div>
              )}
              <div className="flex-1">
                <div className="h-2 bg-white/90 rounded w-3/4 mb-1"></div>
                <div className="h-1 bg-white/60 rounded w-1/2"></div>
              </div>
              {isPhotoTemplate && template.photoPosition.includes('Right') && (
                <div className="w-8 h-8 rounded-full bg-white/30 flex-shrink-0"></div>
              )}
              {isPhotoTemplate && template.photoPosition.includes('Center') && (
                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-10 rounded-full bg-white/30"></div>
              )}
            </div>
            <div className="p-2">
              <div className="h-1.5 rounded w-1/2 mb-2 border-l-2" style={{ borderColor: template.color, backgroundColor: template.color + '20' }}></div>
              <div className="space-y-1 mb-2">
                <div className="h-1 bg-gray-200 rounded"></div>
                <div className="h-1 bg-gray-200 rounded w-5/6"></div>
              </div>
              <div className="h-1.5 rounded w-1/3 mb-1 border-l-2" style={{ borderColor: template.color, backgroundColor: template.color + '20' }}></div>
              <div className="space-y-1">
                <div className="h-1 bg-gray-100 rounded"></div>
                <div className="h-1 bg-gray-100 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              30 Professional Templates
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your Perfect CV Template
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              From classic to creative, find the perfect template that matches your style. 
              All templates are free, ATS-friendly, and fully customizable. With photo and no-photo options.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="bg-white py-4 border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <LargeBannerAd />
        </div>
      </div>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className={`ml-2 text-xs ${
                  selectedCategory === category.id ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  ({category.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover group"
              >
                {/* Preview */}
                <div className={`h-56 bg-gradient-to-br ${template.gradient} relative overflow-hidden`}>
                  <TemplatePreview template={template} />
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {template.popular && (
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg inline-flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> POPULAR
                      </span>
                    )}
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-medium">
                      FREE
                    </span>
                  </div>

                  {/* Photo indicator */}
                  {template.hasPhoto && (
                    <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-700 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Photo
                    </div>
                  )}

                  {/* Quick Preview Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Link
                      to={`/cv-builder?template=${template.id}`}
                      onClick={() => trackTemplateUsed(template.id)}
                      className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Use Template →
                    </Link>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  {/* Layout Info */}
                  <div className="flex flex-wrap gap-2 mb-4 text-xs">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {template.layout}
                    </span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                      Photo: {template.photoPosition}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    to={`/cv-builder?template=${template.id}`}
                    onClick={() => trackTemplateUsed(template.id)}
                    className="block w-full py-3 text-center rounded-xl font-medium text-white transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ backgroundColor: template.color }}
                  >
                    Use This Template
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Native Ad */}
      <div className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <NativeBannerAd />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Templates?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Camera className="w-5 h-5" />, title: 'Photo Support', desc: 'Most templates support profile photos' },
              { icon: <Ruler className="w-5 h-5" />, title: 'Multiple Layouts', desc: 'Single & two-column options' },
              { icon: <Palette className="w-5 h-5" />, title: 'Customizable', desc: 'Change colors to match your style' },
              { icon: <CheckCircle className="w-5 h-5" />, title: 'ATS Friendly', desc: 'Optimized for applicant tracking' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your CV?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Choose any template and start building your professional CV in minutes. 
            It's completely free!
          </p>
          <Link
            to="/cv-builder"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Building Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CVTemplates;
