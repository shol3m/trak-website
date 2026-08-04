'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import BookingModal from '@/components/ui/BookingModal'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.07 } }),
}

const departments = [
  {
    label: 'Магазин запчастей',
    accent: '#C8102E',
    bg: 'bg-[#C8102E]',
    phones: [
      { display: '+7 347 223-72-08', tel: 'tel:+73472237208' },
      { display: '+7 999 133-49-73', tel: 'tel:+79991334973' },
    ],
    hours: 'Пн–Пт 9:00–20:00 · Сб–Вс 9:00–17:00',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    label: 'Автосервис',
    accent: '#1A3A6B',
    bg: 'bg-[#1A3A6B]',
    phones: [
      { display: '+7 347 298-16-45', tel: 'tel:+73472981645' },
      { display: '+7 903 311-16-45', tel: 'tel:+79033111645' },
    ],
    hours: 'Пн–Вс 9:00–20:00 · Без выходных',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 17H9M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.1-2.3c-.7-.7-1.4-.9-2.3-.9H6c-1.1 0-1.4.4-2 1L1.6 10.4C1.2 10.8 1 11.4 1 12v3c0 .6.4 1 1 1h2"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/>
      </svg>
    ),
  },
  {
    label: 'Оптовый отдел',
    accent: '#C4922A',
    bg: 'bg-[#C4922A]',
    phones: [
      { display: '+7 347 282-09-31', tel: 'tel:+73472820931' },
    ],
    hours: 'Пн–Пт 9:00–17:00 · Сб–Вс выходной',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
]

export default function ContactsPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-bg-page">

      {/* Hero */}
      <section className="py-16 border-b border-ui-border">
        <Container>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="font-body text-xs text-[#C8102E] uppercase tracking-widest block mb-3">Контакты</span>
            <h1 className="font-heading text-4xl md:text-5xl text-text-base uppercase mb-3">
              Как нас найти
            </h1>
            <p className="font-body text-text-dim text-base">
              Уфа, ул. Пархоменко, 171
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Main: departments left, map right */}
      <section className="py-12 border-b border-ui-border">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Left: dept cards */}
            <div className="flex flex-col gap-3">
              {departments.map((dept, i) => (
                <motion.div
                  key={dept.label}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.05 }}
                  variants={fadeUp}
                  className="bg-bg-card border border-ui-border flex overflow-hidden"
                >
                  {/* Color stripe */}
                  <div className={`w-1 shrink-0 ${dept.bg}`} />

                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span style={{ color: dept.accent }}>{dept.icon}</span>
                      <p className="font-heading text-xs text-text-dim uppercase tracking-widest">{dept.label}</p>
                    </div>
                    <div className="flex flex-col gap-0.5 mb-3">
                      {dept.phones.map((p) => (
                        <a
                          key={p.tel}
                          href={p.tel}
                          className="font-body text-lg font-medium text-text-base transition-colors duration-200"
                          style={{ ['--hover-color' as string]: dept.accent }}
                          onMouseEnter={e => (e.currentTarget.style.color = dept.accent)}
                          onMouseLeave={e => (e.currentTarget.style.color = '')}
                        >
                          {p.display}
                        </a>
                      ))}
                    </div>
                    <p className="font-body text-xs text-text-dim">{dept.hours}</p>
                  </div>
                </motion.div>
              ))}

              {/* Email + WA row */}
              <motion.div
                custom={3}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                variants={fadeUp}
                className="grid grid-cols-2 gap-3"
              >
                <div className="bg-bg-muted border border-ui-border p-4 flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim shrink-0" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div>
                    <p className="font-heading text-[10px] text-text-dim uppercase tracking-widest mb-0.5">Email</p>
                    <a href="mailto:trak.ufa@mail.ru" className="font-body text-sm text-text-base hover:text-[#C8102E] transition-colors duration-200">
                      trak.ufa@mail.ru
                    </a>
                  </div>
                </div>
                <div className="bg-bg-muted border border-ui-border p-4 flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-dim shrink-0" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                  <div>
                    <p className="font-heading text-[10px] text-text-dim uppercase tracking-widest mb-0.5">WhatsApp</p>
                    <a href="https://wa.me/79991334973" className="font-body text-sm text-text-base hover:text-[#C8102E] transition-colors duration-200">
                      +7 999 133-49-73
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: map + address */}
            <motion.div
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              variants={fadeUp}
              className="flex flex-col gap-3"
            >
              <div className="border border-ui-border overflow-hidden">
                <iframe
                  src="https://yandex.ru/map-widget/v1/org/trak/1100951090/?ll=55.970969%2C54.747683&z=15"
                  width="100%"
                  style={{ height: 320, border: 0, display: 'block' }}
                  allowFullScreen
                  title="Карта ТРАК"
                />
              </div>

              {/* Address block */}
              <div className="bg-bg-card border border-ui-border p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#C8102E] shrink-0 mt-0.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <div>
                    <p className="font-heading text-xs text-text-dim uppercase tracking-widest mb-1">Адрес</p>
                    <p className="font-body text-text-base text-sm leading-relaxed">
                      Уфа, ул. Пархоменко, 171<br />
                      <span className="text-text-dim">Рядом с остановкой «Пархоменко»</span>
                    </p>
                  </div>
                </div>
                <a
                  href="https://yandex.ru/maps/org/trak/1100951090/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-xs text-text-dim hover:text-[#C8102E] transition-colors duration-200 border-t border-ui-border pt-4"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Открыть в Яндекс.Картах
                </a>
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-6 py-3 transition-colors duration-200 text-center"
              >
                Записаться на СТО
              </button>
            </motion.div>
          </div>
        </Container>
      </section>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
