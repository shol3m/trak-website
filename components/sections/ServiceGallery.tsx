'use client'

import { useCallback } from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const photos = [
  { src: '/images/gallery-1.svg', alt: 'Зона обслуживания автомобилей' },
  { src: '/images/gallery-2.svg', alt: 'Диагностическое оборудование' },
  { src: '/images/gallery-3.svg', alt: 'Склад запчастей' },
  { src: '/images/gallery-4.svg', alt: 'Подъёмник для ремонта' },
  { src: '/images/gallery-5.svg', alt: 'Зал ожидания для клиентов' },
  { src: '/images/gallery-6.svg', alt: 'Витрина магазина' },
]

export default function ServiceGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: true })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="py-20 bg-bg-muted">
      <Container>
        <SectionHeading
          title="Наш сервис"
          subtitle="Современное оборудование, опытные мастера, удобный зал ожидания."
        />
      </Container>

      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="flex-none basis-full sm:basis-1/2 lg:basis-1/3 px-2 first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6 lg:first:pl-8 lg:last:pr-8"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-bg-card/80 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
          aria-label="Предыдущее фото"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-bg-card/80 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
          aria-label="Следующее фото"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
