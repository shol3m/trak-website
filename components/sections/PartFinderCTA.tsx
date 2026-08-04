'use client'

import { useState } from 'react'
import Image from 'next/image'
import Container from '@/components/layout/Container'
import PartRequestModal from '@/components/ui/PartRequestModal'

export default function PartFinderCTA() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section className="py-20 bg-bg-muted">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-[#1A3A6B] flex flex-col md:flex-row items-stretch">
          <div className="relative w-full md:w-[280px] shrink-0 min-h-[220px] md:min-h-0">
            <Image
              src="/images/partfinder-expert.png"
              alt="Эксперт ТРАК поможет подобрать запчасть"
              fill
              sizes="(max-width: 768px) 100vw, 280px"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_55%,#1A3A6B_100%)] md:bg-[linear-gradient(to_right,transparent_55%,#1A3A6B_100%)]" />
          </div>

          <div className="relative z-10 flex-1 p-8 md:p-12 flex flex-col justify-center">
            <span className="font-body text-xs text-[#C8102E] uppercase tracking-widest mb-3 block">
              Помощь эксперта
            </span>
            <h2 className="font-heading text-3xl md:text-4xl text-white uppercase leading-tight mb-4 max-w-lg">
              Не знаете артикул нужной детали?
            </h2>
            <p className="font-body text-white/60 text-base mb-8 max-w-md">
              Опишите деталь своими словами или укажите марку и модель авто — специалист проверит совместимость и подберёт вариант в наличии или под заказ.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-6 py-3 transition-colors duration-200 whitespace-nowrap"
              >
                Подобрать запчасть
              </button>
              <a
                href="tel:+73472237208"
                className="font-heading text-2xl text-white hover:text-[#C8102E] transition-colors duration-200"
              >
                +7 347 223-72-08
              </a>
            </div>
          </div>
        </div>
      </Container>

      <PartRequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
