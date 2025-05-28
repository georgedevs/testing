import React, { useState, useEffect, useRef, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

type DropdownItem = {
  label: string;
  href: string;  
};

type NavigationItem = {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
};

interface ThemeToggleButtonProps {
  className?: string;
  showIcon?: boolean;
  theme?: string;
  toggleTheme: () => void;
  mounted: boolean;
}

// Import the HeartLogo component
import HeartLogo from '@/components/HeartLogo';

const ThemeToggleButton = memo(({ 
  className = '', 
  showIcon = true, 
  theme, 
  toggleTheme, 
  mounted 
}: ThemeToggleButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={toggleTheme}
    className={`flex items-center justify-center transition-all duration-300
      bg-purple-500/20 dark:bg-orange-500/20 
      text-purple-600 dark:text-orange-300
      hover:bg-purple-500/30 dark:hover:bg-orange-500/30
      ${className}`}
    aria-label="Toggle theme"
  >
    {mounted && showIcon && (
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </motion.div>
      </AnimatePresence>
    )}
  </motion.button>
));

ThemeToggleButton.displayName = 'ThemeToggleButton';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentYear = new Date().getFullYear();

  const handleGetStarted = () => {
    router.push('/signin');
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    router.push('/');
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navigationItems: NavigationItem[] = [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Stories', href: '/stories' }
  ];

  const isActive = (item: NavigationItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.dropdown) {
      return item.dropdown.some(dropItem => pathname === dropItem.href);
    }
    return false;
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800"
      >
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo with Heart - Updated Section */}
          <motion.div 
            onClick={handleHomeClick}
            className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <HeartLogo 
              className="w-9 h-9 md:w-10 md:h-10 hover:scale-110 transition-transform duration-300" 
              size={40}
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
              MiCounselor
            </h1>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <ThemeToggleButton 
              className="w-10 h-10 rounded-full"
              theme={theme}
              toggleTheme={toggleTheme}
              mounted={mounted}
            />
            
            <motion.button
              ref={menuButtonRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(item.label)}
              >
                {item.dropdown ? (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className={`
                      flex items-center gap-1 cursor-pointer text-sm uppercase tracking-wider font-medium
                      text-gray-600 dark:text-gray-300 
                      hover:text-purple-600 dark:hover:text-orange-400
                      ${isActive(item) ? 'text-purple-600 dark:text-orange-400' : ''}
                      transition-colors duration-300
                    `}
                  >
                    {item.label}
                    <motion.div
                      animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.a
                    href={item.href}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      text-sm uppercase tracking-wider font-medium relative
                      text-gray-600 dark:text-gray-300 
                      hover:text-purple-600 dark:hover:text-orange-400
                      ${isActive(item) ? 'text-purple-600 dark:text-orange-400 after:content-[""] after:absolute after:left-0 after:bottom-[-8px] after:w-full after:h-0.5 after:bg-current' : ''}
                      transition-colors duration-300
                    `}
                  >
                    {item.label}
                  </motion.a>
                )}

                {/* Desktop Dropdown with Animation */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.label && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 min-w-[200px] rounded-lg shadow-lg overflow-hidden
                        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.dropdown.map((dropdownItem, idx) => (
                        <motion.a
                          key={dropdownItem.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          href={dropdownItem.href}
                          className={`
                            block px-6 py-3 text-sm transition-colors duration-300
                            text-gray-600 dark:text-gray-300
                            hover:bg-gray-50 dark:hover:bg-gray-700
                            hover:text-purple-600 dark:hover:text-orange-400
                            ${pathname === dropdownItem.href ? 'text-purple-600 dark:text-orange-400 bg-gray-50 dark:bg-gray-700' : ''}
                          `}
                        >
                          {dropdownItem.label}
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            
            {/* Desktop Theme Toggle with Animation */}
            <ThemeToggleButton 
              className="w-10 h-10 rounded-full"
              theme={theme}
              toggleTheme={toggleTheme}
              mounted={mounted}
            />

            {/* Get Started Button with Animation */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-5 py-2 rounded-full text-sm uppercase tracking-wider transition-colors duration-300
                bg-purple-600 dark:bg-orange-500 
                text-white
                hover:bg-purple-700 dark:hover:bg-orange-600"
            >
              Get Started
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with Enhanced Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 md:hidden"
            >
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 backdrop-blur-lg bg-purple-500/10 dark:bg-orange-500/10"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              <motion.div 
                ref={menuRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute top-0 right-0 w-[85%] max-w-sm h-screen
                  bg-gradient-to-br from-white via-purple-50 to-white
                  dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
                  shadow-2xl border-l border-purple-100 dark:border-gray-700
                  flex flex-col overflow-y-auto"
              >
                <div className="flex-1 p-8 space-y-6">
                  {navigationItems.map((item, idx) => (
                    <motion.div 
                      key={item.label}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="space-y-2"
                    >
                      {item.dropdown ? (
                        <div>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                            className={`
                              w-full py-3 px-4 rounded-xl
                              flex items-center justify-between
                              text-lg font-medium transition-all duration-300
                              ${isActive(item) 
                                ? 'bg-purple-100 dark:bg-gray-800 text-purple-600 dark:text-orange-400'
                                : 'hover:bg-purple-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'}
                            `}
                          >
                            {item.label}
                            <motion.div
                              animate={{ rotate: activeDropdown === item.label ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </motion.div>
                          </motion.button>
                          <AnimatePresence>
                            {activeDropdown === item.label && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-2 space-y-1 pl-4 border-l-2 border-purple-200 dark:border-gray-700"
                              >
                                {item.dropdown.map((dropdownItem, dropIdx) => (
                                  <motion.a
                                    key={dropdownItem.label}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: dropIdx * 0.05 }}
                                    href={dropdownItem.href}
                                    className={`
                                      block py-3 px-4 rounded-lg
                                      text-sm transition-all duration-300
                                      ${pathname === dropdownItem.href
                                        ? 'bg-purple-50 dark:bg-gray-800/50 text-purple-600 dark:text-orange-400'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50/50 dark:hover:bg-gray-800/30'}
                                    `}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.label}
                                  </motion.a>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <motion.a
                          href={item.href}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            block py-3 px-4 rounded-xl
                            text-lg font-medium transition-all duration-300
                            ${isActive(item)
                              ? 'bg-purple-100 dark:bg-gray-800 text-purple-600 dark:text-orange-400'
                              : 'hover:bg-purple-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-300'}
                          `}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </motion.a>
                      )}
                    </motion.div>
                  ))}

                  {/* Enhanced Get Started Button */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: navigationItems.length * 0.1 }}
                    className="pt-6"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGetStarted}
                      className="w-full px-6 py-4 rounded-xl text-sm uppercase tracking-wider font-medium
                        bg-gradient-to-r from-purple-600 to-purple-700 dark:from-orange-500 dark:to-orange-600
                        text-white transform transition-all duration-300
                        hover:shadow-lg"
                    >
                      Get Started
                    </motion.button>
                  </motion.div>
                </div>

                {/* Animated Copyright Section with Heart */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 mt-auto border-t border-purple-100 dark:border-gray-700"
                >
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <HeartLogo className="w-7 h-7" size={28} />
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent">
                        MiCounselor
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      © {currentYear} All rights reserved
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;