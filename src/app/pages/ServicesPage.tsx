'use client'
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Header from '../../components/Header';
import Footer from '../pages/Footer';
import { Check, MessageCircle, PhoneCall, HeartHandshake } from 'lucide-react';

const ServicesPage = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const philosophyRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const isHeroInView = useInView(heroRef, { once: false, margin: "-100px" });
  const isServicesInView = useInView(servicesRef, { once: false, margin: "-100px" });
  const isPhilosophyInView = useInView(philosophyRef, { once: false, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: false, margin: "-100px" });

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

  const serviceTypes = [
    {
      icon: <HeartHandshake className="text-purple-600 dark:text-orange-400" size={48} />,
      title: "Couples Counseling",
      description: "Comprehensive therapy to strengthen relationship bonds, resolve conflicts, and rebuild communication.",
      features: [
        "Individual and joint sessions",
        "Conflict resolution strategies",
        "Emotional reconnection techniques"
      ]
    },
    {
      icon: <MessageCircle className="text-purple-600 dark:text-orange-400" size={48} />,
      title: "Online Chat Counseling",
      description: "Convenient text-based counseling for couples seeking flexible support from home.",
      features: [
        "Secure, anonymous messaging",
        "Immediate counselor response",
        "Flexible communication timing"
      ]
    },
    {
      icon: <PhoneCall className="text-purple-600 dark:text-orange-400" size={48} />,
      title: "Phone Counseling",
      description: "Voice-based counseling for those preferring audio communication.",
      features: [
        "Confidential phone sessions",
        "Recorded and transcribed calls",
        "Flexible scheduling"
      ]
    }
  ];

  const counselingApproaches = [
    {
      title: "Personalized Therapy",
      description: "Tailored counseling strategies unique to each relationship's dynamics."
    },
    {
      title: "Evidence-Based Techniques",
      description: "Utilizing proven psychological methods to support relationship growth."
    },
    {
      title: "Holistic Relationship Care",
      description: "Addressing emotional, communication, and interpersonal challenges."
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
  {/* Background Image Container */}
  <div className="absolute inset-0">
    <motion.img
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.8 }}
      transition={{ duration: 0.8 }}
      src="/about.webp"
      alt="Counseling services background"
      className="object-cover w-full h-full dark:opacity-30"
    />
    <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/70 shadow-inner" />
  </div>

  <motion.div 
    initial="hidden"
    animate={isHeroInView ? "visible" : "hidden"}
    variants={fadeInUpVariants}
    transition={{ duration: 0.8 }}
    className="relative z-10 max-w-6xl mx-auto px-4 md:px-8"
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
        Our Counseling Services
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-base md:text-xl text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
      >
        Comprehensive, compassionate support designed to help couples navigate challenges and rebuild stronger connections.
      </motion.p>
    </motion.div>
  </motion.div>
</motion.div>

      {/* Animated Service Types Section */}
      <motion.div 
        ref={servicesRef}
        className="py-10 md:py-16 bg-gray-50 dark:bg-gray-800"
        initial="hidden"
        animate={isServicesInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.h2 
            variants={fadeInUpVariants}
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
          >
            Service Offerings
          </motion.h2>
          <motion.div 
  variants={staggerChildren}
  className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
>
  {serviceTypes.map((service, index) => (
    <motion.div
      key={index}
      variants={fadeInUpVariants}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full" // Added to ensure full height
    >
      <Card className="p-6 md:p-8 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 h-full flex flex-col">
        <div className="mb-4">
          {service.icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
          {service.title}
        </h3>
        <p className="text-sm md:text-base mb-4 text-gray-600 dark:text-gray-300 flex-grow">
          {service.description}
        </p>
        <motion.div variants={staggerChildren}>
          {service.features.map((feature, featureIndex) => (
            <motion.div 
              key={featureIndex}
              variants={fadeInUpVariants}
              className="flex items-center gap-2 mb-2 text-gray-700 dark:text-gray-400"
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Check size={16} className="text-purple-600 dark:text-orange-400" />
              </motion.div>
              <span className="text-xs md:text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  ))}
</motion.div>
        </div>
      </motion.div>

      {/* Animated Philosophy Section */}
      <motion.div 
        ref={philosophyRef}
        className="py-10 md:py-16"
        initial="hidden"
        animate={isPhilosophyInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.h2 
            variants={fadeInUpVariants}
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
          >
            Our Counseling Philosophy
          </motion.h2>
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          >
            {counselingApproaches.map((approach, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 md:p-8 text-center bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
                    {approach.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {approach.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Animated CTA Section */}
      <motion.div 
        ref={ctaRef}
        className="py-16 text-center bg-gray-50 dark:bg-gray-800"
        initial="hidden"
        animate={isCtaInView ? "visible" : "hidden"}
        variants={fadeInUpVariants}
      >
        <motion.div 
          className="max-w-4xl mx-auto px-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.h2 
            variants={fadeInUpVariants}
            className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
          >
            Ready to Strengthen Your Relationship?
          </motion.h2>
          <motion.p 
            variants={fadeInUpVariants}
            className="text-base md:text-xl mb-8 text-gray-600 dark:text-gray-300"
          >
            Take the first step towards a healthier, more connected relationship.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-all duration-300 bg-purple-600 dark:bg-orange-500 text-white hover:bg-purple-700 dark:hover:bg-orange-600 shadow-lg"
          >
            Book a Consultation
          </motion.button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default ServicesPage;