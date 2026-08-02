import { getFeaturedProducts, getCategoryTree } from '@/lib/db-catalog'
import type { CatalogProduct } from '@/lib/categories'
import HeroSlider from '@/components/sections/HeroSlider'
import CategoryNavTabs from '@/components/sections/CategoryNavTabs'
import StatsBrandsRow from '@/components/sections/StatsBrandsRow'
import CategoriesSection from '@/components/sections/CategoriesSection'
import ProductsSection from '@/components/sections/ProductsSection'
import ServiceSection from '@/components/sections/ServiceSection'
import ReviewsSection from '@/components/sections/ReviewsSection'

export default async function Home() {
  let featured: CatalogProduct[] = []
  try {
    featured = await getFeaturedProducts(4)
  } catch {
    // DB not connected yet
  }

  const categories = await getCategoryTree()

  return (
    <main>
      <CategoryNavTabs categories={categories} />
      <HeroSlider />
      <StatsBrandsRow />
      <CategoriesSection />
      <ProductsSection products={featured} />
      <ServiceSection />
      <ReviewsSection />
    </main>
  )
}
