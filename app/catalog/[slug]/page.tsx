import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getProducts, getCategories } from '@/lib/db-catalog'
import { STATIC_CATEGORIES } from '@/lib/categories'
import type { CatalogProduct, DbCategory } from '@/lib/db-catalog'
import CatalogView from '../CatalogView'

const VALID_SLUGS = new Set(STATIC_CATEGORIES.map((c) => c.slug))

export function generateStaticParams() {
  return STATIC_CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === params.slug)
  return {
    title: `${cat?.name ?? 'Категория'} — ТРАК`,
    description: `Запчасти — ${cat?.name ?? ''} для ГАЗ, Лада, УАЗ, КАМАЗ`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { q?: string; page?: string; sort?: string }
}) {
  if (!VALID_SLUGS.has(params.slug)) return notFound()

  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''
  const sort = searchParams.sort ?? ''

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = {
    products: [],
    total: 0,
    pages: 0,
    page,
  }
  let categories: DbCategory[] = []

  try {
    ;[result, categories] = await Promise.all([
      getProducts({ search, categorySlug: params.slug, page, sort }),
      getCategories(),
    ])
  } catch {
    // DB not available
  }

  return (
    <Suspense>
      <CatalogView
        products={result.products}
        categories={categories}
        total={result.total}
        pages={result.pages}
        page={result.page}
        search={search}
        sort={sort}
        activeSlug={params.slug}
      />
    </Suspense>
  )
}
