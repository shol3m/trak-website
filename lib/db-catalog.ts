import { prisma } from '@/lib/prisma'
import { detectCategorySlug, STATIC_CATEGORIES, PAGE_SIZE } from '@/lib/categories'
import type { CatalogProduct } from '@/lib/categories'

export type { CatalogProduct }
export { PAGE_SIZE, STATIC_CATEGORIES, detectCategorySlug }

// ── Category helpers ─────────────────────────────────────────────────────────

export async function getOrCreateCategoryId(productName: string): Promise<string> {
  const slug = detectCategorySlug(productName)
  const info = STATIC_CATEGORIES.find((c) => c.slug === slug)!

  const existing = await prisma.category.findFirst({ where: { slug } })
  if (existing) return existing.id

  const created = await prisma.category.create({
    data: { name: info.name, slug, path: `/${slug}`, level: 1 },
  })
  return created.id
}

// ── Prisma row shape ─────────────────────────────────────────────────────────

type DbProduct = {
  id: string
  name: string
  article: string
  priceRetail: { toString(): string }
  stock: number
  brandName: string | null
  externalId: string | null
  description: string | null
  images: { url: string; isPrimary: boolean; sortOrder: number }[]
  category: { slug: string; name: string }
}

function adapt(p: DbProduct): CatalogProduct {
  return {
    id: p.id,
    name: p.name,
    article: p.article,
    brand: p.brandName ?? '',
    category: p.category.name,
    categorySlug: p.category.slug,
    price: Number(p.priceRetail),
    stock: p.stock,
    images: p.images.sort((a, b) => a.sortOrder - b.sortOrder).map((i) => i.url),
    description: p.description ?? '',
    externalId: p.externalId,
  }
}

const select = {
  id: true,
  name: true,
  article: true,
  priceRetail: true,
  stock: true,
  brandName: true,
  externalId: true,
  description: true,
  images: { select: { url: true, isPrimary: true, sortOrder: true } },
  category: { select: { slug: true, name: true } },
}

// ── Query functions ──────────────────────────────────────────────────────────

export async function getProducts({
  search,
  categorySlug,
  page = 1,
}: {
  search?: string
  categorySlug?: string
  page?: number
} = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true }

  if (search?.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: 'insensitive' } },
      { article: { contains: search.trim(), mode: 'insensitive' } },
    ]
  }

  if (categorySlug) {
    const cat = await prisma.category.findFirst({ where: { slug: categorySlug } })
    if (!cat) return { products: [], total: 0, pages: 0, page }
    where.categoryId = cat.id
  }

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      select: select as any,
      orderBy: { name: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: (rows as unknown as DbProduct[]).map(adapt),
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  }
}

export async function getProductByArticle(article: string): Promise<CatalogProduct | null> {
  const p = await prisma.product.findFirst({
    where: { article, isActive: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: select as any,
  })
  return p ? adapt(p as unknown as DbProduct) : null
}

export async function getFeaturedProducts(limit = 4): Promise<CatalogProduct[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true, stock: { gt: 0 } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: select as any,
    orderBy: { syncedAt: 'desc' },
    take: limit,
  })
  return (rows as unknown as DbProduct[]).map(adapt)
}
