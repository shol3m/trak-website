export type CatalogProduct = {
  id: string
  name: string
  article: string
  brand: string
  category: string
  categorySlug: string
  price: number
  stock: number
  images: string[]
  description: string
  externalId: string | null
}

export const PAGE_SIZE = 50

export const STATIC_CATEGORIES = [
  { id: '1', slug: 'dvigateli',          name: 'Для двигателя' },
  { id: '2', slug: 'filtry',             name: 'Фильтры и расходники' },
  { id: '3', slug: 'tormoznaya-sistema', name: 'Тормозная система' },
  { id: '4', slug: 'podveska',           name: 'Подвеска' },
  { id: '5', slug: 'masla-i-zhidkosti',  name: 'Масла и жидкости' },
  { id: '6', slug: 'transmissiya',       name: 'Трансмиссия' },
  { id: '7', slug: 'prochee',            name: 'Прочее' },
]

