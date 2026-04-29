'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useInView, animate } from 'framer-motion'
import Container from './Container'

const trustItems = [
  { value: '30+', label: 'лет на рынке' },
  { value: '50 000+', label: 'позиций в наличии' },
  { value: 'Пн–Вс', label: 'работаем без выходных' },
]

function TrustCounter({ raw }: { raw: string }) {
  const match = raw.match(/^([\d\s]+)(\+?)$/)
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  const numeric = match ? parseInt(match[1].replace(/\s/g, ''), 10) : null
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (!numeric || !inView) return
    const controls = animate(0, numeric, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('ru-RU')),
    })
    return controls.stop
  }, [inView, numeric])

  if (!numeric) {
    return <p className="font-heading text-2xl text-[#C8102E]">{raw}</p>
  }

  return (
    <p ref={ref} className="font-heading text-2xl text-[#C8102E]">
      {display}{suffix}
    </p>
  )
}

export default function Footer() {
  return (
    <footer className="bg-bg-card border-t border-ui-border">
      <div className="border-b border-ui-border py-8">
        <Container>
          <div className="grid grid-cols-3 gap-6">
            {trustItems.map((item) => (
              <div key={item.value} className="text-center">
                <TrustCounter raw={item.value} />
                <p className="font-body text-xs text-text-dim mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="font-heading text-2xl text-text-base tracking-widest uppercase block mb-3">
              ТРАК
            </Link>
            <p className="font-body text-text-dim text-sm leading-relaxed mb-4">
              Торгово-сервисный комплекс. Официальный торговый представитель ОАО «ГАЗ». Субдилер ТД «Соллерс» (УАЗ, ЗМЗ).
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-text-base mb-4">Каталог</h4>
            <ul className="flex flex-col gap-2">
              {['Двигатели', 'Фильтры', 'Тормоза', 'Подвеска', 'Масла'].map((cat) => (
                <li key={cat}>
                  <Link href="/catalog" className="font-body text-text-dim hover:text-text-base text-sm transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-text-base mb-4">Сервис</h4>
            <ul className="flex flex-col gap-2">
              {['Замена масла', 'Диагностика', 'Развал-схождение', 'Ремонт двигателя', 'Ремонт КПП'].map((s) => (
                <li key={s}>
                  <Link href="/service" className="font-body text-text-dim hover:text-text-base text-sm transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-text-base mb-4">Контакты</h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-text-dim">
              <li>
                <span className="text-text-base">Магазин:</span><br />
                <a href="tel:+73472237208" className="hover:text-text-base transition-colors duration-200">+7 347 223-72-08</a><br />
                <a href="tel:+79991334973" className="hover:text-text-base transition-colors duration-200">+7 999 133-49-73</a><br />
                Пн–Пт 9:00–20:00, Сб–Вс 9:00–17:00
              </li>
              <li className="mt-2">
                <span className="text-text-base">Сервис:</span><br />
                <a href="tel:+73472981645" className="hover:text-text-base transition-colors duration-200">+7 347 298-16-45</a><br />
                <a href="tel:+79033111645" className="hover:text-text-base transition-colors duration-200">+7 903 311-16-45</a><br />
                Пн–Вс 9:00–20:00
              </li>
              <li className="mt-3">
                <a
                  href="tel:+73472237208"
                  className="inline-block bg-[#C8102E] hover:bg-[#9B0B22] text-white font-body text-xs px-4 py-2 transition-colors duration-200"
                >
                  Позвонить нам
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ui-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-text-dim text-xs">© {new Date().getFullYear()} ТРАК. Все права защищены.</p>
          <p className="font-body text-text-dim text-xs">Уфа · trak-ufa.ru</p>
        </div>
      </Container>
    </footer>
  )
}
