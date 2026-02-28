import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingSteps = [
    'Initializing',
    'Loading templates',
    'Setting up workspace',
    'Almost ready'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Faster progress - complete in ~500ms
        const newProgress = prev + Math.random() * 30 + 20;
        
        // Update loading text based on progress
        if (newProgress < 25) setLoadingText(loadingSteps[0]);
        else if (newProgress < 50) setLoadingText(loadingSteps[1]);
        else if (newProgress < 75) setLoadingText(loadingSteps[2]);
        else setLoadingText(loadingSteps[3]);
        
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -200 - 100],
              opacity: [0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div 
        className="text-center relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo with glow effect */}
        <motion.div 
          className="mb-8 relative"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="absolute inset-0 blur-xl bg-white/30 rounded-full scale-150"></div>
          <motion.div
            className="relative w-24 h-24 mx-auto bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-2xl"
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <FileText className="w-14 h-14 text-white" />
          </motion.div>
        </motion.div>
        
        {/* Brand name with shimmer effect */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
            Ezy CV
          </span>
        </motion.h1>
        
        {/* Loading text with typewriter effect */}
        <motion.p 
          className="text-blue-100 mb-8 h-6 flex items-center justify-center gap-2"
          key={loadingText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {loadingText}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.p>
        
        {/* Progress bar with glow */}
        <div className="w-72 mx-auto">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-white via-blue-200 to-white rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shimmer effect on progress bar */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <motion.p 
            className="text-white/60 text-sm mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}% complete
          </motion.p>
        </div>

        {/* Floating dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white/40 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.4, 1, 0.4]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                delay: i * 0.15
              }}
            />
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default LoadingScreen;
