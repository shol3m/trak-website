import Link from 'next/link'
import Container from '@/components/layout/Container'
import { CAR_BRANDS, PART_BRANDS } from '@/lib/categories'

const stats = [
  { value: 'С 1992', label: 'года на рынке' },
  { value: '50 000+', label: 'позиций в наличии' },
  { value: 'Пн–Вс', label: 'без выходных' },
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
              Официальный торговый представитель ГАЗ и субдилер УАЗ — с 1992 года поставляем оригинальные и аналоговые запчасти для ГАЗ, УАЗ, ВАЗ, КАМАЗ и других марок, с автосервисом в Уфе.
            </p>
          </div>

          <div className="hidden lg:block w-px self-stretch bg-ui-border" />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-xs text-text-ghost uppercase tracking-wide shrink-0">Марки авто</span>
              {CAR_BRANDS.map((brand) => (
                <Link
                  key={brand.label}
                  href={`/catalog?brand=${encodeURIComponent(brand.dbBrand)}`}
                  className="font-body text-xs uppercase tracking-wide text-text-dim border border-ui-border px-3 py-1.5 hover:border-[#C8102E] hover:text-text-base transition-colors duration-200"
                >
                  {brand.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-body text-xs text-text-ghost uppercase tracking-wide shrink-0">Бренды запчастей</span>
              {PART_BRANDS.map((brand) => (
                <Link
                  key={brand.label}
                  href={`/catalog?brand=${encodeURIComponent(brand.dbBrand)}`}
                  className="font-body text-xs uppercase tracking-wide text-text-dim border border-ui-border px-3 py-1.5 hover:border-[#C8102E] hover:text-text-base transition-colors duration-200"
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
