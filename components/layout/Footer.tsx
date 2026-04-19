import Link from 'next/link'
import Container from './Container'

const trustItems = [
  { value: '30+', label: 'лет на рынке' },
  { value: '50 000+', label: 'позиций в каталоге' },
  { value: '2', label: 'направления: магазин и сервис' },
  { value: 'ГАЗ · УАЗ', label: 'официальный дилер' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#2A2A2A]">
      <div className="border-b border-[#2A2A2A] py-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.value} className="text-center">
                <p className="font-heading text-2xl text-[#C8102E]">{item.value}</p>
                <p className="font-body text-xs text-[#888888] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <Link href="/" className="font-heading text-2xl text-[#F0F0F0] tracking-widest uppercase block mb-3">
              ТРАК
            </Link>
            <p className="font-body text-[#888888] text-sm leading-relaxed mb-4">
              Торгово-сервисный комплекс. Официальный представитель ОАО «ГАЗ».
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-[#F0F0F0] mb-4">Каталог</h4>
            <ul className="flex flex-col gap-2">
              {['Двигатели', 'Фильтры', 'Тормоза', 'Подвеска', 'Масла'].map((cat) => (
                <li key={cat}>
                  <Link href="/catalog" className="font-body text-[#888888] hover:text-[#F0F0F0] text-sm transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-[#F0F0F0] mb-4">Сервис</h4>
            <ul className="flex flex-col gap-2">
              {['Замена масла', 'Диагностика', 'Шиномонтаж', 'Техобслуживание'].map((s) => (
                <li key={s}>
                  <Link href="/service" className="font-body text-[#888888] hover:text-[#F0F0F0] text-sm transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm uppercase tracking-widest text-[#F0F0F0] mb-4">Контакты</h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-[#888888]">
              <li>
                <span className="text-[#F0F0F0]">Магазин:</span><br />
                <a href="tel:+73472237208" className="hover:text-[#F0F0F0] transition-colors duration-200">+7 347 223-72-08</a><br />
                <a href="tel:+79991334973" className="hover:text-[#F0F0F0] transition-colors duration-200">+7 999 133-49-73</a><br />
                Пн–Пт 9:00–20:00, Сб–Вс 9:00–17:00
              </li>
              <li className="mt-2">
                <span className="text-[#F0F0F0]">Сервис:</span><br />
                <a href="tel:+73472981645" className="hover:text-[#F0F0F0] transition-colors duration-200">+7 347 298-16-45</a><br />
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

        <div className="border-t border-[#2A2A2A] pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-[#888888] text-xs">© 2025 ТРАК. Все права защищены.</p>
          <p className="font-body text-[#888888] text-xs">Уфа · trak-ufa.ru</p>
        </div>
      </Container>
    </footer>
  )
}
