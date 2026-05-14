import { Suspense } from 'react'
import { getProducts } from '@/lib/db-catalog'
import { STATIC_CATEGORIES } from '@/lib/categories'
import type { CatalogProduct } from '@/lib/categories'
import CatalogView from '../CatalogView'

export function generateStaticParams() {
  return STATIC_CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cat = STATIC_CATEGORIES.find((c) => c.slug === params.slug)
  return {
    title: `${cat?.name ?? 'Категория'} — ТРАК`,
    description: `Запчасти — ${cat?.name ?? ''} для ГАЗ, ВАЗ, УАЗ, КАМАЗ`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { q?: string; page?: string }
}) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  try {
    result = await getProducts({ search, categorySlug: params.slug, page })
  } catch {
    // DB not connected yet
  }

  return (
    <Suspense>
      <CatalogView
        products={result.products}
        total={result.total}
        pages={result.pages}
        page={result.page}
        search={search}
        activeSlug={params.slug}
      />
    </Suspense>
  )
}
