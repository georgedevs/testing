'use client'
import LandingPage from './pages/LandingPage';
import RelationshipCards from './pages/RelationshipCard';
import AfterCard from './pages/AfterCard';
import AfterTestimonial from './pages/AfterTestimonial';
import Footer from './pages/Footer';
import Heading from '@/components/Heading';

export default function Home() {
  return (
    <div className="relative w-full overflow-x-hidden">
      <Heading
        title='MiCounselor'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <LandingPage />
      <RelationshipCards />
      <AfterCard />
      <AfterTestimonial />
      <Footer />
    </div>
  );
}