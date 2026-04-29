'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import Button from '@/components/ui/Button'
import BookingModal from '@/components/ui/BookingModal'
import { useState } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
}

function CertCard({
  cert, index, aspect, onOpen,
}: {
  cert: { id: number; title: string; path: string }
  index: number
  aspect: string
  onOpen: (v: { src: string; title: string }) => void
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      className="group bg-bg-card border border-ui-border hover:border-[#1A3A6B] transition-colors duration-300 overflow-hidden cursor-pointer"
      onClick={() => onOpen({ src: cert.path, title: cert.title })}
    >
      <div className={`${aspect} relative bg-bg-muted flex items-center justify-center`}>
        <Image
          src={cert.path}
          alt={cert.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-bg-page/0 group-hover:bg-bg-page/40 transition-colors duration-300 flex items-center justify-center">
          <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="14" cy="14" r="8" stroke="#F0F0F0" strokeWidth="2"/>
            <path d="M20 20l6 6" stroke="#F0F0F0" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 14h8M14 10v8" stroke="#F0F0F0" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div className="p-3">
        <p className="font-body text-xs text-text-dim leading-relaxed">{cert.title}</p>
      </div>
    </motion.div>
  )
}

const stats = [
  { value: '30+', label: 'лет на рынке' },
  { value: '50 000+', label: 'позиций в ассортименте' },
]

const advantages = [
  {
    icon: '🏆',
    title: 'Официальный представитель',
    desc: 'Торговый представитель ОАО «ГАЗ» и субдилер ТД «Соллерс» — ЗМЗ и УАЗ. Оригинальные запчасти с гарантией производителя.',
  },
  {
    icon: '📦',
    title: '50 000+ позиций',
    desc: 'Один из крупнейших складов запчастей в Уфе. ГАЗ, УАЗ, ВАЗ — в наличии или под заказ в кратчайшие сроки.',
  },
  {
    icon: '🔧',
    title: 'Собственный сервис',
    desc: 'Профессиональный автосервис с опытными мастерами. Гарантия на все виды работ. Диагностика, ТО, ремонт.',
  },
  {
    icon: '✅',
    title: 'Гарантия качества',
    desc: 'Работаем только с проверенными поставщиками. Сертифицированные запчасти и расходники с документами.',
  },
]

const certificates = [
  { id: 1, title: 'Свидетельство торгового представителя ОАО «ГАЗ»', path: '/certificates/cert-1.jpg' },
  { id: 2, title: 'Свидетельство сертифицированной торговой точки ООО «УАЗ»', path: '/certificates/cert-2.jpg' },
  { id: 3, title: 'Свидетельство субдилера АО «ЛАДА Имидж»', path: '/certificates/cert-3.jpg' },
  { id: 4, title: 'Сертификат соответствия', path: '/certificates/cert-4.jpg' },
  { id: 5, title: 'Приложение к сертификату соответствия', path: '/certificates/cert-5.jpg' },
]

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null)

  return (
    <main className="min-h-screen bg-bg-page">
      {/* Hero */}
      <section className="py-20 border-b border-ui-border">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <span className="font-body text-xs text-[#1A3A6B] uppercase tracking-[0.2em] block mb-4">
              О компании
            </span>
            <h1 className="font-heading text-4xl md:text-5xl text-text-base uppercase tracking-wide mb-6">
              ТРАК — торгово-сервисный комплекс
            </h1>
            <p className="font-body text-text-dim text-lg leading-relaxed">
              Более 30 лет мы обеспечиваем владельцев отечественных автомобилей оригинальными запчастями
              и профессиональным сервисом. Официальный торговый представитель ОАО «ГАЗ»,
              субдилер ТД «Соллерс» по ЗМЗ и УАЗ.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-50 dark:bg-[#0A1929] border-b border-blue-100 dark:border-[#1A3A6B]/30">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="font-heading text-4xl md:text-5xl text-[#2563EB] mb-2">{s.value}</div>
                <div className="font-body text-sm text-text-dim uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="py-20 border-b border-ui-border">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <SectionHeading title="Кто мы" />
              <div className="space-y-4 font-body text-text-dim leading-relaxed">
                <p>
                  ТРАК — это торгово-сервисный комплекс в Уфе, специализирующийся на запчастях
                  и обслуживании отечественной техники. Мы работаем с ГАЗ, УАЗ, ВАЗ и КАМАЗ,
                  предлагая более 50 000 наименований в постоянном наличии.
                </p>
                <p>
                  Статус официального торгового представителя ОАО «ГАЗ» и субдилера ТД «Соллерс»
                  позволяет нам поставлять исключительно оригинальную продукцию с документами
                  и гарантией завода.
                </p>
                <p>
                  Собственный автосервис с современным оборудованием и опытными мастерами
                  дополняет торговое направление — здесь можно не только купить, но и установить
                  любую запчасть.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              className="space-y-3"
            >
              {[
                ['Официальный торговый представитель', 'ОАО «ГАЗ»'],
                ['Субдилер ТД «Соллерс»', 'ЗМЗ и УАЗ'],
                ['Запчасти для', 'ГАЗ, УАЗ, ВАЗ'],
                ['Ассортимент', '50 000+ позиций'],
                ['Опыт работы', 'более 30 лет'],
                ['Регион', 'Уфа и Башкортостан'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between items-center py-3 border-b border-ui-border"
                >
                  <span className="font-body text-sm text-text-dim">{label}</span>
                  <span className="font-body text-sm text-text-base font-medium">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Advantages */}
      <section className="py-20 border-b border-ui-border">
        <Container>
          <SectionHeading title="Почему выбирают нас" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {advantages.map((a, i) => (
              <motion.div
                key={a.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-bg-card border border-ui-border p-6 hover:border-[#1A3A6B] transition-colors duration-300"
              >
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="font-heading text-base text-text-base uppercase tracking-wide mb-3">
                  {a.title}
                </h3>
                <p className="font-body text-sm text-text-dim leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Certificates */}
      <section className="py-20 border-b border-ui-border">
        <Container>
          <SectionHeading
            title="Сертификаты и свидетельства"
            subtitle="Официальные документы, подтверждающие наш статус авторизованного представителя."
          />

          {/* Свидетельства: cert-1 portrait | cert-2 landscape | cert-3 portrait */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.8fr_1fr] gap-4 mb-4">
            {certificates.slice(0, 3).map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} aspect={i === 1 ? 'aspect-[16/10]' : 'aspect-[3/4]'} onOpen={setLightbox} />
            ))}
          </div>

          {/* Сертификаты: 2 A4-portrait карточки по центру */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {certificates.slice(3).map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i + 3} aspect="aspect-[1/1.41]" onOpen={setLightbox} />
            ))}
          </div>
        </Container>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center border border-ui-border hover:border-[#C8102E] bg-bg-card transition-colors duration-200"
            onClick={() => setLightbox(null)}
            aria-label="Закрыть"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-base">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div
            className="relative max-h-[90vh] max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.title}
              width={800}
              height={1133}
              className="object-contain max-h-[85vh] w-auto mx-auto"
              unoptimized
            />
            <p className="text-center font-body text-xs text-text-dim mt-3">{lightbox.title}</p>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="border border-ui-border bg-bg-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-body text-xs text-[#1A3A6B] uppercase tracking-[0.2em] block mb-2">
                Свяжитесь с нами
              </span>
              <a
                href="tel:+73472237208"
                className="font-heading text-3xl text-text-base hover:text-[#C8102E] transition-colors duration-200"
              >
                +7 347 223-72-08
              </a>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => setModalOpen(true)}>
                Записаться на СТО
              </Button>
              <Button variant="secondary" size="lg" href="/catalog">
                Каталог запчастей
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <BookingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </main>
  )
}
