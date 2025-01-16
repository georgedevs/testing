import React, { useState, useEffect, type PropsWithChildren } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineStatusHandlerProps {}

const OfflineStatusHandler: React.FC<PropsWithChildren<OfflineStatusHandlerProps>> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOffline) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-6 inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full"
          >
            <WifiOff className="w-8 h-8 text-red-600 dark:text-red-400" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            You're Offline
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Please check your internet connection and try again
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 rounded-xl bg-purple-600 dark:bg-orange-500 text-white font-medium hover:bg-purple-700 dark:hover:bg-orange-600 transition-colors duration-200"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {children}
      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Wifi className="w-4 h-4" />
            <span>Back online!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfflineStatusHandler;