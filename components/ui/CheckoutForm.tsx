'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useCartStore, useCartTotal } from '@/lib/cart-store'
import { formatPhone, normalizePhone, isPhoneValid } from '@/lib/phone-utils'

type Status = 'idle' | 'loading' | 'success' | 'error'

const NAME_RE = /^[а-яёА-ЯЁa-zA-Z\s\-']{2,50}$/

type CheckoutFormProps = {
  onSuccessContinue?: () => void
  onOrderPlaced?: () => void
}

export default function CheckoutForm({ onSuccessContinue, onOrderPlaced }: CheckoutFormProps) {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const total = useCartTotal()

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
        onOrderPlaced?.()
        clearCart()
      }
    } catch {
      setErrorMsg('Нет соединения с сервером')
      setStatus('error')
    }
  }

  const inputCls = (hasError: boolean) =>
    `bg-bg-page border ${hasError ? 'border-[#C8102E]' : 'border-ui-border focus:border-[#3B82F6]'} text-text-base font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-text-ghost w-full`

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#16A34A]">
          <circle cx="12" cy="12" r="9.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12.5l2.5 2.5 5-5.5" />
        </svg>
        <div>
          <p className="font-heading text-xl text-text-base uppercase mb-2">Заказ принят!</p>
          <p className="font-body text-sm text-text-dim">Мы свяжемся с вами в ближайшее время</p>
        </div>
        {onSuccessContinue ? (
          <button onClick={onSuccessContinue} className="font-body text-sm text-[#C8102E] hover:underline">
            Продолжить покупки
          </button>
        ) : (
          <Link href="/catalog" className="font-body text-sm text-[#C8102E] hover:underline">
            Продолжить покупки
          </Link>
        )}
      </div>
    )
  }

  return (
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
          placeholder="Дополнительная информация по заказу"
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
  )
}
