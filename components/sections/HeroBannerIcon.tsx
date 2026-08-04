'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import BookingModal from '@/components/ui/BookingModal'

// Альтернатива HeroBanner: контурная иконка машины в стиле остальных
// SVG-иконок сайта (stroke, currentColor) вместо фото или заливки.
export default function HeroBannerIcon() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="relative bg-[#1A3A6B] overflow-hidden">
        <Container>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-5">
                Всё для ремонта<br />вашего автомобиля
              </h1>
              <p className="font-body text-white/70 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                Более 50 000 позиций в наличии: запчасти для ГАЗ, УАЗ, ВАЗ, КАМАЗ и других марок, автохимия и моторные масла. Плюс собственный автосервис — от диагностики до капитального ремонта.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/catalog"
                  className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-base px-8 py-4 transition-colors duration-200"
                >
                  В каталог
                </Link>
                <button
                  onClick={() => setModalOpen(true)}
                  className="border border-white/30 hover:border-white text-white font-body text-base px-8 py-4 transition-colors duration-200"
                >
                  Записаться на СТО
                </button>
              </div>
            </div>

            <div className="relative hidden lg:flex justify-center items-end h-[280px]">
              <CarIllustration />
            </div>
          </div>
        </Container>

        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 w-11 h-11 rounded-full bg-[#C8102E] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5L16 9.5"/>
          </svg>
        </div>
      </section>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}

function CarIllustration() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-full max-w-[380px] text-white"
    >
      <div className="absolute right-full top-[68%] -translate-y-1/2 mr-4 flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-[2px] bg-white/30 rounded-full ml-auto"
            style={{ width: 30 - i * 8 }}
            animate={{ x: [-8, 8, -8], opacity: [0.1, 0.45, 0.1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          />
        ))}
      </div>

      <svg viewBox="0 0 240 130" fill="none" className="w-full h-auto">
        {/* кузов */}
        <rect x="20" y="70" width="200" height="26" rx="13" stroke="currentColor" strokeWidth="2" />

        {/* кабина */}
        <path
          d="M74 70 L89 37 Q94 31 102 31 L148 31 Q156 31 161 37 L176 70"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="112" y1="34" x2="103" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="138" y1="34" x2="147" y2="70" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* дверь + ручка */}
        <line x1="125" y1="70" x2="125" y2="94" stroke="currentColor" strokeWidth="1.5" />
        <line x1="129" y1="80" x2="136" y2="80" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

        {/* фара + стоп-сигнал */}
        <circle cx="26" cy="83" r="2.5" fill="currentColor" />
        <rect x="209" y="80" width="7" height="5" rx="1" fill="#C8102E" />

        <Wheel cx={62} cy={96} />
        <Wheel cx={178} cy={96} />
      </svg>
    </motion.div>
  )
}

function Wheel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r="17" stroke="currentColor" strokeWidth="2" fill="#1A3A6B" />
      <motion.g
        style={{ transformOrigin: `${cx}px ${cy}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx={cx} cy={cy} r="6" stroke="currentColor" strokeWidth="1.5" />
        <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} stroke="currentColor" strokeWidth="1.25" />
        <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} stroke="currentColor" strokeWidth="1.25" />
      </motion.g>
    </>
  )
}
