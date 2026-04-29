'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const NAME_RE = /^[а-яёА-ЯЁa-zA-Z\s\-']{2,50}$/

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  let d = digits
  if (d.startsWith('8')) d = '7' + d.slice(1)
  if (d.startsWith('7')) d = d.slice(0, 11)
  else d = d.slice(0, 11)

  if (d.length === 0) return ''
  let result = '+7'
  if (d.length <= 1) return result
  result += ' (' + d.slice(1, 4)
  if (d.length <= 4) return result
  result += ') ' + d.slice(4, 7)
  if (d.length <= 7) return result
  result += '-' + d.slice(7, 9)
  if (d.length <= 9) return result
  result += '-' + d.slice(9, 11)
  return result
}

function normalizePhone(formatted: string): string {
  const digits = formatted.replace(/\D/g, '')
  if (digits.startsWith('8')) return '+7' + digits.slice(1)
  if (digits.startsWith('7')) return '+' + digits
  return '+' + digits
}

function isPhoneValid(formatted: string): boolean {
  return formatted.replace(/\D/g, '').length === 11
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [carModel, setCarModel] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [phoneError, setPhoneError] = useState('')
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
      setName('')
      setPhone('')
      setCarModel('')
      setHoneypot('')
      setErrorMsg('')
      setNameError('')
      setPhoneError('')
      setRateLimitMsg('')
    }
  }, [isOpen])

  function validateName(v: string): string {
    if (!v.trim()) return 'Введите имя'
    if (!NAME_RE.test(v.trim())) return 'Только буквы, 2–50 символов'
    return ''
  }

  function validatePhone(v: string): string {
    if (!v.trim()) return 'Введите телефон'
    if (!isPhoneValid(v)) return 'Введите корректный номер'
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
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalizePhone(phone),
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
              Запись
            </span>
            <h3 className="font-heading text-2xl text-text-base uppercase mb-6">
              Записаться на СТО
            </h3>

            {status === 'success' ? (
              <p className="font-body text-sm text-text-base leading-relaxed">
                Заявка принята! Мы свяжемся с вами.
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
                    Имя
                  </label>
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
                    Марка и модель авто
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
                  {status === 'loading' ? 'Отправка...' : 'Отправить заявку'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
