'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/layout/Container'
import { mockServices } from '@/lib/mock-data'
import BookingModal from '@/components/ui/BookingModal'

const GROUPS = ['ТО и масла', 'Диагностика', 'Ходовая', 'Двигатель', 'Электрика']

export default function ServiceSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(GROUPS[0])

  const filtered = mockServices.filter((s) => s.group === activeGroup)

  return (
    <>
      <section className="py-20 bg-bg-page">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-body text-xs text-[#C8102E] uppercase tracking-[0.2em] mb-4 block">
                Автосервис
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-text-base uppercase leading-tight mb-4">
                Профессиональный<br />ремонт и ТО
              </h2>
              <p className="font-body text-text-dim text-base leading-relaxed mb-6">
                Ремонт ходовой, двигателя и электрики. 3D развал-схождение, установка фаркопа. Работаем с ГАЗ, УАЗ, Лада и КАМАЗ. Зал ожидания с Wi‑Fi.
              </p>
              <div className="flex flex-col gap-2 mb-8">
                {[
                  '3D развал-схождение',
                  'Гарантия на все виды работ',
                  'Без выходных · 9:00–20:00',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#C8102E]">
                      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.25"/>
                      <path d="M4.5 7l1.75 1.75 3-3.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-body text-sm text-text-dim">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="group inline-flex items-center gap-3 bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-base px-8 py-4 transition-colors duration-200"
              >
                Записаться на СТО
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {GROUPS.map((group) => (
                  <button
                    key={group}
                    onClick={() => setActiveGroup(group)}
                    className={`font-body text-xs px-3 py-1.5 border transition-colors duration-200 ${
                      activeGroup === group
                        ? 'bg-[#C8102E] border-[#C8102E] text-white'
                        : 'border-ui-border text-text-dim hover:border-[#C8102E]/50 hover:text-text-base'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGroup}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  {filtered.map((service) => (
                    <div
                      key={service.id}
                      className="group flex items-start gap-4 bg-bg-card border border-ui-border hover:border-[#C8102E]/40 p-4 transition-colors duration-200"
                    >
                      <span className="mt-1 shrink-0 text-[#C8102E]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.78 4.78a.75.75 0 0 0-1.06-1.06L6.75 9.69 5.28 8.22a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4.5-4.5z"/>
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm text-text-base">{service.name}</p>
                        <p className="font-body text-text-dim text-xs mt-1">{service.description}</p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-2">
                        <p className="font-heading text-sm text-[#C8102E]">{service.price}</p>
                        <p className="font-mono text-xs text-text-dim">{service.duration}</p>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="font-body text-xs text-text-dim hover:text-[#C8102E] underline transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          Записаться
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </Container>
      </section>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
