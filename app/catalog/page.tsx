import { Suspense } from 'react'
import { getProducts, getCategoryTree } from '@/lib/db-catalog'
import type { CatalogProduct, TreeCategory } from '@/lib/db-catalog'
import CatalogView from './CatalogView'
import CategoryTiles from './CategoryTiles'

type CatalogSearchParams = { q?: string; page?: string; sort?: string; brand?: string }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: CatalogSearchParams
}) {
  const brand = searchParams.brand?.trim()
  if (brand) {
    return {
      title: `Запчасти ${brand} — купить в Уфе | ТРАК`,
      description: `Запчасти ${brand} в наличии и под заказ. Доставка по России, самовывоз в Уфе.`,
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

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  let roots: TreeCategory[] = []

  try {
    ;[result, roots] = await Promise.all([
      getProducts({ search, brand, page, sort }),
      getCategoryTree(),
    ])
  } catch (e) {
    console.error('[catalog] error:', e)
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
        title={brand ? `Запчасти ${brand}` : 'Каталог запчастей'}
        basePath="/catalog"
        topSlot={<CategoryTiles categories={roots} basePath="/catalog" />}
      />
    </Suspense>
  )
}
