'use client'
import ScrollToTop from '@/components/ScrollToTop'
import AboutContent from '../pages/About'
import Heading from '@/components/Heading'

export default function AboutPage() {
  return (
    <main>
       <Heading
        title='About MiCounselor'
        description='Learn more about MiCounselor and our mission to help couples build stronger, more meaningful relationships.'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <ScrollToTop/>
      <AboutContent />
    </main>
  )
}