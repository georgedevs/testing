'use client'
import LandingPage from './pages/LandingPage';
import RelationshipCards from './pages/RelationshipCard';
import AfterCard from './pages/AfterCard';
import AfterTestimonial from './pages/AfterTestimonial';
import Footer from './pages/Footer';
import Heading from '@/components/Heading';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <div className="relative w-full overflow-hidden">
    <main className="w-full">
      <Heading
        title="MiCounselor"
        description="MiCounselor is a platform that provides anonymous marriage and relationship counseling"
        keywords="Counseling, Therapy, MiCounselor, Marriage"
      />
      <ScrollToTop />
      
      <div className="relative w-full">
        <LandingPage />
      </div>
      
      <div className="relative w-full">
        <RelationshipCards />
      </div>
      
      <div className="relative w-full">
        <AfterCard />
      </div>
      
      <div className="relative w-full">
        <AfterTestimonial />
      </div>
      
      <div className="relative w-full">
        <Footer />
      </div>
    </main>
  </div>
);
}