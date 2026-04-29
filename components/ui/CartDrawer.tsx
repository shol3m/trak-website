'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore, useCartTotal } from '@/lib/cart-store'
import { formatPhone, normalizePhone, isPhoneValid } from '@/lib/phone-utils'

type View = 'cart' | 'checkout'
type Status = 'idle' | 'loading' | 'success' | 'error'

const NAME_RE = /^[а-яёА-ЯЁa-zA-Z\s\-']{2,50}$/

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartTotal()

  const [view, setView] = useState<View>('cart')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [rateLimitMsg, setRateLimitMsg] = useState('')
  const lastSubmitRef = useRef<number>(0)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  useEffect(() => {
    if (!isOpen) {
      setView('cart')
      setStatus('idle')
      setName('')
      setPhone('')
      setComment('')
      setHoneypot('')
      setNameError('')
      setPhoneError('')
      setRateLimitMsg('')
      setErrorMsg('')
    }
  }, [isOpen])

  function validateName(v: string) {
    if (!v.trim()) return 'Введите имя'
    if (!NAME_RE.test(v.trim())) return 'Только буквы, 2–50 символов'
    return ''
  }

  function validatePhone(v: string) {
    if (!v.trim()) return 'Введите телефон'
    if (!isPhoneValid(v)) return 'Введите корректный номер'
    return ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) return

    const now = Date.now()
    const elapsed = now - lastSubmitRef.current
    if (lastSubmitRef.current && elapsed < 30000) {
      const sec = Math.ceil((30000 - elapsed) / 1000)
      setRateLimitMsg(`Подождите ${sec} секунд`)
      return
    }

    const nErr = validateName(name)
    const pErr = validatePhone(phone)
    setNameError(nErr)
    setPhoneError(pErr)
    if (nErr || pErr) return

    setStatus('loading')
    setErrorMsg('')
    setRateLimitMsg('')
    lastSubmitRef.current = now

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizePhone(phone),
          comment: comment.trim() || undefined,
          honeypot,
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            article: i.product.article,
            price: i.product.price,
            quantity: i.quantity,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Ошибка отправки')
        setStatus('error')
      } else {
        setStatus('success')
        clearCart()
      }
    } catch {
      setErrorMsg('Нет соединения с сервером')
      setStatus('error')
    }
  }

  const inputCls = (hasError: boolean) =>
    `bg-bg-page border ${hasError ? 'border-[#C8102E]' : 'border-ui-border focus:border-[#3B82F6]'} text-text-base font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-text-ghost w-full`

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
                    <span className="text-5xl">🛒</span>
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
                      <button
                        onClick={clearCart}
                        className="font-body text-xs text-text-ghost hover:text-text-dim transition-colors text-center"
                      >
                        Очистить корзину
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {view === 'checkout' && (
              <div className="flex-1 overflow-y-auto">
                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
                    <span className="text-5xl">✅</span>
                    <div>
                      <p className="font-heading text-xl text-text-base uppercase mb-2">Заказ принят!</p>
                      <p className="font-body text-sm text-text-dim">Мы свяжемся с вами в ближайшее время</p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="font-body text-sm text-[#C8102E] hover:underline"
                    >
                      Продолжить покупки
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
                    {/* Honeypot */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      style={{ display: 'none' }}
                      aria-hidden="true"
                    />

                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-xs text-text-dim uppercase tracking-wider">Имя</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (nameError) setNameError('') }}
                        onBlur={() => setNameError(validateName(name))}
                        placeholder="Ваше имя"
                        className={inputCls(!!nameError)}
                      />
                      {nameError && <p className="font-body text-xs text-[#C8102E]">{nameError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-xs text-text-dim uppercase tracking-wider">Телефон</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(formatPhone(e.target.value)); if (phoneError) setPhoneError('') }}
                        onBlur={() => setPhoneError(validatePhone(phone))}
                        placeholder="+7 (000) 000-00-00"
                        className={inputCls(!!phoneError)}
                      />
                      {phoneError && <p className="font-body text-xs text-[#C8102E]">{phoneError}</p>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-body text-xs text-text-dim uppercase tracking-wider">Комментарий</label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Адрес доставки или дополнительная информация"
                        rows={3}
                        maxLength={500}
                        className={`${inputCls(false)} resize-none`}
                      />
                    </div>

                    {/* Order summary */}
                    <div className="border border-ui-border p-4 flex flex-col gap-2">
                      <p className="font-body text-xs text-text-dim uppercase tracking-wider mb-1">Состав заказа</p>
                      {items.map((i) => (
                        <div key={i.product.id} className="flex justify-between gap-2">
                          <span className="font-body text-xs text-text-dim truncate flex-1">{i.product.name} × {i.quantity}</span>
                          <span className="font-mono text-xs text-text-base shrink-0">
                            {(i.product.price * i.quantity).toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-ui-border pt-2 mt-1 flex justify-between">
                        <span className="font-body text-xs text-text-dim">Итого</span>
                        <span className="font-heading text-sm text-text-base">{total.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    </div>

                    {rateLimitMsg && <p className="font-body text-xs text-text-dim">{rateLimitMsg}</p>}
                    {status === 'error' && <p className="font-body text-xs text-[#C8102E]">{errorMsg}</p>}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-[#C8102E] hover:bg-[#9B0B22] disabled:opacity-60 text-white font-body text-sm px-6 py-3 transition-colors duration-200"
                    >
                      {status === 'loading' ? 'Отправка...' : 'Отправить заказ'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
