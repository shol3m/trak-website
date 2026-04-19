'use client'

import { motion } from 'framer-motion'
import type { FeaturedProduct } from '@/lib/mock-data'
import Button from './Button'

export default function ProductCard({ product }: { product: FeaturedProduct }) {
  const inStock = product.stock > 0

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-[#111111] border border-[#2A2A2A] hover:border-[#C8102E] hover:shadow-[0_0_20px_rgba(200,16,46,0.2)] transition-colors duration-300 flex flex-col"
    >
      <div className="relative aspect-square bg-[#1E1E1E] flex items-center justify-center text-6xl">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-[#2A2A2A]">📦</span>
        )}
        <span className={`absolute top-2 left-2 font-mono text-[10px] uppercase px-2 py-0.5 ${inStock ? 'bg-green-900/60 text-green-400' : 'bg-[#2A2A2A] text-[#888888]'}`}>
          {inStock ? 'В наличии' : 'Под заказ'}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className="font-mono text-xs text-[#888888]">{product.article}</span>
        <p className="font-body text-[#F0F0F0] text-sm leading-snug flex-1">{product.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-heading text-xl text-[#F0F0F0]">
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          <Button size="sm">{inStock ? 'В корзину' : 'Заказать'}</Button>
        </div>
      </div>
    </motion.div>
  )
}
