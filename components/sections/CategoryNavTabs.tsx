'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Container from '@/components/layout/Container'
import type { TreeCategory } from '@/lib/db-catalog'

export default function CategoryNavTabs({ categories }: { categories: TreeCategory[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ dragFree: true, align: 'start', containScroll: 'trimSnaps' })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((api: NonNullable<typeof emblaApi>) => {
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!categories.length) return null

  return (
    <nav className="relative bg-bg-card border-b border-ui-border">
      <Container>
        <div className="relative flex items-center">
          <div ref={emblaRef} className="overflow-hidden py-3">
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.slug}`}
                  className="shrink-0 font-body text-sm text-text-dim hover:text-text-base border border-ui-border hover:border-[#C8102E] px-4 py-2 transition-colors duration-200 whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {canScrollPrev && (
            <button
              onClick={scrollPrev}
              className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-bg-card/90 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
              aria-label="Прокрутить назад"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {canScrollNext && (
            <button
              onClick={scrollNext}
              className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center bg-bg-card/90 hover:bg-[#C8102E] border border-ui-border hover:border-[#C8102E] transition-colors duration-200 group"
              aria-label="Прокрутить вперёд"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-text-base group-hover:text-white transition-colors">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </Container>
    </nav>
  )
}
