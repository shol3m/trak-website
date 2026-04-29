'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const contacts = [
  {
    label: 'Магазин запчастей',
    lines: [
      { display: '+7 347 223-72-08', tel: 'tel:+73472237208' },
      { display: '+7 999 133-49-73', tel: 'tel:+79991334973' },
    ],
    hours: 'Пн–Пт 9:00–20:00, Сб–Вс 9:00–17:00',
  },
  {
    label: 'Автосервис',
    lines: [
      { display: '+7 347 298-16-45', tel: 'tel:+73472981645' },
      { display: '+7 903 311-16-45', tel: 'tel:+79033111645' },
    ],
    hours: 'Пн–Вс 9:00–20:00',
  },
  {
    label: 'Оптовый отдел',
    lines: [
      { display: '+7 347 282-09-31', tel: 'tel:+73472820931' },
    ],
    hours: 'Пн–Пт 9:00–17:00',
  },
]

export default function ContactsSection() {
  return (
    <section className="py-20 bg-bg-page">
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
              <div key={c.label} className="bg-bg-card border border-ui-border p-5">
                <p className="font-heading text-xs uppercase tracking-widest text-text-dim mb-2">{c.label}</p>
                {c.lines.map((line) => (
                  <a
                    key={line.tel}
                    href={line.tel}
                    className="block font-body text-lg text-text-base hover:text-[#C8102E] transition-colors duration-200"
                  >
                    {line.display}
                  </a>
                ))}
                <p className="font-body text-sm text-text-dim mt-1">{c.hours}</p>
              </div>
            ))}

            <div className="bg-bg-card border border-ui-border p-5">
              <p className="font-heading text-xs uppercase tracking-widest text-text-dim mb-2">Email / WhatsApp</p>
              <a href="mailto:trak.ufa@mail.ru" className="block font-body text-text-base hover:text-[#C8102E] transition-colors duration-200">
                trak.ufa@mail.ru
              </a>
              <a href="https://wa.me/79991334973" className="block font-body text-text-base hover:text-[#C8102E] transition-colors duration-200 mt-1">
                WhatsApp: +7 999 133-49-73
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="border border-ui-border overflow-hidden min-h-[400px] flex flex-col"
          >
            <iframe
              src="https://yandex.ru/map-widget/v1/org/trak/1100951090/?ll=55.970969%2C54.747683&z=15"
              width="100%"
              height="100%"
              className="flex-1 min-h-[350px]"
              allowFullScreen
              style={{ border: 0 }}
              title="Карта ТРАК"
            />
            <a
              href="https://yandex.ru/maps/org/trak/1100951090/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-bg-card hover:bg-bg-muted text-text-dim hover:text-text-base font-body text-xs px-4 py-2.5 transition-colors duration-200 border-t border-ui-border"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Открыть на Яндекс.Картах
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
