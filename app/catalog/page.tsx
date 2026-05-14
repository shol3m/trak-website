import { Suspense } from 'react'
import { getProducts } from '@/lib/db-catalog'
import type { CatalogProduct } from '@/lib/categories'
import CatalogView from './CatalogView'

export const metadata = {
  title: 'Каталог запчастей — ТРАК',
  description: 'Запчасти для ГАЗ, ВАЗ, УАЗ, КАМАЗ в наличии и под заказ',
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string }
}) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const search = searchParams.q ?? ''

  let result: { products: CatalogProduct[]; total: number; pages: number; page: number } = { products: [], total: 0, pages: 0, page }
  try {
    result = await getProducts({ search, page })
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
      />
    </Suspense>
  )
}
