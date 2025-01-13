'use client'
import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Heading from '@/components/Heading';
import ScrollToTop from '@/components/ScrollToTop';
import { useMediaQuery } from './hooks/useMediaQuery';

// Dynamically import heavy components with loading optimization
const LandingPage = dynamic(() => import('./pages/LandingPage'), {
  loading: () => <div className="min-h-screen bg-white dark:bg-gray-900" />,
  ssr: false
});

const RelationshipCards = dynamic(() => import('./pages/RelationshipCard'), {
  loading: () => <div className="min-h-screen bg-gray-50 dark:bg-gray-800" />,
  ssr: false
});

const AfterCard = dynamic(() => import('./pages/AfterCard'), {
  loading: () => <div className="min-h-screen bg-white dark:bg-gray-900" />,
  ssr: false
});

const AfterTestimonial = dynamic(() => import('./pages/AfterTestimonial'), {
  loading: () => <div className="min-h-screen bg-gray-50 dark:bg-gray-800" />,
  ssr: false
});

const Footer = dynamic(() => import('./pages/Footer'), {
  loading: () => <div className="h-96 bg-white dark:bg-gray-900" />,
  ssr: false
});

interface ScrollTimeoutHandle {
  timeoutId: number | undefined;
}

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const setupPassiveListeners = useCallback(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      if (typeof jQuery !== 'undefined') {
        jQuery.event.special.touchstart = {
          setup: function( _, ns, handle ) {
            this.addEventListener('touchstart', handle, { passive: !ns.includes('noPreventDefault') });
          }
        };
        jQuery.event.special.touchmove = {
          setup: function( _, ns, handle ) {
            this.addEventListener('touchmove', handle, { passive: !ns.includes('noPreventDefault') });
          }
        };
        jQuery.event.special.wheel = {
          setup: function( _, ns, handle ){
            this.addEventListener('wheel', handle, { passive: true });
          }
        };
        jQuery.event.special.mousewheel = {
          setup: function( _, ns, handle ){
            this.addEventListener('mousewheel', handle, { passive: true });
          }
        };
      }
    `;
    return script;
  }, []);

  useEffect(() => {
    setMounted(true);
    
    const html = document.documentElement;
    
    if (isMobile) {
      html.style.touchAction = 'manipulation';
      
      const script = setupPassiveListeners();
      document.head.appendChild(script);
      
      const scrollTimeoutHandle: ScrollTimeoutHandle = {
        timeoutId: undefined
      };

      const handleScroll = () => {
        if (scrollTimeoutHandle.timeoutId) {
          window.clearTimeout(scrollTimeoutHandle.timeoutId);
        }
        
        html.style.pointerEvents = 'none';
        
        scrollTimeoutHandle.timeoutId = window.setTimeout(() => {
          html.style.pointerEvents = 'auto';
        }, 100);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      return () => {
        if (scrollTimeoutHandle.timeoutId) {
          window.clearTimeout(scrollTimeoutHandle.timeoutId);
        }
        window.removeEventListener('scroll', handleScroll);
        document.head.removeChild(script);
        html.style.touchAction = '';
        html.style.pointerEvents = '';
      };
    }
  }, [isMobile, setupPassiveListeners]);

  return (
    <main 
      className={`
        max-sm:overflow-x-hidden
        ${mounted ? 'transition-opacity duration-300 opacity-100' : 'opacity-0'}
      `}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        WebkitOverflowScrolling: 'touch'
      } as React.CSSProperties}
    >
      <Heading
        title="MiCounselor"
        description="MiCounselor is a platform that provides anonymous marriage and relationship counseling"
        keywords="Counseling, Therapy, MiCounselor, Marriage"
      />
      <ScrollToTop />
      
      {/* Wrap sections in transform layers for better performance */}
      <div style={{ transform: 'translateZ(0)' }}>
        <LandingPage />
      </div>
      <div style={{ transform: 'translateZ(0)' }}>
        <RelationshipCards />
      </div>
      <div style={{ transform: 'translateZ(0)' }}>
        <AfterCard />
      </div>
      <div style={{ transform: 'translateZ(0)' }}>
        <AfterTestimonial />
      </div>
      <div style={{ transform: 'translateZ(0)' }}>
        <Footer />
      </div>
    </main>
  );
}