import { Suspense } from 'react'
import { mockProducts, mockCategories } from '@/lib/mock-data'
import CatalogView from './CatalogView'

export const metadata = {
  title: 'Каталог запчастей — ТРАК',
  description: 'Запчасти для ГАЗ, ВАЗ, УАЗ, КАМАЗ в наличии и под заказ',
}

export default function CatalogPage() {
  return (
    <Suspense>
      <CatalogView products={mockProducts} categories={mockCategories} />
    </Suspense>
  )
}
