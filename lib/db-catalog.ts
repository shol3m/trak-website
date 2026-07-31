import { supabase } from '@/lib/supabase'
import { PAGE_SIZE } from '@/lib/categories'
import type { CatalogProduct } from '@/lib/categories'

export type { CatalogProduct }
export { PAGE_SIZE }

export type TreeCategory = {
  id: string
  slug: string
  name: string
  parentId: string | null
  level: number
  path: string
  sortOrder: number
  hasProducts: boolean
  children: TreeCategory[]
}

type CategoryRow = {
  id: string
  parentId: string | null
  slug: string
  name: string
  level: number
  path: string
  sortOrder: number
}

type Tree = {
  byId: Map<string, TreeCategory>
  bySlug: Map<string, TreeCategory>
  roots: TreeCategory[]
}

// Module-level cache — categories rarely change
let _treeCache: Tree | null = null

async function loadTree(): Promise<Tree> {
  if (_treeCache) return _treeCache

  const [{ data: cats, error: catsError }, { data: withProducts, error: prodError }] = await Promise.all([
    supabase
      .from('Category')
      .select('id, parentId, slug, name, level, path, sortOrder')
      .order('sortOrder', { ascending: true }),
    supabase
      .from('Category')
      .select('id, Product!inner(id)')
      .eq('Product.isActive', true),
  ])

  if (catsError || prodError) {
    return { byId: new Map(), bySlug: new Map(), roots: [] }
  }

  const productCategoryIds = new Set(((withProducts ?? []) as { id: string }[]).map((c) => c.id))

  const byId = new Map<string, TreeCategory>()
  for (const c of (cats ?? []) as CategoryRow[]) {
    byId.set(c.id, { ...c, hasProducts: productCategoryIds.has(c.id), children: [] })
  }
  for (const node of byId.values()) {
    if (node.parentId) byId.get(node.parentId)?.children.push(node)
  }

  // Propagate hasProducts up the tree — deepest levels first so each parent
  // sees its children's final state in a single pass.
  const byLevelDesc = [...byId.values()].sort((a, b) => b.level - a.level)
  for (const node of byLevelDesc) {
    if (node.hasProducts && node.parentId) {
      const parent = byId.get(node.parentId)
      if (parent) parent.hasProducts = true
    }
  }

  const roots = [...byId.values()]
    .filter((n) => !n.parentId && n.hasProducts)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const bySlug = new Map([...byId.values()].map((n) => [n.slug, n]))

  _treeCache = { byId, bySlug, roots }
  return _treeCache
}

export async function getCategoryTree(): Promise<TreeCategory[]> {
  const tree = await loadTree()
  return tree.roots
}

export async function getCategoryNode(slug: string): Promise<{
  category: TreeCategory
  ancestors: TreeCategory[]
  children: TreeCategory[]
} | null> {
  const tree = await loadTree()
  const node = tree.bySlug.get(slug)
  if (!node || !node.hasProducts) return null

  const ancestors: TreeCategory[] = []
  let p = node.parentId ? tree.byId.get(node.parentId) : undefined
  while (p) {
    ancestors.unshift(p)
    p = p.parentId ? tree.byId.get(p.parentId) : undefined
  }

  const children = node.children
    .filter((c) => c.hasProducts)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return { category: node, ancestors, children }
}

// Supabase row shape (used by getProductByArticle and getFeaturedProducts)

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
  categoryPath,
  page = 1,
  sort,
}: {
  search?: string
  categoryPath?: string
  page?: number
  sort?: string
} = {}) {
  const skip = (page - 1) * PAGE_SIZE

  let query = supabase
    .from('Product')
    .select(PRODUCT_COLUMNS, { count: 'exact' })
    .eq('isActive', true)
    .range(skip, skip + PAGE_SIZE - 1)

  if (sort === 'price_asc') {
    query = query.order('priceRetail', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('priceRetail', { ascending: false })
  } else {
    query = query.order('id', { ascending: true })
  }

  // Matches this category and every category nested under it (materialized path prefix)
  if (categoryPath) {
    query = query.like('Category.path', `${categoryPath}%`)
  }

  if (search?.trim()) {
    const q = sanitizeSearch(search)
    if (q) {
      // Each word must appear somewhere in name or article (AND logic)
      const words = q.split(/\s+/).filter(Boolean)
      for (const word of words) {
        query = query.or(`name.ilike.%${word}%,article.ilike.%${word}%`)
      }
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
