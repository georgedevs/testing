'use client'
import ScrollToTop from '@/components/ScrollToTop'
import StoriesPage from '../pages/StoriesPage'
import Heading from '@/components/Heading'

export default function Stories() {
  return (
    <main>
      <Heading
        title='Success Stories'
        description='Read inspiring stories from couples who found their way back to connection through counseling'
        keywords='Counseling Success Stories, Relationship Success, Marriage Counseling Results, MiCounselor'
      />
      <ScrollToTop/>
      <StoriesPage />
    </main>
  )
}