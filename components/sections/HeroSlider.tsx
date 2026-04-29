'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'
import Container from '@/components/layout/Container'
import BookingModal from '@/components/ui/BookingModal'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
  {
    id: 1,
    image: '/images/hero-1.webp',
    badge: 'Магазин запчастей',
    title: '50 000+',
    titleAccent: 'запчастей',
    titleSuffix: 'в наличии',
    subtitle: 'ВАЗ, ГАЗ, УАЗ, КАМАЗ — в наличии и под заказ. Доставка по России.',
    cta: { label: 'В каталог', href: '/catalog', modal: false },
    overlay: 'from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/30',
  },
  {
    id: 2,
    image: '/images/hero-2.webp',
    badge: 'Автосервис',
    title: 'Профессиональный',
    titleAccent: 'ремонт',
    titleSuffix: 'и ТО',
    subtitle: 'Опытные мастера, современное оборудование. Гарантия на все виды работ.',
    cta: { label: 'Записаться на СТО', href: '', modal: true },
    overlay: 'from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/30',
  },
  {
    id: 3,
    image: '/images/hero-3.webp',
    badge: 'Подбор запчастей',
    title: 'Подбор по',
    titleAccent: 'марке',
    titleSuffix: 'и VIN',
    subtitle: 'Укажите марку, модель и год — подберём подходящие запчасти быстро.',
    cta: { label: 'Подобрать запчасть', href: '/catalog', modal: false },
    overlay: 'from-[#0D0D0D]/80 via-[#0D0D0D]/60 to-[#0D0D0D]/30',
  },
]

export default function HeroSlider() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section className="relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={{
            nextEl: '.hero-next',
            prevEl: '.hero-prev',
          }}
          pagination={{ clickable: true, el: '.hero-pagination' }}
          loop
          className="hero-swiper"
          style={{ minHeight: '90vh' }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative min-h-[90vh] flex items-center bg-[#0D0D0D]">
                {/* Background image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.image}
                    alt={slide.badge}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
                </div>

                {/* Noise texture */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  }}
                />

                <Container className="relative z-10 py-24">
                  <div className="max-w-2xl">
                    <span className="inline-block font-body text-xs text-[#C4922A] uppercase tracking-[0.2em] mb-6 border border-[#C4922A]/40 px-3 py-1 bg-[#0D0D0D]/50">
                      {slide.badge}
                    </span>
                    <div className="w-12 h-0.5 bg-[#1A3A6B] mb-6" />

                    <h1
                      className="font-heading text-5xl md:text-7xl text-[#F0F0F0] uppercase leading-[0.9] tracking-tight mb-6"
                      style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}
                    >
                      {slide.title}<br />
                      <span className="text-[#C8102E]">{slide.titleAccent}</span><br />
                      {slide.titleSuffix}
                    </h1>

                    <p
                      className="font-body text-[#CCCCCC] text-lg mb-10 max-w-md"
                      style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
                    >
                      {slide.subtitle}
                    </p>

                    {slide.cta.modal ? (
                      <button
                        onClick={() => setModalOpen(true)}
                        className="inline-block bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-base px-8 py-4 transition-colors duration-200"
                      >
                        {slide.cta.label}
                      </button>
                    ) : (
                      <Link
                        href={slide.cta.href}
                        className="inline-block bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-base px-8 py-4 transition-colors duration-200"
                      >
                        {slide.cta.label}
                      </Link>
                    )}
                  </div>
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation */}
        <button
          className="hero-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#0D0D0D]/60 hover:bg-[#C8102E] border border-[#2A2A2A] hover:border-[#C8102E] transition-colors duration-200"
          aria-label="Предыдущий слайд"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="#F0F0F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className="hero-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-[#0D0D0D]/60 hover:bg-[#C8102E] border border-[#2A2A2A] hover:border-[#C8102E] transition-colors duration-200"
          aria-label="Следующий слайд"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3l5 5-5 5" stroke="#F0F0F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Pagination */}
        <div className="hero-pagination absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
      </section>

      <style jsx global>{`
        .hero-swiper .swiper-pagination-bullet {
          width: 24px;
          height: 3px;
          border-radius: 0;
          background: #F0F0F0;
          opacity: 0.3;
          transition: opacity 0.2s, background 0.2s;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background: #C8102E;
          opacity: 1;
        }
      `}</style>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
