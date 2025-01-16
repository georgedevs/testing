import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';

const AfterTestimonial = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  const handleBookingClick = () => {
    window.open('/MicounselorGuide.pdf', '_blank');
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      <section className="text-center py-16 px-8 bg-gray-50 dark:bg-gray-800">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
          >
            Book Instantly Online Now
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg mb-8 text-gray-700 dark:text-gray-300"
          >
            Use our easy & fast online booking tool to connect with one of our highly trained therapists.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <motion.a 
              href="/signin"
              initial={{ scale: 0.9 }}
              animate={isInView ? { scale: 1 } : { scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-all duration-300 bg-purple-600 dark:bg-orange-500 text-white hover:bg-purple-700 dark:hover:bg-orange-600 hover:shadow-lg space-x-2"
            >
              <span>Book Instantly Online Now</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col items-center space-y-4"
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Book online in less than no time! Need help?
              </motion.p>
              
              <motion.button
                onClick={handleBookingClick}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="inline-flex items-center space-x-2 text-purple-600 dark:text-orange-400 hover:text-purple-700 dark:hover:text-orange-500"
              >
                <Download className="w-4 h-4" />
                <span className="underline">
                  Click Here for "How To Book" Step by Step Guide
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default AfterTestimonial;