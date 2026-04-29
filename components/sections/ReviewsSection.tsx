'use client'

import { useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ReviewCard from '@/components/ui/ReviewCard'
import { mockReviews } from '@/lib/mock-data'

export default function ReviewsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="py-20 bg-bg-muted">
      <Container>
        <SectionHeading
          title="Отзывы клиентов"
          subtitle="Что говорят наши клиенты на Яндекс.Картах и 2ГИС"
          align="center"
        />
      </Container>

      <div className="relative mt-10">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex items-stretch">
            {mockReviews.map((review) => (
              <div
                key={review.id}
                className="flex-none basis-full sm:basis-1/2 lg:basis-1/3 px-2 first:pl-4 last:pr-4 sm:first:pl-6 sm:last:pr-6 lg:first:pl-8 lg:last:pr-8"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-bg-card/80 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
          aria-label="Предыдущий отзыв"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-bg-card/80 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
          aria-label="Следующий отзыв"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
