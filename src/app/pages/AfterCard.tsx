import Head from 'next/head';
import { useState, ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

type AccordionProps = {
  title: string;
  children: ReactNode;
  index: number;
};

const AfterCard = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [100, 0, 0, -100]);

  return (
    <motion.div 
      ref={containerRef}
      style={{ opacity, scale, y }}
      className="py-24 px-8 md:px-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300"
    >
      <Head>
        <title>Couple Therapy Online</title>
        <meta name="description" content="Online couple therapy services" />
      </Head>

      <motion.header 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-16 max-w-4xl mx-auto"
      >
        <motion.h1 
          initial={{ scale: 0.9 }}
          animate={isInView ? { scale: 1 } : { scale: 0.9 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-5xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
        >
          Couple Therapy Online
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg mb-6 leading-relaxed text-gray-700 dark:text-gray-300"
        >
          Online couple therapy is an <span className="font-semibold relative">
            effective way
            <motion.span 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            />
          </span> for both 
          <span className="font-semibold"> individual</span> and <span className="font-semibold">couples</span>.
        </motion.p>
      </motion.header>

      <main className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
        <motion.section 
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-3/5"
        >
          <div className="mb-8">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-medium text-gray-700 dark:text-gray-300"
            >
              WE ARE THE
            </motion.h2>
            <motion.h3 
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-orange-500 dark:from-orange-400 dark:to-purple-500 bg-clip-text text-transparent"
            >
              Relationship Experts
            </motion.h3>
          </div>
          
          {[
            {
              title: "Highly Experienced",
              content: (
                <>
                  <p className="mb-4"><span className="font-semibold">Experienced Therapists:</span> Our online relationship counselling is carried out by highly experienced and qualified couple therapists.</p>
                  <p className="mb-4"><span className="font-semibold">Proven Results:</span> We have a proven track record in successfully helping countless couples and individuals achieve their goals.</p>
                  <p><span className="font-semibold">Specialised Expertise:</span> Our team of relationship therapists specialise in any kind of relationship problem for every type of relationship.</p>
                </>
              )
            },
            {
              title: "Qualified & Professional",
              content: "Our therapists maintain the highest standards of professional practice, backed by extensive qualifications and ongoing training in contemporary relationship therapy approaches."
            },
            {
              title: "Private & Confidential",
              content: "We ensure complete privacy and confidentiality in all our sessions. Our secure platform and strict protocols protect your personal information and session content."
            },
            {
              title: "Convenient & Easy",
              content: "Access expert relationship support from anywhere, at times that suit you. Our user-friendly platform makes it simple to connect with your therapist and manage your sessions."
            }
          ].map((item, index) => (
            <Accordion key={index} title={item.title} index={index}>
              {item.content}
            </Accordion>
          ))}
        </motion.section>

        <motion.aside 
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-2/5"
        >
          <Card className="overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-gray-800">
            <motion.div 
              className="relative h-[600px]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <img
                src="/abcdef.jpg"
                alt="Couple therapy illustration"
                className="object-cover w-full h-full"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          </Card>
        </motion.aside>
      </main>
    </motion.div>
  );
};

function Accordion({ title, children, index }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const accordionRef = useRef(null);
  const isInView = useInView(accordionRef, { once: false, margin: "-50px" });

  return (
    <motion.div 
      ref={accordionRef}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      <motion.button 
        className={`
          w-full px-6 py-4 rounded-xl
          flex justify-between items-center
          transition-all duration-300
          ${isOpen 
            ? 'bg-gray-100 dark:bg-gray-800' 
            : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800'}
        `}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h4 className="font-medium text-lg text-gray-700 dark:text-gray-200">
          {title}
        </h4>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-2xl text-gray-500 dark:text-gray-400"
        >
          ↓
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="p-6 mt-3 rounded-xl bg-white dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
              {children}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AfterCard;