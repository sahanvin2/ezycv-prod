import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show popup after a short delay for better UX
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleDecline}
          />

          {/* MOBILE VERSION - Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.8, x: '-50%', y: '-50%' }}
            transition={{ type: "spring", duration: 0.4 }}
            style={{ left: '50%', top: '50%' }}
            className="md:hidden fixed w-[85%] max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[85vh] overflow-y-auto"
          >
            {/* Gradient top border */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-5">
              {/* Icon */}
              <div className="flex flex-col items-center gap-3">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </motion.div>

                <div className="text-center w-full">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    🍪 We Value Your Privacy
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                    By clicking <span className="font-semibold text-blue-600">"Accept"</span>, you consent to our use of cookies.
                  </p>

                  {/* Learn more link */}
                  <a 
                    href="/cookie-policy" 
                    className="inline-flex items-center justify-center text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Learn more about Cookie Policy
                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAccept}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Accept All Cookies
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDecline}
                  className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Decline
                </motion.button>
              </div>

              {/* Essential cookies note */}
              <p className="text-[9px] text-gray-500 mt-2 text-center leading-tight">
                Essential cookies are always enabled.
              </p>
            </div>
          </motion.div>

          {/* DESKTOP VERSION - Centered Modal Card (matching screenshot design) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.85, x: '-50%', y: '-50%' }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            style={{ left: '50%', top: '50%' }}
            className="hidden md:block fixed w-[580px] max-w-[90vw] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-8 pb-6">
              {/* Header row: Settings icon + Cookie emoji & title */}
              <div className="flex items-start gap-5 mb-5">
                {/* Settings/Gear icon */}
                <motion.div
                  initial={{ rotate: -45, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                  className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200"
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.div>

                {/* Title & description */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">🍪</span> We Value Your Privacy
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, analyze site traffic, and provide personalized content. 
                    By clicking <span className="font-semibold text-blue-600">"Accept"</span>, you consent to our use of cookies.
                  </p>
                </div>
              </div>

              {/* Cookie Policy link */}
              <a 
                href="/cookie-policy" 
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group mb-6"
              >
                Learn more about our Cookie Policy
                <svg 
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>

              {/* Buttons row */}
              <div className="flex gap-3 mt-2">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(124, 58, 237, 0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAccept}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg shadow-purple-200"
                >
                  Accept All Cookies
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  Decline
                </motion.button>
              </div>

              {/* Essential cookies note */}
              <p className="text-xs text-gray-400 mt-4 text-center">
                Note: Essential cookies are always enabled to ensure the site functions properly.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
