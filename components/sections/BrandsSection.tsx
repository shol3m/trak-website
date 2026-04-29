'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const brands = [
  {
    code: 'ГАЗ',
    name: 'Горьковский автомобильный завод',
    desc: 'Коммерческий транспорт, ГАЗель, Соболь, грузовики',
    badge: 'Официальный дилер',
  },
  {
    code: 'УАЗ',
    name: 'Ульяновский автомобильный завод',
    desc: 'Внедорожники, Патриот, Хантер, Буханка',
    badge: 'Субдилер',
  },
  {
    code: 'ВАЗ',
    name: 'Волжский автомобильный завод',
    desc: 'Лада Классика, Приора, Гранта, Нива',
    badge: null,
  },
  {
    code: 'КАМАЗ',
    name: 'Камский автомобильный завод',
    desc: 'Грузовики, тягачи, самосвалы, спецтехника',
    badge: null,
  },
]

export default function BrandsSection() {
  return (
    <section className="py-20 bg-bg-card">
      <Container>
        <SectionHeading
          title="Бренды"
          subtitle="Запчасти и сервис для отечественного транспорта"
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group bg-bg-page border border-ui-border hover:border-[#C8102E] p-6 flex flex-col gap-3 transition-colors duration-200 cursor-default"
            >
              {brand.badge && (
                <span className="self-start font-body text-[10px] uppercase tracking-widest text-[#C4922A] border border-[#C4922A] px-2 py-0.5">
                  {brand.badge}
                </span>
              )}
              <span className="font-heading text-4xl text-text-base tracking-wide">
                {brand.code}
              </span>
              <div>
                <p className="font-body text-xs text-text-dim uppercase tracking-wide leading-tight">
                  {brand.name}
                </p>
                <p className="font-body text-sm text-text-dim mt-2 leading-snug">
                  {brand.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
