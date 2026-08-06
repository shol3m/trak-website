import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/ui/CartDrawer'
import { getCategoryTree } from '@/lib/db-catalog'

// Oswald — variable font (fvar axis 400–700), pinned to a single 700 weight.
// None of the 45 `font-heading` usages across the codebase set an explicit
// weight class — they all relied on the old Russo One face being a single
// static weight that always rendered bold. Pinning here (rather than
// declaring a range) preserves that everywhere without touching every file.
// latin-ext subset carries the ₽ ruble sign (U+20BD) — Google buckets it
// there, not in plain "latin" or "cyrillic". Skipping it earlier meant every
// price fell back to a system font for just that one glyph (visibly thinner
// than the digits next to it). All three families below need it.
const oswald = localFont({
  src: [
    { path: '../public/fonts/oswald-latin.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/oswald-latin-ext.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/oswald-cyrillic.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-russo',
  display: 'swap',
})

// Inter — variable font (wght 100–900), one file per subset.
const inter = localFont({
  src: [
    { path: '../public/fonts/inter-latin.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/inter-latin-ext.woff2', weight: '100 900', style: 'normal' },
    { path: '../public/fonts/inter-cyrillic.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-ibm-plex',
  display: 'swap',
})

// JetBrains Mono — variable font (wght 400–800), one file per subset.
const jetbrainsMono = localFont({
  src: [
    { path: '../public/fonts/jetbrains-mono-latin.woff2', weight: '400 800', style: 'normal' },
    { path: '../public/fonts/jetbrains-mono-latin-ext.woff2', weight: '400 800', style: 'normal' },
    { path: '../public/fonts/jetbrains-mono-cyrillic.woff2', weight: '400 800', style: 'normal' },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ТРАК — Автозапчасти и сервис в Уфе',
  description: 'Официальный торговый представитель ОАО «ГАЗ», субдилер УАЗ и ЗМЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ. С 1992 года на рынке.',
  icons: { icon: '/logo.png' },
  openGraph: {
    title: 'ТРАК — Автозапчасти и сервис в Уфе',
    description: 'Официальный торговый представитель ОАО «ГАЗ», субдилер УАЗ и ЗМЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ. С 1992 года на рынке.',
    url: 'https://trak-ufa.ru',
    siteName: 'ТРАК',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getCategoryTree()

  return (
    <html lang="ru" suppressHydrationWarning className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoPartsStore',
              name: 'ТРАК',
              description: 'Официальный торговый представитель ОАО «ГАЗ», субдилер УАЗ и ЗМЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ.',
              url: 'https://trak-ufa.ru',
              telephone: ['+73472237208', '+79991334973'],
              email: 'trak.ufa@mail.ru',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'ул. Пархоменко, 171',
                addressLocality: 'Уфа',
                addressRegion: 'Республика Башкортостан',
                addressCountry: 'RU',
              },
              openingHours: ['Mo-Fr 09:00-20:00', 'Sa-Su 09:00-17:00'],
              priceRange: '$$',
            }),
          }}
        />
        <ThemeProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <Footer categories={categories.slice(0, 5)} />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  )
}
