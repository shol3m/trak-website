'use client'

import Link from 'next/link'
import Image from 'next/image'
import Container from './Container'

export default function Footer() {
  return (
    <footer className="bg-[#1A3A6B]">
      <Container className="pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="block mb-3">
              <Image src="/logo-dark.png" alt="ТРАК" width={90} height={36} className="object-contain h-9 w-auto" />
            </Link>
            <p className="font-body text-white/60 text-sm leading-relaxed mb-4">
              Запчасти и собственный автосервис в Уфе с 1992 года. Торговый представитель ГАЗ, субдилер УАЗ и ЗМЗ.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-4">Каталог</h4>
            <ul className="flex flex-col gap-2">
              {['Двигатели', 'Фильтры', 'Тормоза', 'Подвеска', 'Масла'].map((cat) => (
                <li key={cat}>
                  <Link href="/catalog" className="font-body text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-4">Сервис</h4>
            <ul className="flex flex-col gap-2">
              {['Замена масла', 'Диагностика', 'Развал-схождение', 'Ремонт двигателя', 'Ремонт КПП'].map((s) => (
                <li key={s}>
                  <Link href="/service" className="font-body text-white/60 hover:text-white text-sm transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-white mb-4">Контакты</h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-white/60">
              <li>
                <span className="text-white">Магазин:</span><br />
                <a href="tel:+73472237208" className="hover:text-white transition-colors duration-200">+7 347 223-72-08</a><br />
                <a href="tel:+79991334973" className="hover:text-white transition-colors duration-200">+7 999 133-49-73</a><br />
                Пн–Пт 9:00–20:00, Сб–Вс 9:00–17:00
              </li>
              <li className="mt-2">
                <span className="text-white">Сервис:</span><br />
                <a href="tel:+73472981645" className="hover:text-white transition-colors duration-200">+7 347 298-16-45</a><br />
                <a href="tel:+79033111645" className="hover:text-white transition-colors duration-200">+7 903 311-16-45</a><br />
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

        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-white/60 text-xs">© {new Date().getFullYear()} ТРАК. Все права защищены.</p>
          <p className="font-body text-white/60 text-xs">Уфа · trak-ufa.ru</p>
        </div>
      </Container>
    </footer>
  )
}
