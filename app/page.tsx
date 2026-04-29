import HeroSlider from '@/components/sections/HeroSlider'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import BrandsSection from '@/components/sections/BrandsSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import PartFinderSection from '@/components/sections/PartFinderSection'
import ProductsSection from '@/components/sections/ProductsSection'
import ServiceSection from '@/components/sections/ServiceSection'
import ServiceGallery from '@/components/sections/ServiceGallery'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default function Home() {
  return (
    <main>
      <HeroSlider />
      <AdvantagesSection />
      {/* <BrandsSection /> */}
      <CategoriesSection />
      {/* <PartFinderSection /> */}
      <ProductsSection />
      <ServiceSection />
      <ServiceGallery />
      <ReviewsSection />
    </main>
  )
}
