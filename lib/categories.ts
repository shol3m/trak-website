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
  { id: '1', slug: 'dvigateli',         name: 'Для двигателя',        icon: '⚙️' },
  { id: '2', slug: 'filtry',            name: 'Фильтры и расходники', icon: '🔧' },
  { id: '3', slug: 'tormoznaya-sistema',name: 'Тормозная система',    icon: '🛑' },
  { id: '4', slug: 'podveska',          name: 'Подвеска',             icon: '🚗' },
  { id: '5', slug: 'masla-i-zhidkosti', name: 'Масла и жидкости',     icon: '🛢️' },
  { id: '6', slug: 'transmissiya',      name: 'Трансмиссия',          icon: '⚡' },
  { id: '7', slug: 'prochee',           name: 'Прочее',               icon: '📦' },
]

const CATEGORY_KEYWORDS: [string, string[]][] = [
  ['filtry',              ['фильтр']],
  ['masla-i-zhidkosti',   ['масло', 'жидкост', 'антифриз', 'охлаждающ', 'тосол']],
  ['tormoznaya-sistema',  ['тормоз', 'колодк', 'суппорт']],
  ['podveska',            ['амортизатор', 'пружин', 'рычаг', 'шаровая', 'сайлент', 'втулк', 'подшипник', 'стойк']],
  ['transmissiya',        ['сцепл', 'коробк', 'карданн', 'полуось', 'редуктор']],
  ['dvigateli',           ['двигатель', 'мотор', 'поршн', 'клапан', 'вкладыш', 'распредвал', 'коленвал', 'шатун', 'турбо', 'прокладк', 'ремень']],
]

export function detectCategorySlug(name: string): string {
  const lower = name.toLowerCase()
  for (const [slug, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return slug
  }
  return 'prochee'
}
