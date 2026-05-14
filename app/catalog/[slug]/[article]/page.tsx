import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductByArticle } from '@/lib/db-catalog'
import { STATIC_CATEGORIES } from '@/lib/categories'
import Container from '@/components/layout/Container'
import AddToCartButton from './AddToCartButton'
import ProductImage from './ProductImage'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { article: string } }) {
  try {
    const product = await getProductByArticle(params.article)
    if (!product) return { title: 'Товар не найден' }
    return {
      title: `${product.name} — ТРАК`,
      description: product.description || `Артикул ${product.article}${product.brand ? ` · ${product.brand}` : ''}`,
    }
  } catch {
    return { title: 'ТРАК — Запчасти' }
  }
}

export default async function ProductPage({ params }: { params: { slug: string; article: string } }) {
  let product
  try {
    product = await getProductByArticle(params.article)
  } catch {
    notFound()
  }
  if (!product) notFound()

  const category = STATIC_CATEGORIES.find((c) => c.slug === product!.categorySlug)
  const inStock = product!.stock > 0

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
          <span className="text-text-base truncate max-w-[200px]">{product!.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square bg-bg-card border border-ui-border flex items-center justify-center">
            <ProductImage src={product!.images?.[0]} alt={product!.name} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {product!.brand && (
                <span className="font-mono text-xs px-2 py-0.5 bg-[#C8102E]/10 text-[#C8102E] uppercase">
                  {product!.brand}
                </span>
              )}
              {category && (
                <span className="font-mono text-xs px-2 py-0.5 bg-bg-muted text-text-dim">
                  {category.name}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase leading-tight">
              {product!.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-xs text-text-dim">Арт: {product!.article}</span>
              <span className={`font-mono text-xs px-2 py-0.5 ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-bg-muted text-text-dim'}`}>
                {inStock ? `В наличии · ${product!.stock} шт` : 'Под заказ'}
              </span>
            </div>

            <p className="font-heading text-4xl text-text-base">
              {product!.price > 0 ? `${product!.price.toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
            </p>

            <AddToCartButton product={product!} />

            {product!.description && (
              <div className="border-t border-ui-border pt-6 mt-2">
                <h2 className="font-body text-xs text-text-dim uppercase tracking-wider mb-3">Описание</h2>
                <p className="font-body text-text-dim leading-relaxed text-sm">{product!.description}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
