'use client'

import { useState } from 'react'
import BookingModal from '@/components/ui/BookingModal'

export default function ServiceBookingCTA() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div className="border border-[#2A2A2A] bg-[#111111] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-body text-xs text-[#C8102E] uppercase tracking-[0.2em] block mb-2">
            Запись по телефону
          </span>
          <a
            href="tel:+73472981645"
            className="font-heading text-3xl text-[#F0F0F0] hover:text-[#C8102E] transition-colors duration-200"
          >
            +7 347 298-16-45
          </a>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-6 py-3 transition-colors duration-200"
        >
          Записаться на СТО
        </button>
      </div>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
