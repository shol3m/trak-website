'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { STATIC_CATEGORIES } from '@/lib/categories'

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
      <path d="M22 3H2l8 9.46V19l4 2V12.46L22 3z" />
    </svg>
  ),
  tormoznaya_sistema: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  ),
  podveska: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M8 16s1.5-2 4-2 4 2 4 2" />
      <path d="M9 9h.01M15 9h.01" />
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
          subtitle="50 000+ позиций для всех марок и моделей"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DISPLAY.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/catalog/${cat.slug}`}
                className="group relative flex flex-col gap-3 bg-bg-card border border-ui-border hover:border-[#C8102E] hover:bg-bg-muted p-6 transition-all duration-300 block overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C8102E] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                <motion.span
                  className="text-[#C8102E] block"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {ICONS[cat.slug] ?? ICONS['filtry']}
                </motion.span>
                <p className="font-heading text-sm uppercase tracking-wide text-text-base group-hover:text-[#C8102E] transition-colors duration-200">
                  {cat.name}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
