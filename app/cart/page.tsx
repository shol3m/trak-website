import type { Metadata } from 'next'
import CartView from './CartView'

export const metadata: Metadata = {
  title: 'Корзина — ТРАК',
  description: 'Товары в корзине и оформление заказа.',
}

export default function CartPage() {
  return <CartView />
}
