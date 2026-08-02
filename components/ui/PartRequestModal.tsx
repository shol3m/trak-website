'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatPhone, normalizePhone, isPhoneValid } from '@/lib/phone-utils'

interface PartRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function PartRequestModal({ isOpen, onClose }: PartRequestModalProps) {
  const [phone, setPhone] = useState('')
  const [part, setPart] = useState('')
  const [carModel, setCarModel] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [partError, setPartError] = useState('')
  const [rateLimitMsg, setRateLimitMsg] = useState('')
  const lastSubmitRef = useRef<number>(0)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle')
      setPhone('')
      setPart('')
      setCarModel('')
      setHoneypot('')
      setErrorMsg('')
      setPhoneError('')
      setPartError('')
      setRateLimitMsg('')
    }
  }, [isOpen])

  function validatePhone(v: string): string {
    if (!v.trim()) return 'Введите телефон'
    if (!isPhoneValid(v)) return 'Введите корректный номер'
    return ''
  }

  function validatePart(v: string): string {
    if (!v.trim()) return 'Опишите, какая деталь нужна'
    if (v.trim().length > 300) return 'Слишком длинное описание'
    return ''
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (honeypot) return

    const now = Date.now()
    const elapsed = now - lastSubmitRef.current
    if (lastSubmitRef.current && elapsed < 30000) {
      const sec = Math.ceil((30000 - elapsed) / 1000)
      setRateLimitMsg(`Подождите ${sec} секунд перед повторной отправкой`)
      return
    }

    const pErr = validatePhone(phone)
    const partErr = validatePart(part)
    setPhoneError(pErr)
    setPartError(partErr)
    if (pErr || partErr) return

    setStatus('loading')
    setErrorMsg('')
    setRateLimitMsg('')
    lastSubmitRef.current = now

    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalizePhone(phone),
          part: part.trim(),
          carModel: carModel.trim() || undefined,
          honeypot,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Ошибка отправки')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Нет соединения с сервером')
      setStatus('error')
    }
  }

  const inputCls = (hasError: boolean) =>
    `bg-bg-page border ${hasError ? 'border-[#C8102E]' : 'border-ui-border focus:border-[#3B82F6]'} text-text-base font-body text-sm px-4 py-3 outline-none transition-colors duration-200 placeholder:text-text-ghost`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-[#111111] border border-[#1A3A6B] p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-text-dim hover:text-text-base transition-colors duration-200"
              aria-label="Закрыть"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <span className="font-body text-xs text-[#3B82F6] uppercase tracking-[0.2em] mb-3 block">
              Подбор запчасти
            </span>
            <h3 className="font-heading text-2xl text-text-base uppercase mb-6">
              Поможем найти деталь
            </h3>

            {status === 'success' ? (
              <p className="font-body text-sm text-text-base leading-relaxed">
                Заявка принята! Наш эксперт свяжется с вами и подберёт деталь.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* honeypot */}
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
                  <label className="font-body text-xs text-text-dim uppercase tracking-wider">
                    Какая деталь нужна
                  </label>
                  <textarea
                    value={part}
                    onChange={(e) => { setPart(e.target.value); if (partError) setPartError('') }}
                    onBlur={() => setPartError(validatePart(part))}
                    placeholder="Опишите деталь своими словами или укажите артикул, если знаете"
                    rows={3}
                    className={`${inputCls(!!partError)} resize-none`}
                  />
                  {partError && <p className="font-body text-xs text-[#C8102E]">{partError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs text-text-dim uppercase tracking-wider">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() => setPhoneError(validatePhone(phone))}
                    placeholder="+7 (000) 000-00-00"
                    className={inputCls(!!phoneError)}
                  />
                  {phoneError && <p className="font-body text-xs text-[#C8102E]">{phoneError}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-body text-xs text-text-dim uppercase tracking-wider">
                    Марка и модель авто (необязательно)
                  </label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Например: ГАЗель Next"
                    className={inputCls(false)}
                  />
                </div>

                {rateLimitMsg && (
                  <p className="font-body text-xs text-text-dim">{rateLimitMsg}</p>
                )}
                {status === 'error' && (
                  <p className="font-body text-xs text-[#C8102E]">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[#C8102E] hover:bg-[#9B0B22] disabled:opacity-60 text-white font-body text-sm px-6 py-3 transition-colors duration-200 mt-2"
                >
                  {status === 'loading' ? 'Отправка...' : 'Найти деталь'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
