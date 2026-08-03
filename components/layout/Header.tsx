'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  { label: 'Контакты', href: '/contacts' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const openCart = useCartStore((s) => s.openCart)
  const cartCount = useCartCount()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/catalog?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#1A3A6B] border-b border-white/10">
        <Container>
          <div className="flex items-center justify-between h-16 gap-4 md:gap-6">
            <Link href="/" className="shrink-0">
              <Image src="/logo-dark.png" alt="ТРАК" width={90} height={36} className="object-contain h-9 w-auto" priority />
            </Link>

            <nav className="hidden lg:flex items-center gap-5 shrink-0">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-white/70 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Найти запчасть по артикулу или названию"
                  className="w-full bg-white/10 border border-white/15 focus:border-white/40 outline-none text-sm text-white placeholder:text-white/40 pl-9 pr-3 py-2.5 transition-colors duration-200"
                />
              </div>
            </form>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <a
                href="tel:+73472237208"
                className="font-body text-sm text-white hover:text-white/70 transition-colors duration-200 whitespace-nowrap"
              >
                +7 347 223-72-08
              </a>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-4 py-2 transition-colors duration-200 whitespace-nowrap"
              >
                Записаться на СТО
              </button>
              <ThemeToggle />
              <button
                onClick={openCart}
                className="relative text-white/70 hover:text-white transition-colors duration-200"
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
              <button
                onClick={openCart}
                className="relative text-white/70 hover:text-white transition-colors duration-200"
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
                className="text-white/70 hover:text-white transition-colors duration-200"
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
                <form onSubmit={handleSearch} className="pt-4">
                  <div className="relative w-full">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Найти запчасть"
                      className="w-full bg-bg-muted border border-ui-border focus:border-[#2563EB] outline-none text-sm text-text-base placeholder:text-text-dim pl-9 pr-3 py-2.5 transition-colors duration-200"
                    />
                  </div>
                </form>

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
                    className="bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-sm px-4 py-3 text-center transition-colors duration-200"
                  >
                    Записаться на СТО
                  </button>
                  <Link
                    href="/catalog"
                    onClick={() => setMenuOpen(false)}
                    className="border border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white font-body text-sm px-4 py-3 text-center transition-colors duration-200"
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
