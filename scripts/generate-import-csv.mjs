import { createReadStream, createWriteStream, readFileSync } from 'fs'
import { createInterface } from 'readline'
import { resolve } from 'path'

// Category IDs из БД (получены заранее)
const CAT_IDS = {
  'dvigateli':          'cmp9tvhvf0000hae5xtc3hkzr',
  'filtry':             'cmp9tvjdm0003hae5h3nfkkzm',
  'masla-i-zhidkosti':  'cmpcznfz5047dz0y',
  'podveska':           'cmp9tvmru000bhae5gz7yrlvg',
  'prochee':            'cmp9tvkvw0006hae5j9jjx1wo',
  'tormoznaya-sistema': 'cmpcznfjkfqjxeo4',
  'transmissiya':       'cmpczng409hstnkg',
}

const CATEGORY_KEYWORDS = [
  ['filtry',             ['фильтр']],
  ['masla-i-zhidkosti',  ['масло', 'жидкост', 'антифриз', 'охлаждающ', 'тосол']],
  ['tormoznaya-sistema', ['тормоз', 'колодк', 'суппорт']],
  ['podveska',           ['амортизатор', 'пружин', 'рычаг', 'шаровая', 'сайлент', 'втулк', 'подшипник', 'стойк']],
  ['transmissiya',       ['сцепл', 'коробк', 'карданн', 'полуось', 'редуктор']],
  ['dvigateli',          ['двигатель', 'мотор', 'поршн', 'клапан', 'вкладыш', 'распредвал', 'коленвал', 'шатун', 'турбо', 'прокладк', 'ремень']],
]

function detectCategorySlug(name) {
  const lower = name.toLowerCase()
  for (const [slug, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some(kw => lower.includes(kw))) return slug
  }
  return 'prochee'
}

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

async function main() {
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

    const [externalId, , , name, articleRaw, brand, priceStr, stockStr] = parts
    if (!externalId || !name || !articleRaw) continue
    if (seenExternalIds.has(externalId)) continue
    seenExternalIds.add(externalId)

    let article = articleRaw.trim()
    if (seenArticles.has(article)) article = `${article}-${externalId}`
    seenArticles.add(article)

    const price = parseFloat((priceStr || '').replace(',', '.')) || 0
    const stock = parseInt(stockStr) || 0
    const categorySlug = detectCategorySlug(name)
    const categoryId = CAT_IDS[categorySlug]
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
