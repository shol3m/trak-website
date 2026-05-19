import { createReadStream, readFileSync } from 'fs'
import { createInterface } from 'readline'
import { resolve } from 'path'
import pkg from 'pg'
const { Client } = pkg

// Загружаем .env.local
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

const CATEGORY_KEYWORDS = [
  ['filtry',             ['фильтр']],
  ['masla-i-zhidkosti',  ['масло', 'жидкост', 'антифриз', 'охлаждающ', 'тосол']],
  ['tormoznaya-sistema', ['тормоз', 'колодк', 'суппорт']],
  ['podveska',           ['амортизатор', 'пружин', 'рычаг', 'шаровая', 'сайлент', 'втулк', 'подшипник', 'стойк']],
  ['transmissiya',       ['сцепл', 'коробк', 'карданн', 'полуось', 'редуктор']],
  ['dvigateli',          ['двигатель', 'мотор', 'поршн', 'клапан', 'вкладыш', 'распредвал', 'коленвал', 'шатун', 'турбо', 'прокладк', 'ремень']],
]

const STATIC_CATEGORIES = [
  { slug: 'dvigateli',          name: 'Для двигателя' },
  { slug: 'filtry',             name: 'Фильтры и расходники' },
  { slug: 'tormoznaya-sistema', name: 'Тормозная система' },
  { slug: 'podveska',           name: 'Подвеска' },
  { slug: 'masla-i-zhidkosti',  name: 'Масла и жидкости' },
  { slug: 'transmissiya',       name: 'Трансмиссия' },
  { slug: 'prochee',            name: 'Прочее' },
]

function detectCategorySlug(name) {
  const lower = name.toLowerCase()
  for (const [slug, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return slug
  }
  return 'prochee'
}

async function connect() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    keepAlive: true,
    statement_timeout: 60000,
  })
  await client.connect()
  return client
}

async function main() {
  console.log('Подключение к БД...')
  const db = await connect()
  await db.query('SELECT 1')
  console.log('Подключение OK\n')

  // Категории
  console.log('Подготовка категорий...')
  const catMap = new Map()
  for (const cat of STATIC_CATEGORIES) {
    const { rows } = await db.query('SELECT id FROM "Category" WHERE slug=$1', [cat.slug])
    if (rows.length > 0) {
      catMap.set(cat.slug, rows[0].id)
    } else {
      const id = cuid()
      await db.query(
        'INSERT INTO "Category"(id,"parentId",path,level,name,slug,"sortOrder") VALUES($1,NULL,$2,1,$3,$4,0)',
        [id, `/${cat.slug}`, cat.name, cat.slug]
      )
      catMap.set(cat.slug, id)
      console.log(`  Создана категория: ${cat.name}`)
    }
  }
  console.log(`Категорий готово: ${catMap.size}\n`)

  const csvPath = resolve(process.cwd(), 'products.csv')
  const now = new Date().toISOString()
  const BATCH_SIZE = 500

  let total = 0, inserted = 0, skipped = 0
  let batch = []
  const seenArticles = new Set()
  const seenExternalIds = new Set()

  async function flushBatch() {
    if (batch.length === 0) return

    const ids         = batch.map(r => r.id)
    const externalIds = batch.map(r => r.externalId)
    const articles    = batch.map(r => r.article)
    const names       = batch.map(r => r.name)
    const slugs       = batch.map(r => r.slug)
    const categoryIds = batch.map(r => r.categoryId)
    const prices      = batch.map(r => r.priceRetail)
    const stocks      = batch.map(r => r.stock)
    const brandNames  = batch.map(r => r.brandName)

    const sql = `
      INSERT INTO "Product"(
        id, "externalId", article, name, slug, "categoryId",
        "priceRetail", stock, "isActive", "isOrderable",
        "brandName", source, "syncedAt", "createdAt", "updatedAt"
      )
      SELECT
        unnest($1::text[]), unnest($2::text[]), unnest($3::text[]),
        unnest($4::text[]), unnest($5::text[]), unnest($6::text[]),
        unnest($7::numeric[]), unnest($8::int[]),
        true, true,
        unnest($9::text[]), '1c', $10::timestamptz, $10::timestamptz, $10::timestamptz
      ON CONFLICT ("externalId") DO UPDATE SET
        name          = EXCLUDED.name,
        article       = EXCLUDED.article,
        "priceRetail" = EXCLUDED."priceRetail",
        stock         = EXCLUDED.stock,
        "brandName"   = EXCLUDED."brandName",
        "syncedAt"    = EXCLUDED."syncedAt",
        "updatedAt"   = EXCLUDED."updatedAt"
    `

    try {
      const result = await db.query(sql, [ids, externalIds, articles, names, slugs, categoryIds, prices, stocks, brandNames, now])
      inserted += result.rowCount ?? batch.length
    } catch (e) {
      console.error(`Ошибка батча (${batch.length} строк): ${e.message}`)
      // Reconnect if connection dropped
      if (e.message.includes('terminated') || e.message.includes('Connection')) {
        try { await db.end() } catch {}
        Object.assign(db, await connect())
      }
      skipped += batch.length
    }
    batch = []
  }

  const rl = createInterface({
    input: createReadStream(csvPath, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  })

  let isFirstLine = true
  for await (const rawLine of rl) {
    const line = rawLine.replace(/^﻿/, '').trim()
    if (!line) continue
    if (isFirstLine) { isFirstLine = false; continue }

    const parts = line.split('\t')
    if (parts.length < 8) continue

    const [externalId, , , name, articleRaw, brand, priceStr, stockStr] = parts
    if (!externalId || !name || !articleRaw) continue
    if (seenExternalIds.has(externalId)) continue
    seenExternalIds.add(externalId)

    const price = parseFloat((priceStr || '').replace(',', '.')) || 0
    const stock = parseInt(stockStr) || 0

    let article = articleRaw.trim()
    if (seenArticles.has(article)) article = `${article}-${externalId}`
    seenArticles.add(article)

    const categorySlug = detectCategorySlug(name)
    const categoryId = catMap.get(categorySlug)
    const slugBase = article.toLowerCase().replace(/[^a-z0-9а-яё]/gi, '-').slice(0, 80)

    batch.push({
      id: cuid(),
      externalId,
      article,
      name: name.trim(),
      slug: `${slugBase}-${externalId}`,
      categoryId,
      priceRetail: price,
      stock,
      brandName: brand?.trim() || null,
    })

    total++

    if (batch.length >= BATCH_SIZE) {
      await flushBatch()
      if (total % 10000 === 0) {
        console.log(`Обработано: ${total.toLocaleString()} | Вставлено: ${inserted.toLocaleString()} | Пропущено: ${skipped.toLocaleString()}`)
      }
    }
  }

  await flushBatch()

  console.log(`\nИмпорт завершён`)
  console.log(`  Всего в CSV:  ${total.toLocaleString()}`)
  console.log(`  Вставлено:    ${inserted.toLocaleString()}`)
  console.log(`  Пропущено:    ${skipped.toLocaleString()}`)

  await db.end()
}

main().catch(async (e) => {
  console.error('Ошибка:', e.message)
  process.exit(1)
})
