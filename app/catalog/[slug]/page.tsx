import { Suspense } from 'react'
import { mockProducts, mockCategories } from '@/lib/mock-data'
import CatalogView from '../CatalogView'

export async function generateStaticParams() {
  return mockCategories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = mockCategories.find((c) => c.slug === params.slug)
  return {
    title: `${cat?.name ?? 'Категория'} — ТРАК`,
    description: `Запчасти в категории ${cat?.name ?? ''} для ГАЗ, ВАЗ, УАЗ, КАМАЗ`,
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense>
      <CatalogView
        products={mockProducts}
        categories={mockCategories}
        initialSlug={params.slug}
      />
    </Suspense>
  )
}
