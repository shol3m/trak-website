'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { MockProduct, MockCategory } from '@/lib/mock-data'
import { useCartStore } from '@/lib/cart-store'
import ProductCard from '@/components/ui/ProductCard'
import Container from '@/components/layout/Container'

const BRAND_LABELS: Record<MockProduct['brand'], string> = {
  VAZ: 'ВАЗ',
  GAZ: 'ГАЗ',
  UAZ: 'УАЗ',
  KAMAZ: 'КАМАЗ',
}

// Maps category slugs to product.category strings (names differ in mock data)
const SLUG_TO_CATEGORY: Record<string, string> = {
  'dvigateli': 'Двигатели',
  'filtry': 'Фильтры',
  'tormoznaya-sistema': 'Тормозная система',
  'podveska': 'Подвеска',
  'masla-i-zhidkosti': 'Масла и жидкости',
  'transmissiya': 'Трансмиссия',
}

interface CatalogViewProps {
  products: MockProduct[]
  categories: MockCategory[]
  initialSlug?: string
}

export default function CatalogView({ products, categories, initialSlug }: CatalogViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedBrand = (searchParams.get('brand') as MockProduct['brand'] | null) ?? 'ALL'
  const selectedCategory = searchParams.get('category') ??
    (initialSlug ? (SLUG_TO_CATEGORY[initialSlug] ?? 'ALL') : 'ALL')

  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'ALL') params.delete(key)
      else params.set(key, value)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const filtered = products
    .filter((p) => selectedBrand === 'ALL' || p.brand === selectedBrand)
    .filter((p) => selectedCategory === 'ALL' || p.category === selectedCategory)

  function handleAddToCart(product: MockProduct) {
    addItem(product)
    openCart()
  }

  const activePill = 'bg-[#C8102E] text-white border border-[#C8102E]'
  const inactivePill = 'bg-bg-card border border-ui-border text-text-dim hover:border-[#C8102E] hover:text-[#C8102E] transition-colors duration-200'

  const categoryLabel = initialSlug
    ? categories.find((c) => c.slug === initialSlug)?.name
    : null

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-text-dim mb-8">
          <Link href="/" className="hover:text-[#C8102E] transition-colors">Главная</Link>
          <span>/</span>
          {categoryLabel ? (
            <>
              <Link href="/catalog" className="hover:text-[#C8102E] transition-colors">Каталог</Link>
              <span>/</span>
              <span className="text-text-base">{categoryLabel}</span>
            </>
          ) : (
            <span className="text-text-base">Каталог</span>
          )}
        </nav>

        <h1 className="font-heading text-3xl md:text-4xl text-text-base uppercase mb-8">
          {categoryLabel ?? 'Каталог запчастей'}
        </h1>

        {/* Filters */}
        <div className="sticky top-16 z-40 bg-bg-page/95 backdrop-blur-sm py-4 border-b border-ui-border mb-8 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Brand pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setParam('brand', 'ALL')}
                className={`font-mono text-xs px-3 py-1.5 ${selectedBrand === 'ALL' ? activePill : inactivePill}`}
              >
                Все бренды
              </button>
              {(Object.keys(BRAND_LABELS) as MockProduct['brand'][]).map((brand) => (
                <button
                  key={brand}
                  onClick={() => setParam('brand', brand)}
                  className={`font-mono text-xs px-3 py-1.5 ${selectedBrand === brand ? activePill : inactivePill}`}
                >
                  {BRAND_LABELS[brand]}
                </button>
              ))}
            </div>

            {/* Category select */}
            <select
              value={selectedCategory}
              onChange={(e) => setParam('category', e.target.value)}
              className="font-mono text-xs border border-ui-border bg-bg-card text-text-base px-3 py-1.5 outline-none focus:border-[#C8102E] transition-colors duration-200 sm:w-auto w-full"
            >
              <option value="ALL">Все категории</option>
              {Array.from(new Set(products.map((p) => p.category))).sort().map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count */}
        <p className="font-mono text-xs text-text-dim mb-6">
          Найдено: {filtered.length} {filtered.length === 1 ? 'товар' : filtered.length < 5 ? 'товара' : 'товаров'}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              >
                <Link href={`/catalog/${categories.find((c) => c.name === product.category || SLUG_TO_CATEGORY[c.slug] === product.category)?.slug ?? 'other'}/${product.article}`} className="block">
                  <ProductCard
                    product={product}
                    onAddToCart={(p) => { handleAddToCart(p) }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="font-heading text-xl text-text-base uppercase mb-2">Ничего не найдено</p>
            <p className="font-body text-sm text-text-dim">Попробуйте изменить фильтры</p>
          </div>
        )}
      </Container>
    </div>
  )
}
