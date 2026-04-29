'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Container from './Container'
import BookingModal from '@/components/ui/BookingModal'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { useCartStore, useCartCount } from '@/lib/cart-store'

const navLinks = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'Сервис', href: '/service' },
  { label: 'О нас', href: '/about' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const openCart = useCartStore((s) => s.openCart)
  const cartCount = useCartCount()

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-bg-card/90 backdrop-blur-md border-b border-ui-border">
        <Container>
          <div className="flex items-center justify-between h-16 gap-6">
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="ТРАК" width={90} height={36} className="object-contain h-9 w-auto" priority />
            </Link>

            <nav className="hidden md:flex items-center gap-6 flex-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-text-dim hover:text-[#2563EB] transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href="tel:+73472237208"
                className="font-body text-sm text-text-base hover:text-[#C8102E] transition-colors duration-200 whitespace-nowrap"
              >
                +7 347 223-72-08
              </a>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#1A3A6B] hover:bg-[#2563EB] text-white font-body text-sm px-4 py-2 transition-colors duration-200 whitespace-nowrap"
              >
                Записаться на СТО
              </button>
              <ThemeToggle />
              <button
                onClick={openCart}
                className="relative text-text-dim hover:text-text-base transition-colors duration-200"
                aria-label={`Корзина: ${cartCount} товаров`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C8102E] text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <ThemeToggle />
              <a href="tel:+73472237208" className="font-mono text-xs text-text-dim">
                +7 347 223-72-08
              </a>
              <button
                onClick={openCart}
                className="relative text-text-dim hover:text-text-base transition-colors duration-200"
                aria-label={`Корзина: ${cartCount} товаров`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C8102E] text-white font-mono text-[10px] w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <button
                className="text-text-dim hover:text-text-base transition-colors duration-200"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Меню"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {menuOpen ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </Container>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-ui-border bg-bg-card overflow-hidden"
            >
              <Container>
                <nav className="flex flex-col py-4 gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="font-body text-text-dim hover:text-[#2563EB] transition-colors duration-200 text-base py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setMenuOpen(false); setModalOpen(true) }}
                    className="bg-[#1A3A6B] hover:bg-[#2563EB] text-white font-body text-sm px-4 py-3 text-center transition-colors duration-200"
                  >
                    Записаться на СТО
                  </button>
                  <Link
                    href="/catalog"
                    onClick={() => setMenuOpen(false)}
                    className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-4 py-3 text-center transition-colors duration-200"
                  >
                    Каталог запчастей
                  </Link>
                </nav>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
