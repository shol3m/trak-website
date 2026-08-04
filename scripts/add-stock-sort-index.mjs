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

// CREATE INDEX CONCURRENTLY cannot run inside a transaction block, so this
// goes out as its own query — no BEGIN/COMMIT wrapping.
const client = new Client({ connectionString: DIRECT_URL, ssl: false })

async function main() {
  await client.connect()
  console.log('Подключились к базе')

  // Default catalog sort ("в наличии → с ценой → под заказ") orders by
  // stock desc, priceRetail desc — without this index Postgres full-sorts
  // the ~280k isActive rows and hits statement_timeout.
  console.log('Строим индекс на Product (isActive, stock, priceRetail)...')
  await client.query(
    'CREATE INDEX CONCURRENTLY IF NOT EXISTS "Product_isActive_stock_priceRetail_idx" ON "Product" ("isActive", stock DESC, "priceRetail" DESC)'
  )

  console.log('Готово.')
}

main()
  .catch((e) => { console.error('Ошибка:', e.message); process.exitCode = 1 })
  .finally(() => client.end())
