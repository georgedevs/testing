import React, { useState, useRef } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 300
      }
    }
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Stories', path: '/stories' },
    { name: 'Resources', path: '/resources/stuck-relationships' },
    { name: 'Services', path: '/services' }
  ];
  
  const phoneNumber = "2348032035563";

  return (
    <motion.footer
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-16 transition-colors duration-300"
    >
      <div className="container mx-auto px-8 max-w-7xl">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Logo and About Us */}
          <motion.div 
            variants={childVariants}
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              MiCounselor
            </motion.div>
            <motion.p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              We are an experienced team of professional relationship counselors 
              providing online support throughout Nigeria. Our mission is to help 
              couples gain understanding, communicate effectively, and rebuild 
              their connections from the comfort of their home.
            </motion.p>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            variants={childVariants}
            initial={{ y: 50, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              whileHover={{ scale: 1.02 }}
              className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Quick Links
            </motion.h2>
            <div className="grid grid-cols-2 gap-4">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                  className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors duration-300"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div 
            variants={childVariants}
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.h2
              whileHover={{ scale: 1.02 }}
              className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Get In Touch
            </motion.h2>
            <div className="space-y-4">
              <motion.a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 10 }}
                className="flex items-center space-x-4 text-gray-700 dark:text-gray-300 group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-600 group-hover:bg-green-500/30 transition-colors duration-300">
                  <MessageCircle size={20} />
                </span>
                <span className="group-hover:text-green-500 transition-colors duration-300">
                  +234 803 203 5563
                </span>
              </motion.a>
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-center space-x-4 text-gray-700 dark:text-gray-300"
              >
                <span className="text-xl">📧</span>
                <span>support@micounselor.com</span>
              </motion.div>
              <div className="flex space-x-4 mt-4">
                {['facebook', 'instagram'].map((platform) => (
                  <motion.a
                    key={platform}
                    href="#"
                    variants={socialIconVariants}
                    whileHover="hover"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30 transition-all duration-300"
                  >
                    {platform === 'facebook' ? <FaFacebookF /> : <FaInstagram />}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.hr
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.8 }}
          className="my-12 border-gray-200 dark:border-gray-700"
        />

        {/* Footer Bottom */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-1 mb-4 md:mb-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} MiCounselor. All Rights Reserved.
            </p>
            <span className="hidden md:inline text-gray-600 dark:text-gray-400">•</span>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Developed by{" "}
              <motion.a
                href="https://ukohgodwingeorge-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="text-purple-600 hover:text-purple-700 dark:text-orange-400 dark:hover:text-orange-500 transition-colors duration-300"
              >
                Ukoh-Godwin George
              </motion.a>
            </p>
          </motion.div>
          <div className="flex space-x-4">
            {['Privacy Policy', 'Terms & Conditions'].map((text) => (
              <motion.a
                key={text}
                href="#"
                whileHover={{ scale: 1.05, x: 5 }}
                className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors duration-300"
              >
                {text}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;