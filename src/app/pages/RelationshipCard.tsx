import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';

const RelationshipCards = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, margin: "-100px" });
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

    const cards = [
        {
            title: "'Stuck' Relationships",
            description: "Addressing and overcoming recurring issues/arguments that hinder the growth and progress of the relationship.",
            icon: "💑",
            link: "/resources/stuck-relationships"
        },
        {
            title: "Stale Relationships",
            description: "Help to revitalise and bring back excitement and connection in relationships that have lost their spark.",
            icon: "✨",
            link: "/services/stale-relationships"
        },
        {
            title: "Infidelity or Affairs",
            description: "Navigating the hurt and emotional turmoil. Then rebuilding trust after a breach of fidelity.",
            icon: "💔",
            link: "/services/infidelity"
        },
        {
            title: "Relationship Breakups",
            description: "Providing support and guidance during the difficult process of ending a relationship.",
            icon: "🔗",
            link: "/services/breakups"
        },
        {
            title: "Intimacy Problems",
            description: "Working through challenges related to emotional and physical intimacy to foster a deeper connection.",
            icon: "❤️",
            link: "/services/intimacy-problems"
        },
        {
            title: "The Impact of Pornography",
            description: "Helping individuals and couples address the effects of pornography on their relationship.",
            icon: "📺",
            link: "/services/pornography-impact"
        },
        {
            title: "Pre-marital Counselling",
            description: "Preparing couples for marriage by exploring important topics by engaging in open communication.",
            icon: "💍",
            link: "/services/premarital-counseling"
        },
        {
            title: "Jealousy and Suspicion",
            description: "Addressing feelings of jealousy and suspicion to build trust and security within the relationship.",
            icon: "🕵️‍♀️",
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
                
                <motion.div 
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
                    <div className="flex space-x-4 pb-4">
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
                                            initial={{ rotate: 0 }}
                                            whileHover={{ 
                                                rotate: 180,
                                                transition: { duration: 20, repeat: Infinity, ease: "linear" }
                                            }}
                                        />
                                        
                                        <div className="relative z-10">
                                            <motion.div 
                                                variants={floatingAnimation}
                                                initial="initial"
                                                animate="animate"
                                                className="text-4xl mb-4 md:mb-6 opacity-90 dark:opacity-80"
                                            >
                                                {card.icon}
                                            </motion.div>
                                            
                                            <motion.h3 
                                                className="text-lg md:text-xl font-semibold mb-2 md:mb-4 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {card.title}
                                            </motion.h3>
                                            
                                            <p className="text-xs md:text-sm mb-4 md:mb-6 leading-relaxed text-gray-600 dark:text-gray-300">
                                                {card.description}
                                            </p>
                                            
                                            {card.link && (
                                                <Link href={card.link}>
                                                    <motion.span 
                                                        whileHover={{ x: 10 }}
                                                        className="text-xs md:text-sm font-medium text-purple-600 dark:text-orange-400 hover:text-purple-500 dark:hover:text-orange-300 flex items-center gap-2 cursor-pointer"
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
        </motion.section>
    );
};

export default RelationshipCards;