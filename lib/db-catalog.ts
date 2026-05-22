import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'
import { detectCategorySlug, STATIC_CATEGORIES, PAGE_SIZE } from '@/lib/categories'
import type { CatalogProduct } from '@/lib/categories'

export type { CatalogProduct }
export { PAGE_SIZE, STATIC_CATEGORIES, detectCategorySlug }

export type DbCategory = { id: string; slug: string; name: string }

// Module-level cache — categories rarely change
let _catCache: DbCategory[] | null = null

export async function getCategories(): Promise<DbCategory[]> {
  if (_catCache) return _catCache
  const { data, error } = await supabase
    .from('Category')
    .select('id, slug, name')
    .neq('slug', 'prochee')
    .order('name', { ascending: true })
  if (error) return []
  _catCache = (data as DbCategory[]) ?? []
  return _catCache
}

// Category helpers — Prisma, used by import scripts only

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

// Supabase row shape

type SupabaseProduct = {
  id: string
  name: string
  article: string
  priceRetail: number
  stock: number
  brandName: string | null
  externalId: string | null
  description: string | null
  Category: { slug: string; name: string } | null
}

function adapt(p: SupabaseProduct): CatalogProduct {
  return {
    id: p.id,
    name: p.name,
    article: p.article,
    brand: p.brandName ?? '',
    category: p.Category?.name ?? '',
    categorySlug: p.Category?.slug ?? '',
    price: Number(p.priceRetail),
    stock: p.stock,
    images: [],
    description: p.description ?? '',
    externalId: p.externalId,
  }
}

const PRODUCT_COLUMNS =
  'id, name, article, priceRetail, stock, brandName, externalId, description, Category!inner(slug, name)'

// Strip characters that have special meaning in PostgREST filter syntax
function sanitizeSearch(raw: string): string {
  return raw.trim().replace(/[(),"'\\]/g, '')
}

// Query functions

export async function getProducts({
  search,
  categorySlug,
  page = 1,
}: {
  search?: string
  categorySlug?: string
  page?: number
} = {}) {
  const skip = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('Product')
    .select(PRODUCT_COLUMNS, { count: 'exact' })
    .eq('isActive', true)
    .order('id', { ascending: true })
    .range(skip, skip + PAGE_SIZE - 1)

  if (categorySlug) {
    query = query.eq('Category.slug', categorySlug)
  }

  if (search?.trim()) {
    const q = sanitizeSearch(search)
    if (q) {
      query = query.or(`name.ilike.%${q}%,article.ilike.%${q}%`)
    }
  }

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  const total = count ?? 0
  return {
    products: (data as unknown as SupabaseProduct[]).map(adapt),
    total,
    pages: Math.ceil(total / PAGE_SIZE),
    page,
  }
}

export async function getProductByArticle(article: string): Promise<CatalogProduct | null> {
  const { data, error } = await supabase
    .from('Product')
    .select(PRODUCT_COLUMNS)
    .eq('isActive', true)
    .eq('article', article)
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) return null
  return adapt(data as unknown as SupabaseProduct)
}

export async function getFeaturedProducts(limit = 4): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from('Product')
    .select(PRODUCT_COLUMNS)
    .eq('isActive', true)
    .gt('stock', 0)
    .order('syncedAt', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data as unknown as SupabaseProduct[]).map(adapt)
}
