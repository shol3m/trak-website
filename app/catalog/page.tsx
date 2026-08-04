import { Suspense } from 'react'
import { getProducts, getCategoryTree } from '@/lib/db-catalog'
import type { CatalogProduct, TreeCategory } from '@/lib/db-catalog'
import CatalogView from './CatalogView'
import CategoryTiles from './CategoryTiles'

type CatalogSearchParams = {
  q?: string
  page?: string
  sort?: string
  brand?: string
  inStock?: string
  priceMin?: string
  priceMax?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: CatalogSearchParams
}) {
  const brand = searchParams.brand?.trim()
  if (brand) {
    return {
      title: `Запчасти ${brand} — купить в Уфе | ТРАК`,
      description: `Запчасти ${brand} в наличии и под заказ.`,
    }
  }
  return {
    title: 'Каталог запчастей — ТРАК',
    description: 'Запчасти для ГАЗ, Лада, УАЗ, КАМАЗ в наличии и под заказ',
  }
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: CatalogSearchParams
}) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''
  const sort = searchParams.sort ?? ''
  const brand = searchParams.brand ?? ''
  const inStock = searchParams.inStock === '1'
  const priceMin = searchParams.priceMin ? Number(searchParams.priceMin) : undefined
  const priceMax = searchParams.priceMax ? Number(searchParams.priceMax) : undefined

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  let roots: TreeCategory[] = []
  let error = false

  try {
    ;[result, roots] = await Promise.all([
      getProducts({ search, brand, inStock, priceMin, priceMax, page, sort }),
      getCategoryTree(),
    ])
  } catch (e) {
    console.error('[catalog] error:', e)
    error = true
  }

  return (
    <Suspense>
      <CatalogView
        products={result.products}
        total={result.total}
        pages={result.pages}
        page={result.page}
        search={search}
        sort={sort}
        brand={brand}
        inStock={inStock}
        priceMin={priceMin}
        priceMax={priceMax}
        title={brand ? `Запчасти ${brand}` : 'Каталог запчастей'}
        basePath="/catalog"
        topSlot={<CategoryTiles categories={roots} basePath="/catalog" />}
        error={error}
      />
    </Suspense>
  )
}
