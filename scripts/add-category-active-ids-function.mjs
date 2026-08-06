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

const client = new Client({ connectionString: DIRECT_URL, ssl: false })

// getCategoryTree() previously found categories-with-active-products via a
// PostgREST embedded join (Category.select('id, Product!inner(id)').eq
// ('Product.isActive', true)) — same class of bug as search_products (see
// scripts/add-search-function.mjs): RLS's `isActive = true` policy blocks
// index pushdown for embedded/join queries, so on 280k products the join
// timed out (statement timeout, code 57014) instead of using the existing
// Product_isActive_categoryId_idx index. SECURITY DEFINER bypasses RLS so
// the plain distinct-categoryId scan can use that index directly.
const sql = `
create or replace function get_active_category_ids()
returns table (id text)
language sql
security definer
set search_path = public
stable
as $$
  select distinct "categoryId" as id from "Product" where "isActive" = true;
$$;

grant execute on function get_active_category_ids() to anon, authenticated;
`

async function main() {
  await client.connect()
  console.log('Создаём функцию get_active_category_ids()...')
  await client.query(sql)
  console.log('Готово.')
}

main()
  .catch((e) => { console.error('Ошибка:', e.message); process.exitCode = 1 })
  .finally(() => client.end())
