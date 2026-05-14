import { getFeaturedProducts } from '@/lib/db-catalog'
import type { CatalogProduct } from '@/lib/categories'
import HeroSlider from '@/components/sections/HeroSlider'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import CategoriesSection from '@/components/sections/CategoriesSection'
import ProductsSection from '@/components/sections/ProductsSection'
import ServiceSection from '@/components/sections/ServiceSection'
import ServiceGallery from '@/components/sections/ServiceGallery'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default async function Home() {
  let featured: CatalogProduct[] = []
  try {
    featured = await getFeaturedProducts(4)
  } catch {
    // DB not connected yet
  }

  return (
    <main>
      <HeroSlider />
      <AdvantagesSection />
      <CategoriesSection />
      <ProductsSection products={featured} />
      <ServiceSection />
      <ServiceGallery />
      <ReviewsSection />
    </main>
  )
}
