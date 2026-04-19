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

const stats = [
  { value: '30+', label: 'лет на рынке' },
  { value: '50 000+', label: 'позиций в ассортименте' },
  { value: '3', label: 'бренда: ГАЗ, УАЗ, ВАЗ' },
  { value: '1', label: 'официальный дилер ГАЗ' },
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
  { id: 2, title: 'Субдилерский договор ТД «Соллерс» (ЗМЗ)', path: '/certificates/cert-2.jpg' },
  { id: 3, title: 'Субдилерский договор ТД «Соллерс» (УАЗ)', path: '/certificates/cert-3.jpg' },
  { id: 4, title: 'Сертификат соответствия', path: '/certificates/cert-4.jpg' },
]

export default function AboutPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#0D0D0D]">
      {/* Hero */}
      <section className="py-20 border-b border-[#2A2A2A]">
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
            <h1 className="font-heading text-4xl md:text-5xl text-[#F0F0F0] uppercase tracking-wide mb-6">
              ТРАК — торгово-сервисный комплекс
            </h1>
            <p className="font-body text-[#888888] text-lg leading-relaxed">
              Более 30 лет мы обеспечиваем владельцев отечественных автомобилей оригинальными запчастями
              и профессиональным сервисом. Официальный торговый представитель ОАО «ГАЗ»,
              субдилер ТД «Соллерс» по ЗМЗ и УАЗ.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-[#0A1929] border-b border-[#1A3A6B]/30">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
                <div className="font-body text-sm text-[#888888] uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* About */}
      <section className="py-20 border-b border-[#2A2A2A]">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <SectionHeading title="Кто мы" />
              <div className="space-y-4 font-body text-[#888888] leading-relaxed">
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
                  className="flex justify-between items-center py-3 border-b border-[#2A2A2A]"
                >
                  <span className="font-body text-sm text-[#888888]">{label}</span>
                  <span className="font-body text-sm text-[#F0F0F0] font-medium">{value}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Advantages */}
      <section className="py-20 border-b border-[#2A2A2A]">
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
                className="bg-[#111111] border border-[#2A2A2A] p-6 hover:border-[#1A3A6B] transition-colors duration-300"
              >
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="font-heading text-base text-[#F0F0F0] uppercase tracking-wide mb-3">
                  {a.title}
                </h3>
                <p className="font-body text-sm text-[#888888] leading-relaxed">{a.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Certificates */}
      <section className="py-20 border-b border-[#2A2A2A]">
        <Container>
          <SectionHeading
            title="Сертификаты и свидетельства"
            subtitle="Официальные документы, подтверждающие наш статус авторизованного представителя."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative bg-[#111111] border border-[#2A2A2A] hover:border-[#1A3A6B] transition-colors duration-300 overflow-hidden"
              >
                <div className="aspect-[3/4] flex flex-col items-center justify-center p-6 gap-4">
                  <div className="w-16 h-16 rounded-none bg-[#1A3A6B]/20 border border-[#1A3A6B]/30 flex items-center justify-center">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <p className="font-body text-xs text-[#888888] text-center leading-relaxed">
                    {cert.title}
                  </p>
                  <span className="font-body text-[10px] text-[#1A3A6B] uppercase tracking-widest">
                    Загрузить фото
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20">
        <Container>
          <div className="border border-[#2A2A2A] bg-[#111111] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="font-body text-xs text-[#1A3A6B] uppercase tracking-[0.2em] block mb-2">
                Свяжитесь с нами
              </span>
              <a
                href="tel:+73472237208"
                className="font-heading text-3xl text-[#F0F0F0] hover:text-[#C8102E] transition-colors duration-200"
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
