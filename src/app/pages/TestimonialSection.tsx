import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const testimonials = [
    {
      quote: "We knew we needed to separate but wanted to do so amicably for the sake of our two children. Sabine made this possible by offering us the support through a very difficult time.",
      name: "Tracey B.",
      profession: "Parent"
    },
    {
      quote: "Our relationship was falling apart, but the counselors helped us rediscover our connection and communication.",
      name: "Michael S.",
      profession: "Professional"
    },
    {
      quote: "I never thought online therapy could be this effective. It's been a transformative experience for our marriage.",
      name: "Elena R.",
      profession: "Entrepreneur"
    }
  ];

  const navigateTestimonial = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentTestimonial((prev) => 
      (prev + newDirection + testimonials.length) % testimonials.length
    );
  };

  // Animated Counter Component
  const Counter = ({ end, duration = 2, label }: { end: number; duration?: number; label: string }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    
    useEffect(() => {
      if (isInView) {
        let startTime: number | null = null;
        let animationFrame: number | null = null;
        
        const animation = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
          
          setCount(Math.floor(progress * end));
          
          if (progress < 1) {
            animationFrame = requestAnimationFrame(animation);
          }
        };
        
        animationFrame = requestAnimationFrame(animation);
        
        return () => {
          if (animationFrame) {
            cancelAnimationFrame(animationFrame);
          }
        };
      }
    }, [end, duration, isInView]);

    const formattedCount = end >= 1000 ? 
      `${Math.floor(count / 1000)}${count >= 1000 ? ',' : ''}${count % 1000 || '000'}` : 
      count;

    return (
      <Card 
        ref={ref}
        className="p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-800"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
        >
          {formattedCount}+
        </motion.div>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
          {label}
        </p>
      </Card>
    );
  };

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="py-12 md:py-24 px-4 md:px-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2 
            className="text-base md:text-xl uppercase tracking-wider mb-2 md:mb-4 text-gray-600 dark:text-gray-300"
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            OUR SERVICES ARE
          </motion.h2>
          <motion.h3 
            className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Highly Rated
          </motion.h3>
          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
              4.9 / 5 STARS
            </span>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="text-yellow-400"
                >
                  ★
                </motion.span>
              ))}
            </div>
            <span className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
              - 1074 REVIEWS
            </span>
          </motion.div>
        </motion.div>

        <div className="relative w-full max-w-4xl mx-auto mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <Card className="w-full p-6 md:p-12 rounded-2xl shadow-xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <motion.blockquote 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl md:text-2xl italic text-center mb-6 md:mb-8 leading-relaxed text-gray-700 dark:text-gray-300"
                >
                  "{testimonials[currentTestimonial].quote}"
                </motion.blockquote>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-xs md:text-sm mt-1 md:mt-2 text-gray-500 dark:text-gray-400">
                    {testimonials[currentTestimonial].profession}
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTestimonial(-1)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/20 dark:bg-orange-500/20 text-purple-600 dark:text-orange-300"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateTestimonial(1)}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/20 dark:bg-orange-500/20 text-purple-600 dark:text-orange-300"
            >
              →
            </motion.button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <Counter end={5000} duration={2.5} label="Online Sessions" />
          <Counter end={25} duration={1.5} label="Experienced Therapists" />
          <Counter end={1000} duration={2} label="5 ★ Reviews" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialSection;