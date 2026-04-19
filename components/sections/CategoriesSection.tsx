'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { mockCategories } from '@/lib/mock-data'

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-[#0D0D0D]">
      <Container>
        <SectionHeading
          title="Категории товаров"
          subtitle="50 000+ позиций для всех марок и моделей"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mockCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/catalog/${cat.slug}`}
                className="group relative flex flex-col gap-3 bg-[#111111] border border-[#2A2A2A] hover:border-[#C8102E] hover:bg-[#161616] p-6 transition-all duration-300 block overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#C8102E] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />
                <motion.span
                  className="text-3xl block"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {cat.icon}
                </motion.span>
                <div>
                  <p className="font-heading text-sm uppercase tracking-wide text-[#F0F0F0] group-hover:text-[#C8102E] transition-colors duration-200">
                    {cat.name}
                  </p>
                  <p className="font-mono text-xs text-[#888888] mt-1">{cat.count.toLocaleString('ru-RU')} товаров</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
