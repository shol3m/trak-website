import type { Metadata } from 'next'
import { Russo_One, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactsSection from '@/components/sections/ContactsSection'

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-russo',
})

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex',
})

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-ibm-plex-mono',
})

export const metadata: Metadata = {
  title: 'ТРАК — Автозапчасти и сервис в Уфе',
  description: 'Официальный дистрибьютор ГАЗ. Запчасти для ВАЗ, ГАЗ, УАЗ, КАМАЗ. 30+ лет на рынке.',
  icons: { icon: '/logo.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${russoOne.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[#0D0D0D] text-white font-body antialiased">
        <Header />
        <div className="pt-16">
          {children}
        </div>
        <ContactsSection />
        <Footer />
      </body>
    </html>
  )
}
