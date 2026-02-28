import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Settings, CheckCircle } from 'lucide-react';

const Maintenance = () => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set your estimated return time here
  const returnTime = new Date();
  returnTime.setHours(returnTime.getHours() + 2); // 2 hours from now

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = returnTime.getTime() - now;

      if (distance > 0) {
        setCountdown({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-2xl shadow-xl mb-6">
              <FileText className="w-16 h-16 text-blue-600" />
            </div>
          </motion.div>

          {/* Main Icon */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
          >
            <Settings className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            We're Under Maintenance
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            We're making <span className="font-bold">Ezy CV</span> even better! Our site is currently undergoing scheduled maintenance to improve your experience.
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-10"
          >
            <p className="text-white/80 text-sm uppercase tracking-wider mb-4 font-semibold">
              Estimated Return Time
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-white/30">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {String(countdown.hours).padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase mt-1">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-white/30">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {String(countdown.minutes).padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase mt-1">Minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[80px] border border-white/30">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {String(countdown.seconds).padStart(2, '0')}
                </div>
                <div className="text-xs text-white/70 uppercase mt-1">Seconds</div>
              </div>
            </div>
          </motion.div>

          {/* Features List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
          >
            <h3 className="text-white font-semibold text-lg mb-4">What we're working on:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">Performance improvements</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">New CV templates</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">Enhanced user experience</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                <span className="text-white/90">Security updates</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <p className="text-white/80 text-sm">
              Stay connected with us:
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors border border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 pt-8 border-t border-white/20"
          >
            <p className="text-white/70 text-sm">
              For urgent matters, contact us at{' '}
              <a href="mailto:support@ezycv.com" className="text-white font-semibold hover:underline">
                support@ezycv.com
              </a>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-white/60 text-sm"
        >
          © 2026 Ezy CV. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default Maintenance;
