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

const DIRECT_URL = process.env.DIRECT_URL
if (!DIRECT_URL) { console.error('DIRECT_URL не найден'); process.exit(1) }

// CREATE INDEX CONCURRENTLY cannot run inside a transaction block, so each
// statement must go out as its own query — no BEGIN/COMMIT wrapping, and no
// statement_timeout short enough to cancel a full-table index build.
const client = new Client({ connectionString: DIRECT_URL, ssl: false })

async function main() {
  await client.connect()
  console.log('Подключились к базе')

  console.log('Включаем расширение pg_trgm...')
  await client.query('CREATE EXTENSION IF NOT EXISTS pg_trgm')

  console.log('Строим индекс на Product.name (может занять время, не блокирует запись)...')
  await client.query(
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_name_trgm_idx" ON "Product" USING gin (name gin_trgm_ops)'
  )

  console.log('Строим индекс на Product.article...')
  await client.query(
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_article_trgm_idx" ON "Product" USING gin (article gin_trgm_ops)'
  )

  console.log('Готово: оба индекса созданы.')
}

main()
  .catch((e) => { console.error('Ошибка:', e.message); process.exitCode = 1 })
  .finally(() => client.end())
