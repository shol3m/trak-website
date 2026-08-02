import Link from 'next/link'
import Container from '@/components/layout/Container'

const stats = [
  { value: '30+', label: 'лет на рынке' },
  { value: '50 000+', label: 'позиций в наличии' },
  { value: 'Пн–Вс', label: 'без выходных' },
]

// label — что показываем; dbBrand — точное значение Product.brandName для фильтра
// /catalog?brand=... (в БД марки хранятся как в CSV от 1С: КАМАЗ/ВАЗ/УАЗ — латиницей).
const carBrands = [
  { label: 'ГАЗ', dbBrand: 'ГАЗ' },
  { label: 'УАЗ', dbBrand: 'UAZ' },
  { label: 'ВАЗ', dbBrand: 'LADA' },
  { label: 'КАМАЗ', dbBrand: 'KAMAZ' },
]

// Комбинация узнаваемых мировых брендов (BOSCH/MANN/TRW — трастовый сигнал)
// и самых частых по факту в каталоге (FEBEST/TRIALLI/FENOX, см. products.csv).
const partBrands = [
  { label: 'BOSCH', dbBrand: 'BOSCH' },
  { label: 'FEBEST', dbBrand: 'FEBEST' },
  { label: 'MANN', dbBrand: 'MANN' },
  { label: 'TRW', dbBrand: 'TRW' },
  { label: 'TRIALLI', dbBrand: 'TRIALLI' },
  { label: 'FENOX', dbBrand: 'FENOX' },
]

export default function StatsBrandsRow() {
  return (
    <section className="bg-bg-card border-b border-ui-border">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 py-6">
          <div className="shrink-0">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {stats.map((item) => (
                <div key={item.value}>
                  <p className="font-heading text-xl text-[#C8102E] leading-none">{item.value}</p>
                  <p className="font-body text-xs text-text-dim mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-xs text-text-dim leading-relaxed mt-3 max-w-xs">
              Официальный торговый представитель ГАЗ и субдилер УАЗ — 30 лет поставляем оригинальные и аналоговые запчасти для ГАЗ, УАЗ, ВАЗ, КАМАЗ и других марок, с собственным автосервисом в Уфе.
            </p>
          </div>

          <div className="hidden lg:block w-px self-stretch bg-ui-border" />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-xs text-text-ghost uppercase tracking-wide shrink-0">Марки авто</span>
              {carBrands.map((brand) => (
                <Link
                  key={brand.label}
                  href={`/catalog?brand=${encodeURIComponent(brand.dbBrand)}`}
                  className="font-mono text-xs uppercase tracking-wide text-text-dim border border-ui-border px-3 py-1.5 hover:border-[#C8102E] hover:text-text-base transition-colors duration-200"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-xs text-text-ghost uppercase tracking-wide shrink-0">Бренды запчастей</span>
              {partBrands.map((brand) => (
                <Link
                  key={brand.label}
                  href={`/catalog?brand=${encodeURIComponent(brand.dbBrand)}`}
                  className="font-mono text-xs uppercase tracking-wide text-text-dim border border-ui-border px-3 py-1.5 hover:border-[#C8102E] hover:text-text-base transition-colors duration-200"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
