import { getCategoryTree } from '@/lib/db-catalog'
import HeroSlider from '@/components/sections/HeroSlider'
import CategoryNavTabs from '@/components/sections/CategoryNavTabs'
import StatsBrandsRow from '@/components/sections/StatsBrandsRow'
import PartFinderCTA from '@/components/sections/PartFinderCTA'
import ServiceSection from '@/components/sections/ServiceSection'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default async function Home() {
  const categories = await getCategoryTree()

  return (
    <main>
      <CategoryNavTabs categories={categories} />
      <HeroSlider />
      <StatsBrandsRow />
      <PartFinderCTA />
      <ServiceSection />
      <ReviewsSection />
    </main>
  )
}
