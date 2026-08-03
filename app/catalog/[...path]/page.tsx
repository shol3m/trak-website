import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { getProducts, getProductByArticle, getCategoryNode } from '@/lib/db-catalog'
import type { CatalogProduct } from '@/lib/db-catalog'
import CatalogView from '../CatalogView'
import CategoryTiles from '../CategoryTiles'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Container from '@/components/layout/Container'

export const dynamic = 'force-dynamic'

// Only the last URL segment identifies the category — slugs are globally
// unique, so the leading segments exist purely for a readable breadcrumb URL.
function lastSlug(path: string[]) {
  return path[path.length - 1]
}

export async function generateMetadata({ params }: { params: { path: string[] } }) {
  const node = await getCategoryNode(lastSlug(params.path)).catch(() => null)
  return {
    title: `${node?.category.name ?? 'Категория'} — ТРАК`,
    description: `Запчасти — ${node?.category.name ?? ''} для ГАЗ, Лада, УАЗ, КАМАЗ`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { path: string[] }
  searchParams: { q?: string; page?: string; sort?: string }
}) {
  let node
  try {
    node = await getCategoryNode(lastSlug(params.path))
  } catch {
    // DB temporarily unreachable — this category may well be valid, so don't
    // hard-404 it (that's a real 404 to search engines and stale bookmarks).
    return (
      <div className="min-h-screen bg-bg-page pt-24 pb-20">
        <Container>
          <p className="font-mono text-sm text-text-dim py-20 text-center">
            Каталог временно недоступен, попробуйте обновить страницу через минуту
          </p>
        </Container>
      </div>
    )
  }

  if (!node) {
    // Old URL shape was /catalog/[categorySlug]/[article] — if the last
    // segment is a real product article, forward to its new /product page
    // instead of 404ing on every stale inbound/bookmarked link.
    if (params.path.length >= 2) {
      const product = await getProductByArticle(lastSlug(params.path)).catch(() => null)
      if (product) redirect(`/product/${product.article}`)
    }
    return notFound()
  }

  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''
  const sort = searchParams.sort ?? ''

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = {
    products: [],
    total: 0,
    pages: 0,
    page,
  }
  let error = false

  try {
    result = await getProducts({ search, categoryPath: node.category.path, page, sort })
  } catch {
    error = true
  }

  const categoryChain = [...node.ancestors, node.category]
  const basePath = `/catalog/${categoryChain.map((c) => c.slug).join('/')}`

  return (
    <Suspense>
      <CatalogView
        products={result.products}
        total={result.total}
        pages={result.pages}
        page={result.page}
        search={search}
        sort={sort}
        title={node.category.name}
        basePath={basePath}
        topSlot={
          <>
            <Breadcrumb
              items={[
                { name: 'Главная', href: '/' },
                { name: 'Каталог', href: '/catalog' },
                ...categoryChain.map((c, i) => ({
                  name: c.name,
                  href: `/catalog/${categoryChain.slice(0, i + 1).map((a) => a.slug).join('/')}`,
                })),
              ]}
            />
            <CategoryTiles categories={node.children} basePath={basePath} />
          </>
        }
        error={error}
      />
    </Suspense>
  )
}
