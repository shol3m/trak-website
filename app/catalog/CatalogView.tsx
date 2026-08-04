'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CatalogProduct } from '@/lib/categories'
import { VEHICLE_MAKE_BRANDS, ALL_VEHICLE_MAKES, ALL_PART_BRANDS } from '@/lib/categories'
import type { ReactNode } from 'react'
import { useCartStore } from '@/lib/cart-store'
import ProductCard from '@/components/ui/ProductCard'
import BrandSelect from '@/components/ui/BrandSelect'
import Container from '@/components/layout/Container'

const SORT_OPTIONS = [
  { value: '', label: 'По умолчанию' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
]

interface CatalogViewProps {
  products: CatalogProduct[]
  total: number
  pages: number
  page: number
  search: string
  sort: string
  brands: string[]
  inStock?: boolean
  priceMin?: number
  priceMax?: number
  title: string
  basePath: string
  topSlot?: ReactNode
  error?: boolean
}

function ProductListRow({
  product,
  href,
  onAddToCart,
}: {
  product: CatalogProduct
  href?: string
  onAddToCart?: () => void
}) {
  const inStock = product.stock > 0
  return (
    <div className="group flex items-center gap-3 bg-bg-card border border-ui-border hover:border-[#C8102E]/50 px-4 py-3 transition-colors duration-150">
      <div className="w-10 h-10 shrink-0 bg-bg-muted flex items-center justify-center">
        <svg className="w-5 h-5 text-text-dim opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-mono text-[10px] text-text-dim block leading-none mb-0.5">{product.article}</span>
        {href ? (
          <Link href={href}>
            <p className="font-body text-sm text-text-base leading-snug group-hover:text-[#C8102E] transition-colors line-clamp-1">{product.name}</p>
          </Link>
        ) : (
          <p className="font-body text-sm text-text-base leading-snug line-clamp-1">{product.name}</p>
        )}
      </div>
      <span className={`shrink-0 font-body text-[10px] uppercase px-2 py-0.5 hidden sm:block ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-400'}`}>
        {inStock ? 'В наличии' : 'Под заказ'}
      </span>
      <span className="shrink-0 font-heading text-sm text-text-base w-24 text-right">
        {product.price > 0 ? `${product.price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
      </span>
      <button
        onClick={onAddToCart}
        className="shrink-0 bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-xs px-3 py-2 transition-colors duration-200"
      >
        {inStock ? 'В корзину' : 'Заказать'}
      </button>
    </div>
  )
}

export default function CatalogView({
  products,
  total,
  pages,
  page,
  search,
  sort,
  brands,
  inStock,
  priceMin,
  priceMax,
  title,
  basePath,
  topSlot,
  error,
}: CatalogViewProps) {
  const router = useRouter()
  const [query, setQuery] = useState(search)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [priceMinInput, setPriceMinInput] = useState(priceMin !== undefined ? String(priceMin) : '')
  const [priceMaxInput, setPriceMaxInput] = useState(priceMax !== undefined ? String(priceMax) : '')
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  // Sync query when search prop changes (after navigation)
  useEffect(() => {
    setQuery(search)
  }, [search])

  useEffect(() => {
    setPriceMinInput(priceMin !== undefined ? String(priceMin) : '')
    setPriceMaxInput(priceMax !== undefined ? String(priceMax) : '')
  }, [priceMin, priceMax])

  // Every call site passes the full current filter state explicitly — q/sort
  // omit-if-falsy, but brand/inStock/price are "sticky" and must be repeated
  // on every navigation (e.g. changing sort) or they'd silently reset.
  function buildUrl(params: {
    q?: string
    sort?: string
    page?: number
    brands?: string[]
    inStock?: boolean
    priceMin?: string
    priceMax?: string
  }) {
    const qs = new URLSearchParams()
    if (params.q) qs.set('q', params.q)
    if (params.sort) qs.set('sort', params.sort)
    if (params.page && params.page > 1) qs.set('page', String(params.page))
    if (params.brands && params.brands.length > 0) qs.set('brand', params.brands.join(','))
    if (params.inStock) qs.set('inStock', '1')
    if (params.priceMin) qs.set('priceMin', params.priceMin)
    if (params.priceMax) qs.set('priceMax', params.priceMax)
    const str = qs.toString()
    return str ? `${basePath}?${str}` : basePath
  }

  const currentPriceMin = priceMin !== undefined ? String(priceMin) : undefined
  const currentPriceMax = priceMax !== undefined ? String(priceMax) : undefined

  // Debounced search — intentionally keyed only on `query`. Including
  // router/sort/search/buildUrl would reset or refire the timer on every
  // unrelated render and break the debounce.
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed === search) return
    const timer = setTimeout(() => {
      router.push(buildUrl({
        q: trimmed || undefined,
        sort: sort || undefined,
        brands,
        inStock,
        priceMin: currentPriceMin,
        priceMax: currentPriceMax,
      }))
    }, 350)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  function handleSortChange(newSort: string) {
    router.push(buildUrl({
      q: search || undefined,
      sort: newSort || undefined,
      brands,
      inStock,
      priceMin: currentPriceMin,
      priceMax: currentPriceMax,
    }))
  }

  function handleInStockChange(checked: boolean) {
    router.push(buildUrl({
      q: search || undefined,
      sort: sort || undefined,
      brands,
      inStock: checked,
      priceMin: currentPriceMin,
      priceMax: currentPriceMax,
    }))
  }

  function handleBrandChange(newBrands: string[]) {
    router.push(buildUrl({
      q: search || undefined,
      sort: sort || undefined,
      brands: newBrands,
      inStock,
      priceMin: currentPriceMin,
      priceMax: currentPriceMax,
    }))
  }

  function handleRemoveBrand(toRemove: string) {
    handleBrandChange(brands.filter((b) => b !== toRemove))
  }

  function handlePriceApply() {
    router.push(buildUrl({
      q: search || undefined,
      sort: sort || undefined,
      brands,
      inStock,
      priceMin: priceMinInput.trim() || undefined,
      priceMax: priceMaxInput.trim() || undefined,
    }))
  }

  function handleResetFilters() {
    setPriceMinInput('')
    setPriceMaxInput('')
    router.push(buildUrl({ q: search || undefined, sort: sort || undefined }))
  }

  const hasActiveFilters = Boolean(brands.length > 0 || inStock || priceMin !== undefined || priceMax !== undefined)

  const searchParam = search ? `&q=${encodeURIComponent(search)}` : ''
  const sortParam = sort ? `&sort=${sort}` : ''
  const brandParam = brands.length > 0 ? `&brand=${encodeURIComponent(brands.join(','))}` : ''
  const inStockParam = inStock ? '&inStock=1' : ''
  const priceMinParam = priceMin !== undefined ? `&priceMin=${priceMin}` : ''
  const priceMaxParam = priceMax !== undefined ? `&priceMax=${priceMax}` : ''

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        {topSlot}

        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase mb-1">
            {title}
          </h1>
          <p className="font-body text-sm text-text-dim">
            {error
              ? 'Ошибка загрузки'
              : total > 0
                ? `${total.toLocaleString('ru-RU')} товаров`
                : 'Товары не найдены'}
          </p>
          {brands.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => handleRemoveBrand(b)}
                  className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-wide text-text-dim border border-ui-border px-3 py-1.5 hover:border-[#C8102E] hover:text-text-base transition-colors"
                >
                  {VEHICLE_MAKE_BRANDS.has(b) ? 'Марка' : 'Бренд'}: {b}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toolbar: search + sort + view toggle */}
        <div className="flex gap-2 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim w-4 h-4 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Артикул или название..."
              className="w-full pl-9 pr-9 py-2.5 bg-bg-card border border-ui-border text-text-base font-body text-sm focus:outline-none focus:border-[#C8102E] transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-base transition-colors"
                aria-label="Сбросить"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2.5 bg-bg-card border border-ui-border text-text-dim font-body text-xs focus:outline-none focus:border-[#C8102E] transition-colors cursor-pointer hover:border-[#C8102E]/50"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex border border-ui-border overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-2.5 transition-colors duration-150 ${view === 'grid' ? 'bg-[#C8102E] text-white' : 'bg-bg-card text-text-dim hover:text-text-base'}`}
              aria-label="Сетка"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-2.5 transition-colors duration-150 ${view === 'list' ? 'bg-[#C8102E] text-white' : 'bg-bg-card text-text-dim hover:text-text-base'}`}
              aria-label="Список"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="5" y1="4" x2="14" y2="4"/><line x1="5" y1="8" x2="14" y2="8"/><line x1="5" y1="12" x2="14" y2="12"/>
                <circle cx="2" cy="4" r="1" fill="currentColor" stroke="none"/><circle cx="2" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="2" cy="12" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Filters: in stock + brand/mark + price range */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <label className="flex items-center gap-2 px-3 py-2.5 bg-bg-card border border-ui-border font-body text-xs text-text-dim hover:border-[#C8102E]/50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(inStock)}
              onChange={(e) => handleInStockChange(e.target.checked)}
              className="accent-[#C8102E] w-3.5 h-3.5"
            />
            Только в наличии
          </label>

          <BrandSelect
            value={brands}
            makes={ALL_VEHICLE_MAKES}
            brands={ALL_PART_BRANDS}
            onChange={handleBrandChange}
          />

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Цена от"
              value={priceMinInput}
              onChange={(e) => setPriceMinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
              className="w-24 px-2.5 py-2.5 bg-bg-card border border-ui-border text-text-base font-body text-xs focus:outline-none focus:border-[#C8102E] transition-colors"
            />
            <span className="text-text-ghost">—</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Цена до"
              value={priceMaxInput}
              onChange={(e) => setPriceMaxInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePriceApply()}
              className="w-24 px-2.5 py-2.5 bg-bg-card border border-ui-border text-text-base font-body text-xs focus:outline-none focus:border-[#C8102E] transition-colors"
            />
            <button
              onClick={handlePriceApply}
              className="px-3 py-2.5 bg-bg-card border border-ui-border font-body text-xs text-text-dim hover:border-[#C8102E] hover:text-text-base transition-colors"
            >
              Ок
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="font-body text-xs text-text-dim hover:text-[#C8102E] underline transition-colors"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        {/* Products */}
        {error ? (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-text-dim">
              Не удалось загрузить каталог, попробуйте обновить страницу через минуту
            </p>
            <button
              onClick={() => router.refresh()}
              className="mt-4 font-body text-xs text-[#C8102E] hover:underline"
            >
              Обновить
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-text-dim">
              {search
                ? `По запросу «${search}» ничего не найдено`
                : 'Товары не найдены'}
            </p>
            {search && (
              <button
                onClick={() => setQuery('')}
                className="mt-4 font-body text-xs text-[#C8102E] hover:underline"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                href={`/product/${product.article}`}
                onAddToCart={() => { addItem(product); openCart() }}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-1"
          >
            {products.map((product) => (
              <ProductListRow
                key={product.id}
                product={product}
                href={`/product/${product.article}`}
                onAddToCart={() => { addItem(product); openCart() }}
              />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            {page > 1 && (
              <Link
                href={`${basePath}?page=${page - 1}${searchParam}${sortParam}${brandParam}${inStockParam}${priceMinParam}${priceMaxParam}`}
                className="px-5 py-2.5 bg-bg-card border border-ui-border font-body text-sm text-text-dim hover:border-[#C8102E] hover:text-text-base transition-colors"
              >
                ← Назад
              </Link>
            )}
            <span className="font-body text-sm text-text-dim">
              {page} / {pages}
            </span>
            {page < pages && (
              <Link
                href={`${basePath}?page=${page + 1}${searchParam}${sortParam}${brandParam}${inStockParam}${priceMinParam}${priceMaxParam}`}
                className="px-5 py-2.5 bg-bg-card border border-ui-border font-body text-sm text-text-dim hover:border-[#C8102E] hover:text-text-base transition-colors"
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
