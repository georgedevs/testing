
import StuckRelationshipsPage from '@/app/pages/StuckRelationshipsPage'
import Heading from '@/components/Heading'


export default function AboutPage() {
  return (
    <main>
      <Heading
        title='Stuck Relationships'
        description='MiCounselor is a platform that provides anonymous marriage and relationship counseling'
        keywords='Counseling, Therapy, MiCounselor, Marriage'
      />
     <StuckRelationshipsPage/>
    </main>
  )
}