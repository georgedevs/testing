import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, BookOpen, ArrowRight, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PDFGuideSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleDownloadClick = (e:any)=> {
    e.stopPropagation();
    window.open('/MicounselorGuide.pdf', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer group"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-orange-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Getting Started Guide
                </h3>
              </div>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-500 dark:text-gray-400"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
            
            {!isExpanded && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Click to view our comprehensive guide for account setup and privacy protection.
              </p>
            )}
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Download our comprehensive guide to learn about:
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {['Account setup tips', 'Privacy protection', 'Booking sessions', 'Communication tools'].map((item, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                        >
                          <ArrowRight className="w-4 h-4 text-purple-500 dark:text-orange-400" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <motion.button
                      onClick={handleDownloadClick}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 dark:bg-orange-500 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-orange-600 transition-colors duration-300"
                    >
                      <Download className="w-5 h-5" />
                      Download Guide (PDF)
                    </motion.button>
                    
                    <p className="mt-4 text-sm text-center text-gray-500 dark:text-gray-400">
                      Quick read - Less than 3 minutes
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PDFGuideSection;