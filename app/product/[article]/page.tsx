import { notFound } from 'next/navigation'
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
    <div className="min-h-screen bg-bg-page pt-24 pb-20">
      <Container>
        <Breadcrumb items={breadcrumbItems} />

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
              {node && (
                <span className="font-mono text-xs px-2 py-0.5 bg-bg-muted text-text-dim">
                  {node.category.name}
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
