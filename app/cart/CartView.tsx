'use client'

import { useState } from 'react'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/ui/Breadcrumb'
import CheckoutForm from '@/components/ui/CheckoutForm'
import { useCartStore, useCartTotal } from '@/lib/cart-store'

export default function CartView() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartTotal()
  const [orderPlaced, setOrderPlaced] = useState(false)

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        <Breadcrumb items={[{ name: 'Главная', href: '/' }, { name: 'Корзина' }]} />

        <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase mb-8">
          Корзина
        </h1>

        {items.length === 0 && !orderPlaced ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-ghost">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.976-4.759 2.532-7.334a.75.75 0 00-.734-.916H5.106M7.5 14.25L5.106 5.25M7.5 14.25L4.635 4.5M9.75 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <p className="font-heading text-lg text-text-base uppercase">Корзина пуста</p>
            <Link href="/catalog" className="font-body text-sm text-[#C8102E] hover:underline">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Items — div остаётся в дереве и при пустой корзине (после оформления заказа),
                чтобы сетка не съезжала и CheckoutForm справа не терял позицию/стейт. CheckoutForm
                монтируется один раз и переживает очистку корзины (clearCart вызывается на success),
                поэтому список товаров скрывается через items.length, а не через unmount самой формы. */}
            <div className="flex flex-col gap-3">
              {items.length > 0 && items.map((item) => (
                <div key={item.product.id} className="flex gap-4 items-start bg-bg-card border border-ui-border p-4">
                  <div className="w-16 h-16 bg-bg-muted border border-ui-border flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-text-dim opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.product.article}`}
                      className="font-body text-sm text-text-base leading-snug hover:text-[#C8102E] transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="font-mono text-xs text-text-dim mt-0.5">{item.product.article}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-sm"
                          aria-label="Уменьшить количество"
                        >
                          −
                        </button>
                        <span className="font-mono text-sm text-text-base w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-sm"
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-heading text-base text-text-base">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-text-ghost hover:text-[#C8102E] transition-colors shrink-0 mt-0.5"
                    aria-label="Удалить"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              {items.length > 0 && (
                <div className="flex items-center justify-between pt-3">
                  <span className="font-body text-sm text-text-dim">
                    Итого: <span className="font-heading text-xl text-text-base">{total.toLocaleString('ru-RU')} ₽</span>
                  </span>
                  <button
                    onClick={clearCart}
                    className="font-body text-xs text-text-ghost hover:text-text-dim transition-colors"
                  >
                    Очистить корзину
                  </button>
                </div>
              )}
            </div>

            {/* Checkout */}
            <div className="bg-bg-card border border-ui-border lg:sticky lg:top-24">
              <div className="px-6 py-5 border-b border-ui-border">
                <h2 className="font-heading text-lg text-text-base uppercase">Оформить заказ</h2>
              </div>
              <CheckoutForm onOrderPlaced={() => setOrderPlaced(true)} />
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
