'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/layout/Container'
import BookingModal from '@/components/ui/BookingModal'

export default function HeroBanner() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="relative bg-[#1A3A6B] overflow-hidden">
        <Container>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 lg:py-20">
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

            <div className="relative hidden lg:block">
              <div className="relative aspect-[4/3] overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero-2.webp"
                  alt="Автосервис ТРАК"
                  fill
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/50 via-transparent to-transparent" />
              </div>
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
