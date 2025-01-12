'use client'
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '../pages/Footer';

const AboutPage = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const isHeroInView = useInView(heroRef, { once: false, margin: "-100px" });
  const isMissionInView = useInView(missionRef, { once: false, margin: "-100px" });
  const isValuesInView = useInView(valuesRef, { once: false, margin: "-100px" });

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
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-4 md:px-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 shadow-2xl"
          >
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-6 mt-6 md:mt-10 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              About MiCounselor
            </motion.h1>
            <motion.p 
              className="text-base md:text-xl text-center max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We're dedicated to helping couples build stronger, more meaningful relationships through expert counseling and innovative approaches to therapy.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Mission Statement */}
      <motion.div 
        ref={missionRef}
        className="py-10 md:py-16 bg-gray-50 dark:bg-gray-800"
        initial="hidden"
        animate={isMissionInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.div 
            className="p-6 md:p-12 rounded-3xl shadow-xl bg-white dark:bg-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h2 
              variants={fadeInUpVariants}
              className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Our Mission
            </motion.h2>
            <motion.p 
              variants={fadeInUpVariants}
              className="text-base md:text-lg leading-relaxed mb-6 md:mb-8 text-gray-600 dark:text-gray-300"
            >
              At MiCounselor, we believe every relationship deserves a chance to thrive. Our mission is to provide accessible, professional counseling services that help couples navigate challenges, strengthen their bonds, and build lasting connections.
            </motion.p>
            <motion.div 
              variants={staggerChildren}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            >
              {[
                {
                  icon: "🎯",
                  title: "Expert Guidance",
                  description: "Professional counselors with extensive experience in relationship therapy"
                },
                {
                  icon: "🤝",
                  title: "Personalized Care",
                  description: "Tailored approaches that address your unique relationship dynamics"
                },
                {
                  icon: "🔒",
                  title: "Complete Privacy",
                  description: "Secure, confidential environment for open communication"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUpVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-lg"
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Values Section */}
      <motion.div 
        ref={valuesRef}
        className="py-10 md:py-16 bg-gray-50 dark:bg-gray-800"
        initial="hidden"
        animate={isValuesInView ? "visible" : "hidden"}
        variants={staggerChildren}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <motion.h2 
            variants={fadeInUpVariants}
            className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
          >
            Our Core Values
          </motion.h2>
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
          >
            {[
              {
                title: "Empathy & Understanding",
                description: "We approach every relationship with compassion and deep understanding of unique challenges."
              },
              {
                title: "Professional Excellence",
                description: "Our counselors maintain the highest standards of professional practice and continuous learning."
              },
              {
                title: "Innovation in Therapy",
                description: "We embrace modern approaches while maintaining proven counseling techniques."
              },
              {
                title: "Accessible Support",
                description: "Making professional relationship counseling available to all who seek it."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUpVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 30px rgba(0,0,0,0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 md:p-8 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 overflow-hidden">
                  <motion.h3 
                    className="text-lg md:text-xl font-semibold mb-3 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    {value.title}
                  </motion.h3>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
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

export default AboutPage;