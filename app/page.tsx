import HeroSection from '@/components/sections/HeroSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import ProductsSection from '@/components/sections/ProductsSection'
import ServiceSection from '@/components/sections/ServiceSection'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AdvantagesSection />
      <CategoriesSection />
      <ProductsSection />
      <ServiceSection />
      <ReviewsSection />
    </main>
  )
}
