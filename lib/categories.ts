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

// Product.brandName — одно плоское поле в БД без разделения на "марка авто"
// и "бренд запчасти" (совместимость по авто не реализована, ProductCompatibility
// пустая). Этот список — единственное место, где мы решаем, какие значения
// brandName считать маркой авто, для правильной подписи в UI (badge на /catalog,
// лейблы в StatsBrandsRow).
export const VEHICLE_MAKE_BRANDS = new Set(['ГАЗ', 'UAZ', 'LADA', 'KAMAZ'])

// 1С делит каталог по маркам, а не по типу детали — эти плитки/вкладки
// остаются тематическим быстрым доступом через поиск, а не ссылкой на категорию.
export const SEARCH_TERM: Record<string, string> = {
  dvigateli: 'двигатель',
  filtry: 'фильтр',
  'tormoznaya-sistema': 'тормоз',
  podveska: 'амортизатор',
  'masla-i-zhidkosti': 'масло',
  transmissiya: 'сцепление',
}

