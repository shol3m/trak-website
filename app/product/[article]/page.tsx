import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductByArticle, getCategoryNode } from '@/lib/db-catalog'
import Container from '@/components/layout/Container'
import Breadcrumb from '@/components/ui/Breadcrumb'
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

export default async function ProductPage({ params }: { params: { article: string } }) {
  let product
  try {
    product = await getProductByArticle(params.article)
  } catch {
    notFound()
  }
  if (!product) notFound()

  const node = product!.categorySlug ? await getCategoryNode(product!.categorySlug) : null
  const inStock = product!.stock > 0

  const categoryChain = node ? [...node.ancestors, node.category] : []
  const breadcrumbItems = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    ...categoryChain.map((c, i) => ({
      name: c.name,
      href: `/catalog/${categoryChain.slice(0, i + 1).map((a) => a.slug).join('/')}`,
    })),
    { name: product!.name },
  ]

  return (
    <div className="min-h-screen bg-bg-page pt-8 pb-20">
      <Container>
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square max-w-sm md:max-w-none mx-auto md:mx-0 w-full bg-bg-card border border-ui-border flex items-center justify-center">
            <ProductImage src={product!.images?.[0]} alt={product!.name} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {product!.brand && (
              <Link
                href={`/catalog?brand=${encodeURIComponent(product!.brand)}`}
                className="inline-block font-heading text-xl md:text-2xl font-bold text-text-base uppercase tracking-wide hover:text-[#C8102E] transition-colors w-fit"
              >
                {product!.brand}
              </Link>
            )}

            <h1 className="font-heading text-2xl md:text-3xl text-text-base uppercase leading-tight">
              {product!.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap">
              {node && (
                <span className="font-body text-xs px-2 py-0.5 bg-bg-muted text-text-dim">
                  {node.category.name}
                </span>
              )}
              <span className="font-mono text-xs text-text-dim">Арт: {product!.article}</span>
              <span className={`font-body text-xs px-2 py-0.5 uppercase ${inStock ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-400' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-400'}`}>
                {inStock ? `В наличии · ${product!.stock} шт` : 'Под заказ'}
              </span>
            </div>

            <div className="bg-bg-muted border border-ui-border p-5 flex flex-col gap-4">
              <p className="font-heading text-4xl text-text-base">
                {product!.price > 0 ? `${product!.price.toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
              </p>
              <AddToCartButton product={product!} />
            </div>

            {product!.description && (
              <div className="border-t border-ui-border pt-6 mt-2">
                <h2 className="font-body text-sm font-bold text-text-base mb-3">Описание</h2>
                <p className="font-body text-text-dim leading-relaxed text-sm">{product!.description}</p>
              </div>
            )}

            <div className="border-t border-ui-border pt-6 mt-2">
              <h2 className="font-body text-sm font-bold text-text-base mb-3">Гарантия</h2>
              <p className="font-body text-text-dim leading-relaxed text-sm">
                На все товары действует гарантия.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
