'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { CATEGORY_ICONS, CATEGORY_IMAGES, DEFAULT_CATEGORY_ICON } from '@/lib/category-icons'
import type { TreeCategory } from '@/lib/db-catalog'

// Homepage shows a single curated row — only the categories with a real photo
// (2026-08-07). The rest of the tree still renders in full on /catalog.
const FEATURED_SLUGS = [
  'avtoaksessuary',
  'avtozapchasti',
  'akkumulyatory-i-zaryadka',
  'avtohimiya-i-avtokosmetika',
  'masla',
]

export default function CategoryGrid({ categories }: { categories: TreeCategory[] }) {
  const featured = FEATURED_SLUGS
    .map((slug) => categories.find((cat) => cat.slug === slug))
    .filter((cat): cat is TreeCategory => Boolean(cat))

  if (!featured.length) return null

  return (
    <section className="py-12 sm:py-16 bg-bg-card">
      <Container>
        <SectionHeading title="Категории товаров" subtitle="Более 10 000 позиций в наличии и под заказ" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featured.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              {CATEGORY_IMAGES[cat.slug] ? (
                <Link
                  href={`/catalog/${cat.slug}`}
                  className="group relative block aspect-square overflow-hidden border border-ui-border hover:border-[#C8102E] transition-colors duration-200"
                >
                  <Image
                    src={CATEGORY_IMAGES[cat.slug]}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-3 font-heading text-sm text-white">
                    {cat.name}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/catalog/${cat.slug}`}
                  className="group flex flex-col items-center text-center gap-3 bg-bg-card border border-ui-border hover:border-[#C8102E] px-3 py-6 transition-colors duration-200"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#C8102E]"
                  >
                    {CATEGORY_ICONS[cat.slug] ?? DEFAULT_CATEGORY_ICON}
                  </svg>
                  <span className="font-heading text-sm text-text-base group-hover:text-[#C8102E] transition-colors duration-200">
                    {cat.name}
                  </span>
                </Link>
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.35, delay: featured.length * 0.04 }}
          >
            <Link
              href="/catalog"
              className="group flex flex-col items-center justify-center text-center gap-2 aspect-square bg-bg-muted border border-ui-border hover:border-[#C8102E] transition-colors duration-200"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#C8102E]">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <span className="font-heading text-sm text-text-base group-hover:text-[#C8102E] transition-colors duration-200">
                Все категории
              </span>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
