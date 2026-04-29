import { notFound } from 'next/navigation'
import Link from 'next/link'
import { mockProducts, mockCategories } from '@/lib/mock-data'
import Container from '@/components/layout/Container'
import AddToCartButton from './AddToCartButton'
import ProductImage from './ProductImage'

const SLUG_TO_CATEGORY: Record<string, string> = {
  'dvigateli': 'Двигатели',
  'filtry': 'Фильтры',
  'tormoznaya-sistema': 'Тормозная система',
  'podveska': 'Подвеска',
  'masla-i-zhidkosti': 'Масла и жидкости',
  'transmissiya': 'Трансмиссия',
}

export async function generateStaticParams() {
  return mockProducts.map((p) => {
    const matchedCat = mockCategories.find(
      (c) => c.name === p.category || SLUG_TO_CATEGORY[c.slug] === p.category
    )
    return { slug: matchedCat?.slug ?? 'other', article: p.article }
  })
}

export async function generateMetadata({ params }: { params: { article: string } }) {
  const product = mockProducts.find((p) => p.article === params.article)
  if (!product) return { title: 'Товар не найден' }
  return {
    title: `${product.name} — ТРАК`,
    description: product.description,
  }
}

const BRAND_LABELS: Record<string, string> = {
  VAZ: 'ВАЗ', GAZ: 'ГАЗ', UAZ: 'УАЗ', KAMAZ: 'КАМАЗ',
}

export default function ProductPage({ params }: { params: { slug: string; article: string } }) {
  const product = mockProducts.find((p) => p.article === params.article)
  if (!product) notFound()

  const category = mockCategories.find(
    (c) => c.name === product.category || SLUG_TO_CATEGORY[c.slug] === product.category
  )
  const inStock = product.stock > 0

  return (
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-mono text-xs text-text-dim mb-8 flex-wrap">
          <Link href="/" className="hover:text-[#C8102E] transition-colors">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-[#C8102E] transition-colors">Каталог</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/catalog/${category.slug}`} className="hover:text-[#C8102E] transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-text-base truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square bg-bg-card border border-ui-border flex items-center justify-center">
              <ProductImage src={product.images?.[0]} alt={product.name} />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs px-2 py-0.5 bg-[#C8102E]/10 text-[#C8102E] uppercase">
                {BRAND_LABELS[product.brand] ?? product.brand}
              </span>
              {category && (
                <span className="font-mono text-xs px-2 py-0.5 bg-bg-muted text-text-dim">
                  {category.name}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-text-dim">Артикул: {product.article}</span>
              <span className={`font-mono text-xs px-2 py-0.5 ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-bg-muted text-text-dim'}`}>
                {inStock ? `В наличии · ${product.stock} шт` : 'Под заказ'}
              </span>
            </div>

            <p className="font-heading text-4xl text-text-base">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={product} />
            </div>

            {product.description && (
              <div className="border-t border-ui-border pt-6 mt-2">
                <h2 className="font-body text-xs text-text-dim uppercase tracking-wider mb-3">Описание</h2>
                <p className="font-body text-text-dim leading-relaxed text-sm">{product.description}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
