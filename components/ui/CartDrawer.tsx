'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore, useCartTotal } from '@/lib/cart-store'
import CheckoutForm from './CheckoutForm'

type View = 'cart' | 'checkout'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartTotal()

  const [view, setView] = useState<View>('cart')

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  useEffect(() => {
    if (!isOpen) setView('cart')
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />

          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md z-[100] bg-white dark:bg-[#111111] border-l border-ui-border flex flex-col"
            initial={{ x: 420, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 420, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-ui-border shrink-0">
              <div className="flex items-center gap-3">
                {view === 'checkout' && (
                  <button
                    onClick={() => setView('cart')}
                    className="text-text-dim hover:text-text-base transition-colors"
                    aria-label="Назад"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                  </button>
                )}
                <h2 className="font-heading text-lg text-text-base uppercase">
                  {view === 'cart' ? `Корзина (${items.reduce((s, i) => s + i.quantity, 0)})` : 'Оформить заказ'}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-text-dim hover:text-text-base transition-colors"
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            {view === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-ghost">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.976-4.759 2.532-7.334a.75.75 0 00-.734-.916H5.106M7.5 14.25L5.106 5.25M7.5 14.25L4.635 4.5M9.75 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <p className="font-heading text-lg text-text-base uppercase">Корзина пуста</p>
                    <Link
                      href="/catalog"
                      onClick={closeCart}
                      className="font-body text-sm text-[#C8102E] hover:underline"
                    >
                      Перейти в каталог
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex gap-4 items-start">
                          <div className="w-14 h-14 bg-bg-muted border border-ui-border flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-text-dim opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-text-base leading-snug line-clamp-2">{item.product.name}</p>
                            <p className="font-mono text-xs text-text-dim mt-0.5">{item.product.article}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-7 h-7 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-sm"
                                >
                                  −
                                </button>
                                <span className="font-mono text-sm text-text-base w-5 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-7 h-7 border border-ui-border text-text-base hover:border-[#C8102E] transition-colors flex items-center justify-center font-body text-sm"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-heading text-sm text-text-base">
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
                    </div>

                    <div className="px-6 py-5 border-t border-ui-border shrink-0 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-sm text-text-dim">Итого</span>
                        <span className="font-heading text-2xl text-text-base">
                          {total.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <button
                        onClick={() => setView('checkout')}
                        className="w-full bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-6 py-3 transition-colors duration-200"
                      >
                        Оформить заказ
                      </button>
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          href="/cart"
                          onClick={closeCart}
                          className="font-body text-xs text-text-dim hover:text-text-base transition-colors"
                        >
                          Перейти в корзину
                        </Link>
                        <span className="text-text-ghost">·</span>
                        <button
                          onClick={clearCart}
                          className="font-body text-xs text-text-ghost hover:text-text-dim transition-colors"
                        >
                          Очистить корзину
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {view === 'checkout' && (
              <div className="flex-1 overflow-y-auto">
                <CheckoutForm onSuccessContinue={closeCart} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
