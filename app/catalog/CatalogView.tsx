'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CatalogProduct } from '@/lib/categories'
import type { DbCategory } from '@/lib/db-catalog'
import { useCartStore } from '@/lib/cart-store'
import ProductCard from '@/components/ui/ProductCard'
import Container from '@/components/layout/Container'

interface CatalogViewProps {
  products: CatalogProduct[]
  categories: DbCategory[]
  total: number
  pages: number
  page: number
  search: string
  activeSlug?: string
}

export default function CatalogView({
  products,
  categories,
  total,
  pages,
  page,
  search,
  activeSlug,
}: CatalogViewProps) {
  const router = useRouter()
  const [query, setQuery] = useState(search)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const activeCategory = categories.find((c) => c.slug === activeSlug)
  const basePath = activeSlug ? `/catalog/${activeSlug}` : '/catalog'
  const searchParam = search ? `&q=${encodeURIComponent(search)}` : ''

  function handleSearch() {
    const q = query.trim()
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : '/catalog')
  }

  function handleClear() {
    setQuery('')
    router.push(basePath)
  }

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase mb-1">
            {activeCategory ? activeCategory.name : 'Каталог запчастей'}
          </h1>
          <p className="font-mono text-sm text-text-dim">
            {total > 0
              ? `${total.toLocaleString('ru-RU')} товаров`
              : 'Товары появятся после первой синхронизации с 1С'}
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Артикул или название..."
            className="flex-1 px-4 py-2.5 bg-bg-card border border-ui-border text-text-base font-mono text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
          />
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-[#C8102E] text-white font-mono text-sm uppercase hover:bg-[#a50e26] transition-colors"
          >
            Найти
          </button>
          {(search || query) && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 border border-ui-border text-text-dim font-mono text-sm hover:text-text-base hover:border-[#C8102E] transition-colors"
              aria-label="Сбросить"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          <Link
            href="/catalog"
            className={`flex-shrink-0 px-4 py-2 font-mono text-xs uppercase border transition-colors whitespace-nowrap ${
              !activeSlug
                ? 'bg-[#C8102E] text-white border-[#C8102E]'
                : 'bg-bg-card border-ui-border text-text-dim hover:border-[#C8102E] hover:text-text-base'
            }`}
          >
            Все
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className={`flex-shrink-0 px-4 py-2 font-mono text-xs uppercase border transition-colors whitespace-nowrap ${
                activeSlug === cat.slug
                  ? 'bg-[#C8102E] text-white border-[#C8102E]'
                  : 'bg-bg-card border-ui-border text-text-dim hover:border-[#C8102E] hover:text-text-base'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Products */}
        {products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-mono text-sm text-text-dim">
              {search
                ? `По запросу «${search}» ничего не найдено`
                : 'Товары появятся после первой синхронизации с 1С'}
            </p>
            {search && (
              <button
                onClick={handleClear}
                className="mt-4 font-mono text-xs text-[#C8102E] hover:underline"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/catalog/${product.categorySlug}/${product.article}`}
                onAddToCart={() => {
                  addItem(product)
                  openCart()
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            {page > 1 && (
              <Link
                href={`${basePath}?page=${page - 1}${searchParam}`}
                className="px-5 py-2.5 bg-bg-card border border-ui-border font-mono text-sm text-text-dim hover:border-[#C8102E] hover:text-text-base transition-colors"
              >
                ← Назад
              </Link>
            )}
            <span className="font-mono text-sm text-text-dim">
              {page} / {pages}
            </span>
            {page < pages && (
              <Link
                href={`${basePath}?page=${page + 1}${searchParam}`}
                className="px-5 py-2.5 bg-bg-card border border-ui-border font-mono text-sm text-text-dim hover:border-[#C8102E] hover:text-text-base transition-colors"
              >
                Вперёд →
              </Link>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}
