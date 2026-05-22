'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MockService } from '@/lib/mock-data'
import BookingModal from './BookingModal'

export default function ServiceCard({ service, index = 0 }: { service: MockService; index?: number }) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-bg-card border border-ui-border hover:border-[#C8102E] hover:shadow-[0_0_20px_rgba(200,16,46,0.15)] transition-colors duration-300 flex flex-col p-6 gap-4"
      >
        <span className="text-[#C8102E]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
          </svg>
        </span>

        <div className="flex-1 flex flex-col gap-2">
          <p className="font-heading text-base uppercase tracking-wide text-text-base leading-tight">
            {service.name}
          </p>
          <p className="font-body text-text-dim text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-lg text-[#C8102E]">{service.price}</span>
            <span className="font-mono text-xs text-text-dim">{service.duration}</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-transparent border border-ui-border hover:border-[#C8102E] text-text-dim hover:text-text-base font-body text-xs px-3 py-1.5 transition-colors duration-200"
          >
            Записаться
          </button>
        </div>
      </motion.div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
