import { Suspense } from 'react'
import { getProducts, getCategoryTree } from '@/lib/db-catalog'
import type { CatalogProduct, TreeCategory } from '@/lib/db-catalog'
import CatalogView from './CatalogView'
import CategoryTiles from './CategoryTiles'

export const metadata = {
  title: 'Каталог запчастей — ТРАК',
  description: 'Запчасти для ГАЗ, Лада, УАЗ, КАМАЗ в наличии и под заказ',
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string; sort?: string }
}) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''
  const sort = searchParams.sort ?? ''

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  let roots: TreeCategory[] = []

  try {
    ;[result, roots] = await Promise.all([
      getProducts({ search, page, sort }),
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
        title="Каталог запчастей"
        basePath="/catalog"
        topSlot={<CategoryTiles categories={roots} basePath="/catalog" />}
      />
    </Suspense>
  )
}
