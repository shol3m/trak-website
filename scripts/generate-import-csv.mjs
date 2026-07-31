import { createReadStream, createWriteStream, readFileSync } from 'fs'
import { createInterface } from 'readline'
import { resolve } from 'path'
import pkg from 'pg'
const { Client } = pkg

const envContent = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  process.env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
}

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) { console.error('DATABASE_URL не найден'); process.exit(1) }

function cuid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

function csvEscape(val) {
  if (val === null || val === undefined) return ''
  const s = String(val)
  if (s.includes('"') || s.includes(',') || s.includes('\n') || s.includes('\r')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

async function loadCategoryMap() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  const { rows } = await client.query(`SELECT id, "externalId" FROM "Category" WHERE "externalId" IS NOT NULL`)
  const { rows: fallbackRows } = await client.query(`SELECT id FROM "Category" WHERE slug = 'prochee'`)
  await client.end()
  const byCode = new Map(rows.map((r) => [r.externalId, r.id]))
  const fallbackId = fallbackRows[0]?.id
  if (!fallbackId) throw new Error('Категория "prochee" не найдена в БД — запустите scripts/import-categories.mjs сначала')
  return { byCode, fallbackId }
}

async function main() {
  const { byCode, fallbackId } = await loadCategoryMap()
  console.log(`Категорий с кодом: ${byCode.size}`)

  const outPath = resolve(process.cwd(), 'products-supabase.csv')
  const out = createWriteStream(outPath, { encoding: 'utf8' })

  const columns = ['id','externalId','article','name','slug','categoryId','priceRetail','stock','isActive','isOrderable','brandName','source','syncedAt','createdAt','updatedAt']
  out.write(columns.join(',') + '\n')

  const csvPath = resolve(process.cwd(), 'products.csv')
  const now = new Date().toISOString()
  const rl = createInterface({ input: createReadStream(csvPath, { encoding: 'utf8' }), crlfDelay: Infinity })

  let first = true, total = 0
  const seenArticles = new Set()
  const seenExternalIds = new Set()

  for await (const raw of rl) {
    const line = raw.replace(/^﻿/, '').trim()
    if (!line) continue
    if (first) { first = false; continue }

    const parts = line.split('\t')
    if (parts.length < 8) continue

    const [externalId, categoryCode, , name, articleRaw, brand, priceStr, stockStr] = parts
    if (!externalId || !name || !articleRaw) continue
    if (seenExternalIds.has(externalId)) continue
    seenExternalIds.add(externalId)

    let article = articleRaw.trim()
    if (seenArticles.has(article)) article = `${article}-${externalId}`
    seenArticles.add(article)

    const price = parseFloat((priceStr || '').replace(',', '.')) || 0
    const stock = parseInt(stockStr) || 0
    const categoryId = byCode.get(categoryCode) ?? fallbackId
    const slugBase = article.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '-').slice(0, 80)

    const row = [
      cuid(),
      externalId,
      article,
      name.trim(),
      `${slugBase}-${externalId}`,
      categoryId,
      price,
      stock,
      'true',
      'true',
      brand?.trim() || '',
      '1c',
      now,
      now,
      now,
    ].map(csvEscape).join(',')

    out.write(row + '\n')
    total++

    if (total % 50000 === 0) process.stdout.write(`\r  Записей: ${total.toLocaleString()}...`)
  }

  out.end()
  console.log(`\nГотово! Записей: ${total.toLocaleString()}`)
  console.log(`Файл: products-supabase.csv`)
}

main().catch(e => { console.error(e.message); process.exit(1) })
