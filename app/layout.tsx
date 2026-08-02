import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import CartDrawer from '@/components/ui/CartDrawer'

const russoOne = localFont({
  src: [
    { path: '../public/fonts/russo-one-latin.woff2', style: 'normal' },
    { path: '../public/fonts/russo-one-cyrillic.woff2', style: 'normal' },
  ],
  variable: '--font-russo',
  display: 'swap',
})

const ibmPlexSans = localFont({
  src: [
    { path: '../public/fonts/ibm-plex-sans-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-400-cyrillic.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-400i-latin.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/ibm-plex-sans-400i-cyrillic.woff2', weight: '400', style: 'italic' },
    { path: '../public/fonts/ibm-plex-sans-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-500-cyrillic.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-600-latin.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-600-cyrillic.woff2', weight: '600', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-700-latin.woff2', weight: '700', style: 'normal' },
    { path: '../public/fonts/ibm-plex-sans-700-cyrillic.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-ibm-plex',
  display: 'swap',
})

const ibmPlexMono = localFont({
  src: [
    { path: '../public/fonts/ibm-plex-mono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ibm-plex-mono-400-cyrillic.woff2', weight: '400', style: 'normal' },
    { path: '../public/fonts/ibm-plex-mono-500-latin.woff2', weight: '500', style: 'normal' },
    { path: '../public/fonts/ibm-plex-mono-500-cyrillic.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ТРАК — Автозапчасти и сервис в Уфе',
  description: 'Официальный торговый представитель ОАО «ГАЗ», субдилер УАЗ и ЗМЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ. 30+ лет на рынке.',
  icons: { icon: '/logo.png' },
  openGraph: {
    title: 'ТРАК — Автозапчасти и сервис в Уфе',
    description: 'Официальный торговый представитель ОАО «ГАЗ», субдилер УАЗ и ЗМЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ. 30+ лет на рынке.',
    url: 'https://trak-ufa.ru',
    siteName: 'ТРАК',
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${russoOne.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
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
          <TopBar />
          <Header />
          <div className="pt-[100px]">
            {children}
          </div>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  )
}
