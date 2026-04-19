'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const advantages = [
  {
    icon: '✓',
    title: 'Оригинальные запчасти',
    text: 'Только сертифицированные детали от проверенных поставщиков и официальных дилеров.',
  },
  {
    icon: '⚡',
    title: 'Быстрая доставка',
    text: 'Доставка по Уфе в день заказа, по России — от 1 дня транспортными компаниями.',
  },
  {
    icon: '🛡',
    title: 'Гарантия качества',
    text: 'Гарантия на все товары и работы. Возврат и обмен в течение 14 дней.',
  },
  {
    icon: '30+',
    title: 'Лет на рынке',
    text: 'Официальный торговый представитель ОАО «ГАЗ» и субдилер ТД «Соллерс».',
  },
]

export default function AdvantagesSection() {
  return (
    <section className="py-20 bg-[#1E1E1E]">
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
              className="bg-[#111111] border border-[#2A2A2A] p-6"
            >
              <div className="font-heading text-3xl text-[#C8102E] mb-4">{item.icon}</div>
              <h3 className="font-heading text-base text-[#F0F0F0] uppercase tracking-wide mb-2">{item.title}</h3>
              <p className="font-body text-[#888888] text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
