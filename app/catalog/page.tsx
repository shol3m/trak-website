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

function parseBrands(raw?: string): string[] {
  return raw ? raw.split(',').map((b) => b.trim()).filter(Boolean) : []
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: CatalogSearchParams
}) {
  const brands = parseBrands(searchParams.brand)
  if (brands.length === 1) {
    return {
      title: `Запчасти ${brands[0]} — купить в Уфе | ТРАК`,
      description: `Запчасти ${brands[0]} в наличии и под заказ.`,
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
  const brands = parseBrands(searchParams.brand)
  const inStock = searchParams.inStock === '1'
  const priceMin = searchParams.priceMin ? Number(searchParams.priceMin) : undefined
  const priceMax = searchParams.priceMax ? Number(searchParams.priceMax) : undefined

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  let roots: TreeCategory[] = []
  let error = false

  try {
    ;[result, roots] = await Promise.all([
      getProducts({ search, brand: brands, inStock, priceMin, priceMax, page, sort }),
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
        brands={brands}
        inStock={inStock}
        priceMin={priceMin}
        priceMax={priceMax}
        title={brands.length === 1 ? `Запчасти ${brands[0]}` : 'Каталог запчастей'}
        basePath="/catalog"
        topSlot={<CategoryTiles categories={roots} basePath="/catalog" />}
        error={error}
      />
    </Suspense>
  )
}
