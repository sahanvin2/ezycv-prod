import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FileText, LayoutTemplate, Lightbulb, Image, Camera, Smartphone, Monitor, Users, Mail, Heart, Shield, ScrollText, BookOpen, CheckCircle } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
      const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      
      toast.success(response.data.message || 'Thanks for subscribing! Check your email 🎉', {
        duration: 5000,
        icon: '💜'
      });
      
      setEmail(''); // Clear the input
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const footerLinks = {
    'CV Builder': [
      { name: 'Create CV', href: '/cv-builder', icon: <FileText className="w-4 h-4" /> },
      { name: 'CV Templates', href: '/cv-templates', icon: <LayoutTemplate className="w-4 h-4" /> },
      { name: 'Resume Tips', href: '/blog', icon: <Lightbulb className="w-4 h-4" /> },
    ],
    'Resources': [
      { name: 'Wallpapers', href: '/wallpapers', icon: <Image className="w-4 h-4" /> },
      { name: 'Stock Photos', href: '/stock-photos', icon: <Camera className="w-4 h-4" /> },
      { name: 'Mobile Wallpapers', href: '/wallpapers?device=mobile', icon: <Smartphone className="w-4 h-4" /> },
      { name: 'Desktop Wallpapers', href: '/wallpapers?device=desktop', icon: <Monitor className="w-4 h-4" /> },
    ],
    'Company': [
      { name: 'About Us', href: '/about', icon: <Users className="w-4 h-4" /> },
      { name: 'Contact', href: '/contact', icon: <Mail className="w-4 h-4" /> },
      { name: 'Support Us', href: '/support-us', icon: <Heart className="w-4 h-4" /> },
      { name: 'Privacy Policy', href: '/privacy', icon: <Shield className="w-4 h-4" /> },
      { name: 'Terms of Service', href: '/terms', icon: <ScrollText className="w-4 h-4" /> },
      { name: 'Blog', href: '/blog', icon: <BookOpen className="w-4 h-4" /> },
    ],
  };

  const socialLinks = [
    { 
      name: 'X (Twitter)', 
      href: 'https://x.com/EzyCv',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      hoverBg: 'hover:bg-black'
    },
    { 
      name: 'LinkedIn', 
      href: 'https://www.linkedin.com/in/sahan-nawarathne-210b562ab/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      hoverBg: 'hover:bg-blue-600'
    },
    { 
      name: 'YouTube', 
      href: 'https://youtube.com/@ezycv?si=TMds24KnShZDsk0V',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      hoverBg: 'hover:bg-red-600'
    },
    { 
      name: 'Facebook', 
      href: 'https://www.facebook.com/profile.php?id=61587351227027',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      hoverBg: 'hover:bg-blue-500'
    },
    { 
      name: 'Reddit', 
      href: 'https://www.reddit.com/r/EzyCV/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      ),
      hoverBg: 'hover:bg-orange-600'
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-slate-900 text-gray-300 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-16 pb-8 relative z-10">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 md:p-8 mb-10 md:mb-12 border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Stay Updated! 🚀</h3>
              <p className="text-gray-400 text-sm md:text-base">Get the latest CV tips and new templates delivered to your inbox.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={loading}
                className="flex-1 md:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <FileText className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Ezy CV
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Create professional CVs for free with our easy-to-use builder.
              Join 100+ professionals who landed their dream jobs with us! 🎯
            </p>
            {/* Ad-free badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              100% Free · Zero Ads · No Subscriptions
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a 
                  key={social.name}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center ${social.hoverBg} transition-all duration-300 border border-white/10`}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <motion.div 
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-bold mb-5 text-lg">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-300 text-sm group"
                    >
                      <span className="opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">{link.icon}</span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <motion.span 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>© {currentYear} Ezy CV. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4">
              Terms
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-white text-sm transition-all duration-300 hover:underline underline-offset-4">
              Cookies
            </Link>
            <Link to="/support-us" className="text-pink-400 hover:text-pink-300 text-sm font-medium transition-all duration-300 hover:underline underline-offset-4">
              ❤️ Support Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
