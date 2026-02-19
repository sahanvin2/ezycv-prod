import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ezycv_support_popup_seen';
const VISITOR_DELAY_MS = 18000;

export const triggerSupportPopup = () => {
  if (localStorage.getItem(STORAGE_KEY)) return;
  window.dispatchEvent(new CustomEvent('showSupportPopup'));
};

const Petal = ({ style }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-pink-400/40 pointer-events-none"
    style={{ left: style.left, bottom: style.bottom }}
    initial={{ opacity: 0, y: 0, scale: 0 }}
    animate={{ opacity: [0, 0.7, 0], y: -80, scale: [0, 1, 0.4] }}
    transition={style.transition}
  />
);

const PETALS = [
  { left: '10%', bottom: '6%',  transition: { duration: 3.6, repeat: Infinity, delay: 0 } },
  { left: '28%', bottom: '4%',  transition: { duration: 4.3, repeat: Infinity, delay: 0.8 } },
  { left: '50%', bottom: '10%', transition: { duration: 3.9, repeat: Infinity, delay: 1.5 } },
  { left: '70%', bottom: '5%',  transition: { duration: 4.1, repeat: Infinity, delay: 0.4 } },
  { left: '86%', bottom: '8%',  transition: { duration: 3.7, repeat: Infinity, delay: 2.0 } },
];

const SupportPopup = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const visitorTimer = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, VISITOR_DELAY_MS);
    const onTrigger = () => {
      clearTimeout(visitorTimer);
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    };
    window.addEventListener('showSupportPopup', onTrigger);
    return () => {
      clearTimeout(visitorTimer);
      window.removeEventListener('showSupportPopup', onTrigger);
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const goSupport = () => {
    dismiss();
    navigate('/support-us');
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[999] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            onClick={dismiss}
          />
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="card"
              className="relative bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl shadow-2xl border border-white/10 max-w-sm w-full p-8 text-center pointer-events-auto overflow-hidden"
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-52 h-52 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-44 h-44 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {PETALS.map((p, i) => (<Petal key={i} style={p} />))}
              </div>
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <motion.div
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-5 inline-block relative z-10 select-none"
              >
                
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-3 relative z-10 leading-snug">
                Ezy CV is 100% free.
                <br />
                <span className="text-base font-normal text-purple-300">Help us keep it that way.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-7 relative z-10">
                Built and maintained by one person, with love. No investors, no subscription fees  ever.
                If EzyCV helped you, even a small contribution keeps the servers running for the next person. 
              </p>
              <div className="flex flex-col gap-2.5 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goSupport}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-md shadow-purple-500/20 text-sm hover:shadow-purple-500/40 transition-all"
                >
                   Support Ezy CV
                </motion.button>
                <button
                  onClick={dismiss}
                  className="w-full py-2 text-gray-600 hover:text-gray-400 text-xs transition-colors"
                >
                  Maybe later
                </button>
              </div>
              <p className="text-xs text-gray-700 mt-5 relative z-10">Shown only once  We will never spam </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportPopup;