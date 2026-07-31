import { readFileSync } from 'fs'
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

let seq = 0
function cuid() {
  seq++
  return 'c' + Date.now().toString(36) + seq.toString(36) + Math.random().toString(36).slice(2, 7)
}

const TRANSLIT = {
  а:'a', б:'b', в:'v', г:'g', д:'d', е:'e', ё:'e', ж:'zh', з:'z', и:'i', й:'y',
  к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f',
  х:'h', ц:'c', ч:'ch', ш:'sh', щ:'sch', ъ:'', ы:'y', ь:'', э:'e', ю:'yu', я:'ya',
}

function slugify(name) {
  const translit = name.toLowerCase().split('').map((ch) => TRANSLIT[ch] ?? ch).join('')
  return translit.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'category'
}

function parseFile(path) {
  const raw = readFileSync(path, 'utf-8').replace(/^﻿/, '')
  const lines = raw.split(/\r\n|\n/).filter(Boolean)
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t')
    if (parts.length < 6) continue
    const [code, parentCode, name, , , levelStr] = parts
    if (!code || !name) continue
    rows.push({
      code: code.trim(),
      parentCode: parentCode.trim() || null,
      name: name.trim(),
      level: parseInt(levelStr, 10) || 0,
      order: i,
    })
  }
  return rows
}

function assignSlugs(rows, existingSlugs) {
  const usedSlugs = new Set(existingSlugs)
  for (const r of rows) {
    r.id = cuid()
    let slug = slugify(r.name)
    if (usedSlugs.has(slug)) slug = `${slug}-${r.code.slice(-6)}`
    while (usedSlugs.has(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 5)}`
    usedSlugs.add(slug)
    r.slug = slug
  }
  return rows
}

async function main() {
  const parsed = parseFile(resolve(process.cwd(), 'КаталогиСайт.txt'))
  console.log(`Разобрано категорий: ${parsed.length}`)

  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, statement_timeout: 60000 })
  await client.connect()
  console.log('Подключение OK')

  const { rows: existingSlugRows } = await client.query(`SELECT slug FROM "Category"`)
  const rows = assignSlugs(parsed, existingSlugRows.map((r) => r.slug))

  // Pass 1: upsert bare rows (path/parentId placeholder — real ids not known until after upsert)
  for (const r of rows) {
    await client.query(
      `INSERT INTO "Category"(id, "parentId", path, level, name, slug, "sortOrder", "externalId")
       VALUES ($1, NULL, '', $2, $3, $4, $5, $6)
       ON CONFLICT ("externalId") DO UPDATE SET
         level = EXCLUDED.level, name = EXCLUDED.name, "sortOrder" = EXCLUDED."sortOrder"`,
      [r.id, r.level, r.name, r.slug, r.order, r.code]
    )
  }
  console.log(`Вставлено/обновлено: ${rows.length}`)

  // Fetch authoritative ids (existing rows keep their original id on conflict, not the freshly generated one)
  const { rows: idRows } = await client.query(`SELECT id, "externalId" FROM "Category" WHERE "externalId" = ANY($1)`, [rows.map((r) => r.code)])
  const actualId = new Map(idRows.map((r) => [r.externalId, r.id]))
  const byCode = new Map(rows.map((r) => [r.code, r]))

  const pathCache = new Map()
  function resolvePath(r) {
    if (pathCache.has(r.code)) return pathCache.get(r.code)
    const id = actualId.get(r.code)
    const parent = r.parentCode ? byCode.get(r.parentCode) : null
    const path = parent ? `${resolvePath(parent)}/${id}` : `/${id}`
    pathCache.set(r.code, path)
    return path
  }

  // Pass 2: write real path + parentId now that all ids are known
  for (const r of rows) {
    const path = resolvePath(r)
    const parentId = r.parentCode ? actualId.get(r.parentCode) ?? null : null
    await client.query(`UPDATE "Category" SET path = $1, "parentId" = $2 WHERE "externalId" = $3`, [path, parentId, r.code])
  }
  console.log(`Дерево связано: ${rows.length}`)

  await client.end()
  console.log('Готово')
}

main().catch((e) => { console.error('Ошибка:', e.message); process.exit(1) })
