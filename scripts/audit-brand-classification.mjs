import { readFileSync } from 'fs'
import { resolve } from 'path'
import pkg from 'pg'
const { Client } = pkg

// Перезапускать после крупных синков из 1С (не разовый скрипт, как остальные
// в этой папке) — сверяет живой Product.brandName с docs/brand-classification.tsv
// и печатает только то, чего там ещё нет: новые бренды, набравшие вес, или
// выросшие за порог CLASSIFY_THRESHOLD. Ничего не пишет ни в БД, ни в файл —
// только отчёт, разметку (МАРКА/БРЕНД/ИСКЛЮЧИТЬ) в файл вносить руками.
const CLASSIFY_THRESHOLD = 100

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

async function main() {
  await client.connect()

  const known = new Set(
    readFileSync(resolve(process.cwd(), 'docs/brand-classification.tsv'), 'utf-8')
      .trim()
      .split('\n')
      .slice(1)
      .map((line) => line.split('\t')[1])
  )

  const { rows } = await client.query(
    `select "brandName", count(*) as cnt
     from "Product"
     where "isActive" = true and "brandName" is not null and "brandName" != ''
     group by "brandName"
     having count(*) >= $1
     order by cnt desc`,
    [CLASSIFY_THRESHOLD]
  )

  const unclassified = rows.filter((r) => !known.has(r.brandName))

  if (unclassified.length === 0) {
    console.log(`Новых брендов с ${CLASSIFY_THRESHOLD}+ товарами нет — docs/brand-classification.tsv актуален.`)
    return
  }

  console.log(`Новые бренды с ${CLASSIFY_THRESHOLD}+ товарами, которых нет в docs/brand-classification.tsv:`)
  for (const r of unclassified) {
    console.log(`  ${r.brandName}\t${r.cnt}`)
  }
  console.log('\nДобавь строки в docs/brand-classification.tsv (тип МАРКА/БРЕНД/ИСКЛЮЧИТЬ/СЕРАЯ_ЗОНА)')
  console.log('и, если МАРКА/БРЕНД — соответствующую запись в lib/categories.ts (ALL_VEHICLE_MAKES / ALL_PART_BRANDS).')
}

main()
  .catch((e) => { console.error('Ошибка:', e.message); process.exitCode = 1 })
  .finally(() => client.end())
