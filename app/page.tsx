import { getCategoryTree } from '@/lib/db-catalog'
import HeroSlider from '@/components/sections/HeroSlider'
import StatsBrandsRow from '@/components/sections/StatsBrandsRow'
import CategoryGrid from '@/components/sections/CategoryGrid'
import PartFinderCTA from '@/components/sections/PartFinderCTA'
import PromoCampaigns from '@/components/sections/PromoCampaigns'
import ServiceSection from '@/components/sections/ServiceSection'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default async function Home() {
  const categories = await getCategoryTree()

  return (
    <main>
      <HeroSlider />
      <StatsBrandsRow />
      <PromoCampaigns />
      <CategoryGrid categories={categories} />
      <PartFinderCTA />
      <ServiceSection />
      <ReviewsSection />
    </main>
  )
}
