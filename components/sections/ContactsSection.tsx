'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const contacts = [
  {
    label: 'Магазин запчастей',
    lines: ['+7 347 223-72-08', '+7 999 133-49-73'],
    hours: 'Пн–Пт 9:00–20:00, Сб–Вс 9:00–17:00',
  },
  {
    label: 'Автосервис',
    lines: ['+7 347 298-16-45', '+7 903 311-16-45'],
    hours: 'Пн–Вс 9:00–20:00',
  },
  {
    label: 'Оптовый отдел',
    lines: ['+7 347 282-09-31'],
    hours: 'Пн–Пт 9:00–17:00',
  },
]

export default function ContactsSection() {
  return (
    <section className="py-20 bg-[#0D0D0D]">
      <Container>
        <SectionHeading title="Контакты" subtitle="Уфа, мы работаем для вас" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {contacts.map((c) => (
              <div key={c.label} className="bg-[#111111] border border-[#2A2A2A] p-5">
                <p className="font-heading text-xs uppercase tracking-widest text-[#888888] mb-2">{c.label}</p>
                {c.lines.map((line) => (
                  <a
                    key={line}
                    href={`tel:${line.replace(/\D/g, '+')}`}
                    className="block font-body text-lg text-[#F0F0F0] hover:text-[#C8102E] transition-colors duration-200"
                  >
                    {line}
                  </a>
                ))}
                <p className="font-body text-sm text-[#888888] mt-1">{c.hours}</p>
              </div>
            ))}

            <div className="bg-[#111111] border border-[#2A2A2A] p-5">
              <p className="font-heading text-xs uppercase tracking-widest text-[#888888] mb-2">Email / WhatsApp</p>
              <a href="mailto:trak.ufa@mail.ru" className="block font-body text-[#F0F0F0] hover:text-[#C8102E] transition-colors duration-200">
                trak.ufa@mail.ru
              </a>
              <a href="https://wa.me/79991334973" className="block font-body text-[#F0F0F0] hover:text-[#C8102E] transition-colors duration-200 mt-1">
                WhatsApp: +7 999 133-49-73
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#111111] border border-[#2A2A2A] flex items-center justify-center min-h-[300px]"
          >
            <div className="text-center">
              <p className="font-heading text-sm uppercase tracking-widest text-[#888888] mb-2">Карта</p>
              <p className="font-body text-xs text-[#888888]">Уфа, Республика Башкортостан</p>
              <p className="font-mono text-xs text-[#2A2A2A] mt-4">Yandex Maps</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
