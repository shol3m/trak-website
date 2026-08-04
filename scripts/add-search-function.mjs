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

// SECURITY DEFINER (owned by the table owner) bypasses RLS, which otherwise
// blocks index pushdown for non-leakproof operators like ILIKE. Just as
// important: the ILIKE patterns are built via dynamic EXECUTE with the actual
// search words embedded as literals (format %L), not passed as plain function
// parameters — a plain "language sql" function plans ILIKE args generically
// (can't see the literal value), which alone was enough to make Postgres
// fall back to a full scan even with RLS bypassed.
const sql = `
-- New params (p_in_stock/p_price_min/p_price_max) give this a different
-- signature than the old 5-arg version, so "create or replace" would add an
-- overload instead of replacing it — drop the old signature explicitly first.
drop function if exists search_products(text, text, text, text, int);
-- p_brand changed from text to text[] (multi-select brand/make filter,
-- 2026-08-04) — same reasoning, drop the single-brand signature explicitly.
drop function if exists search_products(text, text, text, text, int, boolean, numeric, numeric);

create or replace function search_products(
  p_search text default null,
  p_category_path text default null,
  p_brand text[] default null,
  p_sort text default null,
  p_page int default 1,
  p_in_stock boolean default null,
  p_price_min numeric default null,
  p_price_max numeric default null
)
returns table (
  id text,
  name text,
  article text,
  "priceRetail" numeric,
  stock int,
  "brandName" text,
  "externalId" text,
  description text,
  category_slug text,
  category_name text,
  total_count bigint
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_search_cond text := 'true';
  v_word text;
  v_first boolean := true;
begin
  if p_search is not null and trim(p_search) <> '' then
    v_search_cond := '';
    foreach v_word in array string_to_array(trim(p_search), ' ') loop
      if v_word <> '' then
        if not v_first then
          v_search_cond := v_search_cond || ' and ';
        end if;
        v_search_cond := v_search_cond ||
          format('(p.name ilike %L or p.article ilike %L)', '%' || v_word || '%', '%' || v_word || '%');
        v_first := false;
      end if;
    end loop;
    if v_search_cond = '' then
      v_search_cond := 'true';
    end if;
  end if;

  return query execute format($f$
    select p.id, p.name, p.article, p."priceRetail", p.stock, p."brandName", p."externalId", p.description,
           c.slug, c.name, count(*) over() as total_count
    from "Product" p
    inner join "Category" c on c.id = p."categoryId"
    where p."isActive" = true
      and %s
      and ($1::text is null or c.path = $1 or c.path like $1 || '/%%')
      and ($2::text[] is null or p."brandName" = any($2))
      and ($5::boolean is null or p.stock > 0)
      and ($6::numeric is null or p."priceRetail" >= $6)
      and ($7::numeric is null or p."priceRetail" <= $7)
    order by
      case when $3 = 'price_asc' then p."priceRetail" end asc nulls last,
      case when $3 = 'price_desc' then p."priceRetail" end desc nulls last,
      case when $3 is null or $3 not in ('price_asc', 'price_desc') then p.stock end desc nulls last,
      case when $3 is null or $3 not in ('price_asc', 'price_desc') then p."priceRetail" end desc nulls last,
      case when $3 is null or $3 not in ('price_asc', 'price_desc') then p.id end asc
    limit 50 offset $4
  $f$, v_search_cond)
  using p_category_path, p_brand, p_sort, (greatest(p_page, 1) - 1) * 50, p_in_stock, p_price_min, p_price_max;
end;
$$;

grant execute on function search_products(text, text, text[], text, int, boolean, numeric, numeric) to anon, authenticated;
`

async function main() {
  await client.connect()
  console.log('Пересоздаём функцию search_products (plpgsql + dynamic EXECUTE)...')
  await client.query(sql)
  console.log('Готово.')
}

main()
  .catch((e) => { console.error('Ошибка:', e.message); process.exitCode = 1 })
  .finally(() => client.end())
