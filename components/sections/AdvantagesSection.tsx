'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const advantages = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    title: 'Оригинальные запчасти',
    text: 'Только сертифицированные детали от проверенных поставщиков и официальных дилеров.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Быстрая доставка',
    text: 'Доставка по Уфе в день заказа, по России — от 1 дня транспортными компаниями.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Гарантия качества',
    text: 'Гарантия на все товары и работы. Возврат и обмен в течение 14 дней.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: '30+ лет на рынке',
    text: 'Официальный торговый представитель ОАО «ГАЗ» и субдилер ТД «Соллерс».',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="py-20 bg-bg-muted">
      <Container>
        <SectionHeading title="Почему выбирают нас" align="center" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(200,16,46,0.12)' }}
              className="bg-bg-card border border-ui-border p-6"
            >
              <div className="text-[#C8102E] mb-4">{item.icon}</div>
              <h3 className="font-heading text-base text-text-base uppercase tracking-wide mb-2">{item.title}</h3>
              <p className="font-body text-text-dim text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
