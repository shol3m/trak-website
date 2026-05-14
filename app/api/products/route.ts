import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function checkBasicAuth(req: NextRequest): boolean {
  const header = req.headers.get('authorization') ?? ''
  if (!header.startsWith('Basic ')) return false
  const encoded = header.slice(6)
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
  const [login, password] = decoded.split(':')
  return login === process.env.SYNC_LOGIN && password === process.env.SYNC_PASSWORD && !!login
}

function decodeBody(buffer: Buffer): string {
  // 1С может слать Windows-1251 — пробуем определить по наличию кириллицы в utf-8
  const utf8 = buffer.toString('utf-8')
  if (/[а-яёА-ЯЁ]/u.test(utf8)) return utf8
  // Fallback: пробуем latin1 как прокси для cp1251
  return buffer.toString('latin1')
}

interface ProductRow {
  externalId: string
  catalogCode: string
  supplierCode: string
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
    // Пропускаем заголовок
    if (line.startsWith('Код;') || line.startsWith('Код ')) continue

    const parts = line.split(';').map((p) => p.trim())
    if (parts.length < 8) continue

    const [externalId, catalogCode, supplierCode, name, article, brand, priceStr, stockStr] = parts

    const price = parseFloat(priceStr.replace(',', '.')) || 0
    const stock = parseInt(stockStr, 10) || 0

    if (!externalId || !name || !article) continue

    rows.push({ externalId, catalogCode, supplierCode, name, article, brand, price, stock })
  }

  return rows
}

async function findOrCreateCategory(catalogCode: string): Promise<string> {
  const slug = `cat-${catalogCode}`

  const existing = await prisma.category.findFirst({ where: { slug } })
  if (existing) return existing.id

  const created = await prisma.category.create({
    data: {
      name: catalogCode,
      slug,
      path: `/${slug}`,
      level: 1,
    },
  })
  return created.id
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

  const now = new Date()
  let upserted = 0
  let errors = 0

  for (const row of rows) {
    try {
      const categoryId = await findOrCreateCategory(row.catalogCode)
      const slug = row.article.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '-').slice(0, 80)

      await prisma.product.upsert({
        where: { externalId: row.externalId },
        update: {
          name: row.name,
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
          slug: `${slug}-${row.externalId}`,
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
