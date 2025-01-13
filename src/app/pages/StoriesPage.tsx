'use client'
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '../pages/Footer';
import { Star, Quote, Heart } from 'lucide-react';

const StoriesPage = () => {
  // Refs for scroll animations
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const storiesRef = useRef(null);

  // Scroll progress animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Viewport detection
  const isHeroInView = useInView(heroRef, { once: false, margin: "-100px" });
  const isStoriesInView = useInView(storiesRef, { once: false, margin: "-100px" });

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Mock success stories data
  const successStories = [
    {
      id: 1,
      title: "Finding Our Way Back",
      category: "Communication",
      duration: "6 months of counseling",
      story: "After 15 years of marriage, we had stopped truly communicating. Through counseling, we learned to listen and understand each other again. The anonymous format helped us be more honest about our feelings.",
      outcome: "We now have weekly check-ins and feel more connected than ever.",
      rating: 5
    },
    {
      id: 2,
      title: "Healing After Trust Issues",
      category: "Trust Building",
      duration: "8 months of counseling",
      story: "Trust issues were tearing us apart. Our counselor helped us address the root causes and develop new patterns of transparency. The privacy of online sessions made it easier to open up.",
      outcome: "We've rebuilt our foundation of trust and feel secure in our relationship.",
      rating: 5
    },
    {
      id: 3,
      title: "Reconnecting Through Distance",
      category: "Long-distance Relationship",
      duration: "4 months of counseling",
      story: "Career changes forced us into a long-distance relationship. We struggled with maintaining intimacy and connection. Online counseling helped us develop strategies to stay close despite the miles.",
      outcome: "We're stronger now and have tools to maintain our bond across any distance.",
      rating: 5
    },
    {
      id: 4,
      title: "Growing Through Conflict",
      category: "Conflict Resolution",
      duration: "3 months of counseling",
      story: "Every disagreement turned into a major fight. We learned healthy conflict resolution strategies and how to express our needs without attacking each other. The anonymous format removed our fear of judgment.",
      outcome: "We now view conflicts as opportunities for growth rather than threats.",
      rating: 5
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      <Header />
      
      {/* Animated Hero Section */}
      <motion.div 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative pt-16 pb-10 md:pt-24 md:pb-16"
      >
        <motion.div 
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          variants={fadeInUpVariants}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-4 md:px-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-2xl"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-6 mt-6 md:mt-10 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Success Stories
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base md:text-xl text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
            >
              Real stories from couples who found their way back to connection and understanding through counseling.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Stories Section */}
      <motion.div 
        ref={storiesRef}
        className="py-10 md:py-16 bg-gray-50 dark:bg-gray-800"
        initial="hidden"
        animate={isStoriesInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {successStories.map((story) => (
              <motion.div
                key={story.id}
                variants={fadeInUpVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
                        {story.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {story.category} • {story.duration}
                      </p>
                    </div>
                    <div className="flex">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Quote className="w-6 h-6 text-purple-600 dark:text-orange-400 flex-shrink-0" />
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                        {story.story}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Heart className="w-6 h-6 text-purple-600 dark:text-orange-400 flex-shrink-0" />
                      <p className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                        {story.outcome}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default StoriesPage;