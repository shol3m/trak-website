'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export type StoryItem = {
  id: string
  icon: ReactNode
  title: string
  description: string
  cta: string
  href: string
}

const DURATION_MS = 5000
const TICK_MS = 50

export default function StoryViewer({
  items,
  startIndex,
  onClose,
}: {
  items: StoryItem[]
  startIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(startIndex)
  const [progress, setProgress] = useState(0)
  const indexRef = useRef(index)
  indexRef.current = index

  function goNext() {
    if (indexRef.current >= items.length - 1) {
      onClose()
      return
    }
    setIndex((i) => i + 1)
    setProgress(0)
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1))
    setProgress(0)
  }

  useEffect(() => {
    setIndex(startIndex)
    setProgress(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex])

  // Autoplay: advance progress on a fixed tick, restarts whenever `index`
  // changes. Capped at 100 here — the transition to the next story (or
  // close, on the last one) happens in a separate effect below, since
  // calling setState on the parent (onClose) from inside this updater
  // function trips React's "setState while rendering" warning.
  useEffect(() => {
    const step = (TICK_MS / DURATION_MS) * 100
    const timer = setInterval(() => {
      setProgress((p) => Math.min(100, p + step))
    }, TICK_MS)
    return () => clearInterval(timer)
  }, [index])

  useEffect(() => {
    if (progress < 100) return
    if (indexRef.current >= items.length - 1) {
      onClose()
    } else {
      setIndex((i) => i + 1)
      setProgress(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const current = items[index]
  if (!current) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />

        <motion.div
          className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-sm sm:aspect-[9/16] bg-[#1A3A6B] overflow-hidden flex flex-col"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { setIndex(i); setProgress(0) }}
                className="flex-1 h-[3px] bg-white/25 overflow-hidden"
                aria-label={`Акция ${i + 1}`}
              >
                <div
                  className="h-full bg-white"
                  style={{ width: `${i < index ? 100 : i === index ? progress : 0}%` }}
                />
              </button>
            ))}
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-3 z-20 text-white/80 hover:text-white transition-colors duration-200"
            aria-label="Закрыть"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Tap zones: left third = prev, right two-thirds = next (roughly IG's layout) */}
          <button className="absolute left-0 top-0 w-1/3 h-full z-10" aria-label="Предыдущая акция" onClick={goPrev} />
          <button className="absolute right-0 top-0 z-10" style={{ left: '33.333%', height: '100%' }} aria-label="Следующая акция" onClick={goNext} />

          <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-8 gap-5 pointer-events-none">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              {current.icon}
            </svg>
            <h3 className="font-heading uppercase text-2xl text-white leading-tight">{current.title}</h3>
            <p className="font-body text-sm text-white/70 leading-relaxed max-w-xs">{current.description}</p>
            <Link
              href={current.href}
              onClick={onClose}
              className="pointer-events-auto bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-6 py-3 transition-colors duration-200"
            >
              {current.cta}
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
