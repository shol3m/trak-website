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
        className="bg-[#111111] border border-[#2A2A2A] hover:border-[#C8102E] hover:shadow-[0_0_20px_rgba(200,16,46,0.2)] transition-colors duration-300 flex flex-col p-6 gap-4"
      >
        <span className="text-4xl">{service.icon}</span>

        <div className="flex-1 flex flex-col gap-2">
          <p className="font-heading text-base uppercase tracking-wide text-[#F0F0F0] leading-tight">
            {service.name}
          </p>
          <p className="font-body text-[#888888] text-sm leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="font-heading text-lg text-[#C8102E]">{service.price}</span>
            <span className="font-mono text-xs text-[#888888]">{service.duration}</span>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-transparent border border-[#2A2A2A] hover:border-[#C8102E] text-[#888888] hover:text-[#F0F0F0] font-body text-xs px-3 py-1.5 transition-colors duration-200"
          >
            Записаться
          </button>
        </div>
      </motion.div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
