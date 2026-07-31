import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/prisma'

function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

function checkBasicAuth(req: NextRequest): boolean {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Basic ')) return false
  const encoded = header.slice(6)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const colonIdx = decoded.indexOf(':')
  const login = decoded.slice(0, colonIdx)
  const password = decoded.slice(colonIdx + 1)
  if (!login) return false
  return (
    safeEq(login, process.env.SYNC_LOGIN ?? '') &&
    safeEq(password, process.env.SYNC_PASSWORD ?? '')
  )
}

function decodeBody(buffer: Buffer): string {
  const utf8 = buffer.toString('utf-8')
  if (/[а-яёА-ЯЁ]/u.test(utf8)) return utf8
  return buffer.toString('latin1')
}

interface ProductRow {
  externalId: string
  categoryCode: string
  name: string
  article: string
  brand: string
  price: number
  stock: number
}

function parseCSV(text: string): ProductRow[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const rows: ProductRow[] = []

  for (const line of lines) {
    if (line.startsWith('Код;') || line.startsWith('Код\t') || line.startsWith('Код ')) continue

    const sep = line.includes('\t') ? '\t' : ';'
    const parts = line.split(sep).map((p) => p.trim())
    if (parts.length < 8) continue

    const [externalId, categoryCode, , name, article, brand, priceStr, stockStr] = parts

    const price = parseFloat(priceStr.replace(',', '.')) || 0
    const stock = parseInt(stockStr, 10) || 0

    if (!externalId || !name || !article) continue

    rows.push({ externalId, categoryCode, name, article, brand, price, stock })
  }

  return rows
}

export async function POST(req: NextRequest) {
  if (!checkBasicAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const buffer = Buffer.from(await req.arrayBuffer())
  const text = decodeBody(buffer)
  const rows = parseCSV(text)

  if (rows.length === 0) {
    return NextResponse.json({ error: 'Нет данных для импорта' }, { status: 400 })
  }

  // Cache category IDs for the duration of this request
  const categoryCache = new Map<string, string>()
  let fallbackCategoryId: string | null = null

  async function getFallbackCategoryId(): Promise<string> {
    if (fallbackCategoryId) return fallbackCategoryId
    let cat = await prisma.category.findFirst({ where: { slug: 'prochee' } })
    if (!cat) {
      cat = await prisma.category.create({
        data: { name: 'Прочее', slug: 'prochee', path: '/prochee', level: 1 },
      })
    }
    fallbackCategoryId = cat.id
    return cat.id
  }

  async function getCategoryId(categoryCode: string): Promise<string> {
    if (categoryCode) {
      if (categoryCache.has(categoryCode)) return categoryCache.get(categoryCode)!
      const cat = await prisma.category.findUnique({ where: { externalId: categoryCode } })
      if (cat) {
        categoryCache.set(categoryCode, cat.id)
        return cat.id
      }
    }
    return getFallbackCategoryId()
  }

  const now = new Date()
  let upserted = 0
  let errors = 0

  for (const row of rows) {
    try {
      const categoryId = await getCategoryId(row.categoryCode)
      const slugBase = row.article.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '-').slice(0, 80)

      await prisma.product.upsert({
        where: { externalId: row.externalId },
        update: {
          name: row.name,
          brandName: row.brand || null,
          priceRetail: row.price,
          stock: row.stock,
          categoryId,
          isActive: row.stock > 0 || row.price > 0,
          syncedAt: now,
          source: '1c',
        },
        create: {
          externalId: row.externalId,
          article: row.article,
          name: row.name,
          brandName: row.brand || null,
          slug: `${slugBase}-${row.externalId}`,
          priceRetail: row.price,
          stock: row.stock,
          categoryId,
          isActive: row.stock > 0 || row.price > 0,
          isOrderable: true,
          syncedAt: now,
          source: '1c',
        },
      })
      upserted++
    } catch {
      errors++
    }
  }

  return NextResponse.json({ ok: true, upserted, errors, total: rows.length })
}
