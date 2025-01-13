'use client'
import LandingPage from './pages/LandingPage';
import RelationshipCards from './pages/RelationshipCard';
import AfterCard from './pages/AfterCard';
import TestimonialSection from './pages/TestimonialSection';
import AfterTestimonial from './pages/AfterTestimonial';
import Footer from './pages/Footer';
import Heading from '@/components/Heading';
import ScrollToTop from '@/components/ScrollToTop';

export default function Home() {
  return (
    <main className="max-sm:overflow-x-hidden">
      <Heading
        title='MiCounselor'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <ScrollToTop/>
      <LandingPage />
      <RelationshipCards />
      <AfterCard />
      <AfterTestimonial />
      <Footer />
    </main>
  );
}