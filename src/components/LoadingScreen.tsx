'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Only show loading screen on main page
    if (pathname !== '/') {
      setIsLoading(false);
      return;
    }
    
    // Minimum loading time of 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900"
        >
          <style jsx global>{`
            .loader {
              width: 85px;
              height: 25px;
              --g1: conic-gradient(from 90deg at left 3px top 3px, #0000 90deg, #f97316 0);
              --g2: conic-gradient(from -90deg at bottom 3px right 3px, #0000 90deg, #9333ea 0);
              background: var(--g1), var(--g1), var(--g1), var(--g2), var(--g2), var(--g2);
              background-position: left, center, right;
              background-repeat: no-repeat;
              animation: l8 1s infinite;
            }
            
            @keyframes l8 {
              0%   { background-size: 25px 100%, 25px 100%, 25px 100%; }
              20%  { background-size: 25px 50%, 25px 100%, 25px 100%; }
              40%  { background-size: 25px 50%, 25px 50%, 25px 100%; }
              60%  { background-size: 25px 100%, 25px 50%, 25px 50%; }
              80%  { background-size: 25px 100%, 25px 100%, 25px 50%; }
              100% { background-size: 25px 100%, 25px 100%, 25px 100%; }
            }
          `}</style>
          <div className="loader" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;