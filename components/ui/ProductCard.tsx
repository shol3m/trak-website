'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { CatalogProduct } from '@/lib/categories'
import Button from './Button'

type ProductCardProps = {
  product: CatalogProduct
  href?: string
  onAddToCart?: () => void
}

export default function ProductCard({ product, href, onAddToCart }: ProductCardProps) {
  const inStock = product.stock > 0
  const imageUrl = product.images?.[0]
  const [imgError, setImgError] = useState(false)

  const placeholder = (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-text-dim opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )

  const imageBlock = (
    <div className="relative aspect-square bg-bg-muted flex items-center justify-center">
      {imageUrl && !imgError ? (
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 25vw"
          onError={() => setImgError(true)}
        />
      ) : placeholder}
      <span className={`absolute top-2 left-2 font-mono text-[10px] uppercase px-2 py-0.5 ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-bg-muted text-text-dim'}`}>
        {inStock ? 'В наличии' : 'Под заказ'}
      </span>
      {product.brand && (
        <span className="absolute top-2 right-2 font-mono text-[10px] uppercase px-2 py-0.5 bg-[#C8102E]/10 text-[#C8102E] max-w-[90px] truncate">
          {product.brand}
        </span>
      )}
    </div>
  )

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card border border-ui-border hover:border-[#C8102E] hover:shadow-[0_0_20px_rgba(200,16,46,0.15)] transition-colors duration-300 flex flex-col"
    >
      {href ? <Link href={href}>{imageBlock}</Link> : imageBlock}

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2 flex-1">
        <span className="font-mono text-xs text-text-dim">{product.article}</span>
        {href ? (
          <Link href={href} className="flex-1">
            <p className="font-body text-text-base text-sm leading-snug hover:text-[#C8102E] transition-colors">
              {product.name}
            </p>
          </Link>
        ) : (
          <p className="font-body text-text-base text-sm leading-snug flex-1">{product.name}</p>
        )}
        <div className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-base sm:text-xl text-text-base">
            {product.price > 0 ? `${product.price.toLocaleString('ru-RU')} ₽` : 'По запросу'}
          </span>
          <Button size="sm" onClick={onAddToCart} className="w-full sm:w-auto text-xs">
            {inStock ? 'В корзину' : 'Заказать'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
