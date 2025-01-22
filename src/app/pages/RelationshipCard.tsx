'use client'
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { BellRing, ChevronLeft, ChevronRight, Heart, HeartCrack, MonitorPlay, Search, Sparkles, Unlink, Users, } from 'lucide-react';

const RelationshipCards = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showControls, setShowControls] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [maxScroll, setMaxScroll] = useState(0);

    const isInView = useInView(containerRef, { once: false, margin: "-100px" });
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Check if user is on desktop
    useEffect(() => {
        const checkIfDesktop = () => {
            setShowControls(window.innerWidth >= 1024);
        };
        
        checkIfDesktop();
        window.addEventListener('resize', checkIfDesktop);
        
        return () => window.removeEventListener('resize', checkIfDesktop);
    }, []);

    // Update scroll position state
    useEffect(() => {
        const element = scrollContainerRef.current;
        if (element) {
            const updateScroll = () => {
                setMaxScroll(element.scrollWidth - element.clientWidth);
                setScrollPosition(element.scrollLeft);
            };

            updateScroll();
            element.addEventListener('scroll', updateScroll);
            window.addEventListener('resize', updateScroll);
            
            return () => {
                element.removeEventListener('scroll', updateScroll);
                window.removeEventListener('resize', updateScroll);
            };
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -340 : 340;
            container.scrollTo({
                left: container.scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);


    const cards = [
        {
            title: "'Stuck' Relationships",
            description: "Addressing and overcoming recurring issues/arguments that hinder the growth and progress of the relationship.",
            icon: Users,
            link: "/resources/stuck-relationships"
        },
        {
            title: "Stale Relationships",   
            description: "Help to revitalise and bring back excitement and connection in relationships that have lost their spark.",
            icon: Sparkles,
            link: "/services/stale-relationships"
        },
        {
            title: "Infidelity or Affairs",
            description: "Navigating the hurt and emotional turmoil. Then rebuilding trust after a breach of fidelity.",
            icon: HeartCrack,
            link: "/services/infidelity"
        },
        {
            title: "Relationship Breakups",
            description: "Providing support and guidance during the difficult process of ending a relationship.",
            icon: Unlink,
            link: "/services/breakups"
        },
        {
            title: "Intimacy Problems",
            description: "Working through challenges related to emotional and physical intimacy to foster a deeper connection.",
            icon: Heart,
            link: "/services/intimacy-problems"
        },
        {
            title: "The Impact of Pornography",
            description: "Helping individuals and couples address the effects of pornography on their relationship.",
            icon: MonitorPlay,
            link: "/services/pornography-impact"
        },
        {
            title: "Pre-marital Counselling",
            description: "Preparing couples for marriage by exploring important topics by engaging in open communication.",
            icon: BellRing,
            link: "/services/premarital-counseling"
        },
        {
            title: "Jealousy and Suspicion",
            description: "Addressing feelings of jealousy and suspicion to build trust and security within the relationship.",
            icon: Search,
            link: "/services/jealousy-suspicion"
        }
    ];

    const titleVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
                duration: 0.8
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const cardVariants = {
        hidden: { 
            opacity: 0,
            y: 50,
            rotateX: -15,
            scale: 0.8
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 50,
                damping: 15,
                duration: 0.8
            }
        }
    };

    const floatingAnimation = {
        initial: { y: 0 },
        animate: {
            y: [-8, 8, -8],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.section 
            ref={containerRef}
            style={{ opacity, scale, y }}
            className="relative py-16 px-4 md:px-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300"
        >
            <div className="container mx-auto">
                <motion.h2 
                    variants={titleVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-center text-2xl md:text-4xl font-bold mb-8 md:mb-16 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
                >
                    Transforming Relationships For The Better
                </motion.h2>
                
                <div className="relative">
                    {showControls && (
                        <>
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: scrollPosition > 0 ? 1 : 0 }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10"
                                onClick={() => scroll('left')}
                            >
                                <div className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg">
                                    <ChevronLeft className="w-6 h-6 text-purple-600 dark:text-orange-500" />
                                </div>
                            </motion.button>

                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: scrollPosition < maxScroll ? 1 : 0 }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10"
                                onClick={() => scroll('right')}
                            >
                                <div className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg">
                                    <ChevronRight className="w-6 h-6 text-purple-600 dark:text-orange-500" />
                                </div>
                            </motion.button>
                        </>
                    )}

                    <motion.div 
                        ref={scrollContainerRef}
                        variants={containerVariants}
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 px-4"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                    >
                        <div className="flex space-x-4 pb-8">
                            {cards.map((card, index) => (
                                <motion.div 
                                    key={index}
                                    variants={cardVariants}
                                    className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
                                >
                                    <motion.div
                                        whileHover={{ 
                                            scale: 1.05,
                                            rotateY: 5,
                                            translateZ: 20,
                                            transition: { duration: 0.3 }
                                        }}
                                        className="h-full"
                                    >
                                        <Card className="group relative overflow-hidden p-6 md:p-8 rounded-2xl w-full h-full transition-all duration-300 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 transform-gpu">
                                            <motion.div 
                                                className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500"
                                                initial={{ rotate: 0, opacity: 0 }}
                                                animate={{ rotate: 180 }}
                                                transition={{ 
                                                    rotate: {
                                                        duration: 20,
                                                        repeat: Infinity,
                                                        ease: "linear"
                                                    },
                                                    opacity: {
                                                        duration: 0.3
                                                    }
                                                }}
                                            />
                                            
                                            <div className="relative z-10">
                                            <motion.div 
    variants={floatingAnimation}
    initial="initial"
    animate="animate"
    className="text-4xl mb-4 md:mb-6 opacity-90 dark:opacity-80"
>
    {React.createElement(card.icon, {
        size: 36,
        className: "text-purple-600 dark:text-orange-400"
    })}
</motion.div>
                                                <motion.h3 
                                                    className="text-lg md:text-xl font-semibold mb-2 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {card.title}
                                                </motion.h3>
                                                
                                                <p className="text-sm mb-4 md:mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                                                    {card.description}
                                                </p>
                                                
                                                {card.link && (
                                                    <Link href={card.link}>
                                                        <motion.span 
                                                            whileHover={{ x: 10 }}
                                                            className="text-sm font-medium text-purple-600 dark:text-orange-400 hover:text-purple-500 dark:hover:text-orange-300 flex items-center gap-2"
                                                        >
                                                            Learn more
                                                            <motion.span 
                                                                className="text-lg"
                                                                animate={{ x: [0, 5, 0] }}
                                                                transition={{ 
                                                                    duration: 1.5, 
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut" 
                                                                }}
                                                            >
                                                                →
                                                            </motion.span>
                                                        </motion.span>
                                                    </Link>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default RelationshipCards;