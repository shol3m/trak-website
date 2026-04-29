'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import type { FeaturedProduct, MockProduct } from '@/lib/mock-data'
import Button from './Button'

type ProductCardProps = {
  product: FeaturedProduct | MockProduct
  onAddToCart?: (product: MockProduct) => void
}

function isMockProduct(p: FeaturedProduct | MockProduct): p is MockProduct {
  return 'brand' in p
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = product.stock > 0
  const imageUrl = isMockProduct(product) ? product.images?.[0] : product.imageUrl
  const [imgError, setImgError] = useState(false)

  function handleAddToCart() {
    if (isMockProduct(product) && onAddToCart) {
      onAddToCart(product)
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-card border border-ui-border hover:border-[#C8102E] hover:shadow-[0_0_20px_rgba(200,16,46,0.15)] transition-colors duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-bg-muted flex items-center justify-center text-6xl">
        {imageUrl && !imgError ? (
          <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 25vw" onError={() => setImgError(true)} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-text-dim opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        )}
        <span className={`absolute top-2 left-2 font-mono text-[10px] uppercase px-2 py-0.5 ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-bg-muted text-text-dim'}`}>
          {inStock ? 'В наличии' : 'Под заказ'}
        </span>
        {isMockProduct(product) && (
          <span className="absolute top-2 right-2 font-mono text-[10px] uppercase px-2 py-0.5 bg-[#C8102E]/10 text-[#C8102E]">
            {product.brand}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="font-mono text-xs text-text-dim">{product.article}</span>
        <p className="font-body text-text-base text-sm leading-snug flex-1">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-heading text-xl text-text-base">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <Button size="sm" onClick={handleAddToCart}>
            {inStock ? 'В корзину' : 'Заказать'}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
