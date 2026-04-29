import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import ThemeProvider from '@/components/providers/ThemeProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactsSection from '@/components/sections/ContactsSection'
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${russoOne.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-body antialiased">
        <ThemeProvider>
          <Header />
          <div className="pt-16">
            {children}
          </div>
          <ContactsSection />
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
        </ThemeProvider>
      </body>
    </html>
  )
}
