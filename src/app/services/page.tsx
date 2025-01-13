import ScrollToTop from '@/components/ScrollToTop'
import ServicesPage from '../pages/ServicesPage'
import Heading from '@/components/Heading'

export default function AboutPage() {
  return (
    <main>
       <Heading
        title='Our Services'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
      <ScrollToTop/>
      <ServicesPage />
    </main>
  )
}