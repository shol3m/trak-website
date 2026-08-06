'use client'

import type { CatalogProduct } from '@/lib/categories'
import { useCartStore } from '@/lib/cart-store'
import Button from '@/components/ui/Button'

export default function AddToCartButton({ product }: { product: CatalogProduct }) {
  const quantity = useCartStore((s) => s.items.find((i) => i.product.id === product.id)?.quantity ?? 0)
  const addItem = useCartStore((s) => s.addItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const openCart = useCartStore((s) => s.openCart)

  if (quantity > 0) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          className="w-11 h-11 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-base"
          aria-label="Уменьшить количество"
        >
          −
        </button>
        <span className="font-mono text-base text-text-base w-6 text-center">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          className="w-11 h-11 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-base"
          aria-label="Увеличить количество"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <Button size="md" onClick={() => { addItem(product); openCart() }}>
      {product.stock > 0 ? 'Добавить в корзину' : 'Заказать'}
    </Button>
  )
}
