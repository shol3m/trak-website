'use client'

import { motion } from 'framer-motion'

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/79991334973"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Написать в WhatsApp"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3, delay: 1.5 }}
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl shadow-[#25D366]/30 transition-shadow duration-200 hover:shadow-[#25D366]/50"
      style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
    >
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M16 3C8.82 3 3 8.82 3 16c0 2.38.64 4.7 1.85 6.73L3 29l6.45-1.82A13 13 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3z"
          fill="white"
          fillOpacity="0.15"
        />
        <path
          d="M16 5.5C10.2 5.5 5.5 10.2 5.5 16c0 2.1.58 4.1 1.68 5.83l.28.44-1.18 4.31 4.42-1.16.43.26A10.43 10.43 0 0 0 16 26.5c5.8 0 10.5-4.7 10.5-10.5S21.8 5.5 16 5.5z"
          fill="white"
        />
        <path
          d="M21.5 18.9c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.72-1.34-1.6-1.5-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26 0 1.33.97 2.62 1.1 2.8.14.18 1.91 2.92 4.63 4.09.65.28 1.15.45 1.54.57.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.29.22-.63.22-1.17.16-1.29-.07-.11-.25-.18-.52-.31z"
          fill="#25D366"
        />
      </svg>

      <span className="pointer-events-none absolute right-16 bg-[#128C7E] text-white font-body text-xs px-3 py-1.5 whitespace-nowrap rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md">
        Написать в WhatsApp
      </span>
    </motion.a>
  )
}
