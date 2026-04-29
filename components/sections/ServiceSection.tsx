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
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="font-body text-xs text-[#C8102E] uppercase tracking-[0.2em] mb-4 block">
                Автосервис
              </span>
              <h2 className="font-heading text-4xl md:text-5xl text-text-base uppercase leading-tight mb-4">
                Профессиональный<br />ремонт и ТО
              </h2>
              <p className="font-body text-text-dim text-base leading-relaxed mb-8">
                Опытные мастера, современное оборудование. Работаем с ВАЗ, ГАЗ, УАЗ и КАМАЗ. Гарантия на все виды работ.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-base px-8 py-4 transition-colors duration-200"
              >
                Записаться на СТО
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
                      <span className="text-2xl mt-0.5 shrink-0">{service.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm uppercase tracking-wide text-text-base">{service.name}</p>
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
