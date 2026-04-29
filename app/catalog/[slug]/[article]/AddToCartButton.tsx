'use client'

import { useState } from 'react'
import type { MockProduct } from '@/lib/mock-data'
import { useCartStore } from '@/lib/cart-store'
import Button from '@/components/ui/Button'

export default function AddToCartButton({ product }: { product: MockProduct }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem(product)
    openCart()
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button size="lg" onClick={handleClick}>
      {added ? '✓ Добавлено в корзину' : product.stock > 0 ? 'Добавить в корзину' : 'Заказать'}
    </Button>
  )
}
