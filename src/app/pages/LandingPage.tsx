import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import { useSelector } from 'react-redux';
import { useLoadUserQuery } from '@/redux/feautures/api/apiSlice';
import { useAuth } from '../hooks/useAuth';
import { Handshake, Lock, MessageCircle, MessageSquare, Star } from 'lucide-react';

const LandingPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const { isLoading } = useLoadUserQuery();
  const { isAuthenticated, redirectToUserDashboard } = useAuth();

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const featuresRef = useRef(null);
  const isFeaturesSectionInView = useInView(featuresRef, { 
    once: false,
    margin: "-100px"
  });

  const handleGetStarted = () => {
    if (isAuthenticated) {
      redirectToUserDashboard();
    } else {
      router.push('/signup');
    }
  };

  const handleAboutInfo = () => {
    router.push('/about');
  };


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white relative w-full">
      <Header />

      {/* Animated Hero Section */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.8 }}
            src="/hero.jpg"
            alt="Couple connection"
            className="object-cover w-full h-full dark:opacity-30"
          />
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/70 shadow-inner" />
        </div>
        
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 w-full max-w-4xl px-4 md:px-8"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-6 md:p-12 rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4 md:mb-6 text-3xl md:text-6xl pb-2 font-bold text-center bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent leading-tight whitespace-nowrap sm:whitespace-normal"
              >
                <span className="block sm:inline">Healing Connections,</span>{" "}
                <span className="block sm:inline">Rebuilding Bonds</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-xl text-center mb-6 md:mb-8 text-gray-700 dark:text-gray-300"
            >
              Personalized counseling for couples seeking understanding and growth
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className="px-6 py-3 rounded-full text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto bg-purple-600 dark:bg-orange-500 text-white hover:bg-purple-700 dark:hover:bg-orange-600 hover:shadow-lg"
              >
                Book Consultation
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAboutInfo}
              className="px-6 py-3 rounded-full text-sm uppercase tracking-wider border-2 transition-all duration-300 w-full sm:w-auto border-purple-600 dark:border-orange-500 text-purple-600 dark:text-orange-500 hover:bg-purple-600 dark:hover:bg-orange-500 hover:text-white dark:hover:text-white hover:shadow-lg"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Features Section */}
      <div 
        ref={featuresRef}
        className="px-4 md:px-16 py-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isFeaturesSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
        >
          Why Choose MiCounselor?
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {[
  {
    icon: <Star className="w-8 h-8 text-purple-600 dark:text-orange-400" />,
    title: 'Expert Counselors',
    description: 'Highly trained professionals dedicated to your relationship\'s success.'
  },
  {
    icon: <Handshake className="w-8 h-8 text-purple-600 dark:text-orange-400" />,
    title: 'Personalized Approach',
    description: 'Tailored strategies that address your unique relationship dynamics.'
  },
  {
    icon: <Lock className="w-8 h-8 text-purple-600 dark:text-orange-400" />,
    title: 'Confidential & Safe',
    description: 'Completely anonymous and secure communication platform.'
  },
  {
    icon: <MessageCircle className="w-8 h-8 text-purple-600 dark:text-orange-400" />,
    title: 'Multiple Communication Options',
    description: 'Chat, video, and voice sessions to suit your comfort level.'
  }
].map((feature, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, y: 20 }}
    animate={isFeaturesSectionInView 
      ? { opacity: 1, y: 0 } 
      : { opacity: 0, y: 20 }
    }
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
  >
    <Card 
      className="p-6 md:p-8 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
    >
<div>
        {feature.icon}
        </div>
      <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
        {feature.title}
      </h3>
      <p className="text-sm md:text-base text-gray-700 dark:text-gray-300">
        {feature.description}
      </p>
    </Card>
  </motion.div>
))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;