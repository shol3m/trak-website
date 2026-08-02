'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { STATIC_CATEGORIES, SEARCH_TERM } from '@/lib/categories'

const DISPLAY = STATIC_CATEGORIES.filter((c) => c.slug !== 'prochee')

const ICONS: Record<string, React.ReactNode> = {
  dvigateli: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="2" />
      <path d="M6 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
      <path d="M14 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
      <path d="M6 17v2" />
      <path d="M18 17v2" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  ),
  filtry: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  ),
  'tormoznaya-sistema': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="12" r="8" />
      <circle cx="11" cy="12" r="3" />
      <rect x="17" y="9" width="5" height="6" rx="1" />
      <path d="M17 11h-3M17 13h-3" />
    </svg>
  ),
  podveska: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M5 15V9l4-5h6l4 5v6" />
      <path d="M9 4v6M15 4v6" />
    </svg>
  ),
  'masla-i-zhidkosti': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  transmissiya: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
}

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-bg-page">
      <Container>
        <SectionHeading
          title="Категории товаров"
          subtitle="Более 50 000 позиций: ГАЗ, УАЗ, ВАЗ, КАМАЗ и другие марки, а также масла и автохимия"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DISPLAY.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link
                href={`/catalog?q=${encodeURIComponent(SEARCH_TERM[cat.slug] ?? cat.name)}`}
                className="group flex flex-col items-center text-center gap-3 bg-bg-card border border-ui-border hover:border-[#C8102E] px-3 py-6 transition-colors duration-200"
              >
                <span className="text-[#C8102E]">
                  {ICONS[cat.slug] ?? ICONS['filtry']}
                </span>
                <span className="font-heading text-sm text-text-base group-hover:text-[#C8102E] transition-colors duration-200">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
