'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion'
import Container from '@/components/layout/Container'
import Button from '@/components/ui/Button'

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('ru-RU')),
    })
    return controls.stop
  }, [inView, target])

  return <span ref={ref}>{display}</span>
}

export default function HeroSection() {
  const { scrollY } = useScroll()
  const yLeft = useTransform(scrollY, [0, 500], [0, -60])
  const yRight = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section className="relative min-h-[90vh] flex items-center bg-[#0D0D0D] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <motion.div
        style={{ y: yLeft }}
        className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-[#1A3A6B]/10 to-transparent pointer-events-none"
      />
      <motion.div
        style={{ y: yRight }}
        className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#C8102E]/5 to-transparent pointer-events-none"
      />

      <Container className="relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="inline-block font-body text-xs text-[#C4922A] uppercase tracking-[0.2em] mb-6 border border-[#C4922A]/40 px-3 py-1">
            Официальный представитель ОАО «ГАЗ» · Субдилер УАЗ, ЗМЗ
          </span>
          <div className="w-12 h-0.5 bg-[#1A3A6B] mb-6" />

          <h1 className="font-heading text-6xl md:text-8xl text-[#F0F0F0] uppercase leading-[0.9] tracking-tight mb-6">
            <AnimatedCounter target={50000} />+<br />
            <span className="text-[#C8102E]">запчастей</span><br />
            в Уфе
          </h1>

          <p className="font-body text-[#888888] text-lg mb-10 max-w-md">
            ВАЗ, ГАЗ, УАЗ, КАМАЗ — в наличии и под заказ. Доставка по России.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/service" size="lg">Наши услуги</Button>
            <Button href="/service" variant="secondary" size="lg">Записаться на СТО</Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
