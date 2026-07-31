# Интеграции

_Последнее обновление: 2026-08-01_

---

## Supabase (реализовано)

**Проект:** `scprbpqwugshqbttbowe`, регион `eu-west-2`

### Клиент для чтения (каталог)
`lib/supabase.ts` — `createClient` с publishable key.
Используется для: `getProducts`, `getProductByArticle`, `getFeaturedProducts`, `getCategories`.

Публичный ключ: `sb_publishable_588VWvqjtvBQoWcqy2aSuQ_We17-S4S`
URL: `https://scprbpqwugshqbttbowe.supabase.co`

Важно: `connection: close` header + `cache: no-store` в кастомном fetch — без них stale keep-alive соединения вызывают 15s таймауты.

### Prisma (миграции + запись)
Для write-операций (заказы, бронирования) и import-скриптов используется Prisma через pooler.
```
DATABASE_URL = postgresql://postgres.scprbpqwugshqbttbowe:...@aws-1-eu-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=5&pool_timeout=30&sslmode=disable
DIRECT_URL   = та же строка без pgbouncer (для миграций)
```

### MCP
`claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=scprbpqwugshqbttbowe"`
После добавления: `claude /mcp` → выбрать supabase → Authenticate.

---

## 1С (реализовано)

Обмен данными: 1С инициирует запросы к сайту (push-модель).

### Авторизация
Basic Auth — заголовок `Authorization: Basic base64(login:password)`
Env: `SYNC_LOGIN`, `SYNC_PASSWORD`
Реализовано через `timingSafeEqual` (защита от timing attack).

### POST /api/products — приём товаров
1С отправляет CSV с разделителем `;` или `\t`, кодировка UTF-8.

**Формат входящих данных:**
```
Код;Код_Каталога;Код_Поставщика;Наименование;Артикул;Бренд;Цена1;Остаток;
000076875;000000621;50489268;РЕМЕНЬ ПОЛИКЛИНОВОЙ;117202F205;NISSAN;450;5;
```

| Поле 1С | Поле БД |
|---|---|
| Код | externalId (ключ upsert) |
| Код_Каталога | categoryId — через `Category.externalId` |
| Код_Поставщика | не сохраняется |
| Наименование | name |
| Артикул | article |
| Бренд | brandName |
| Цена1 | priceRetail |
| Остаток | stock |

**Логика категорий:** `Код_Каталога` ищется в `Category.externalId` (справочник из `КаталогиСайт.txt`, 920 категорий, дерево до 4 уровней — залит `scripts/import-categories.mjs`). Нет кода или код не найден → категория «Прочее». Старый keyword-маппинг по названию (`detectCategorySlug`) удалён.

**Режим синхронизации:** инкрементальный. Товар с price=0 и stock=0 → `isActive=false`. Периодичность: раз в сутки.

**Ответ:**
```json
{ "ok": true, "upserted": 9, "errors": 0, "total": 9 }
```

### GET /api/orders — выгрузка заказов
1С забирает заказы со статусом `PENDING`. После выдачи → `PROCESSING`.

**Формат ответа (CSV, UTF-8):**
```
Номер_Заказа;Дата;Имя;Телефон;Артикул;Наименование;Количество;Цена;Комментарий
abc123;2026-05-14T10:00:00.000Z;Иван;79991234567;117202F205;РЕМЕНЬ ПОЛИКЛИНОВОЙ;2;450;
```

### FTP-синхронизация (не реализована)
1С кладёт `products.csv` на FTP-сервер. Нужен GitHub Actions worker:
- Cron раз в сутки (или чаще)
- Скачивает `products.csv` с FTP
- POST `/api/products` с Basic Auth
- Нет зависимости от хостинга — будет работать после переезда

### Категории от 1С (реализовано, 2026-08-01)
Справочник `КаталогиСайт.txt` (920 категорий) залит в `Category` (`externalId` = `Код`).
Все 280k товаров перекатегоризированы прогоном свежего `products.csv` через `scripts/import-products.mjs` — 813 реальных категорий сейчас в использовании.

---

## Telegram (реализовано)

Уведомления при новой записи на СТО и новом заказе.

- `POST /api/booking` — запись на СТО → plain text (без parse_mode Markdown)
- `POST /api/order` — заказ товара + сохранение в БД → plain text

Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_CHAT_ID_2`

Локальная разработка через прокси: `HTTPS_PROXY` в `.env.local` (НЕ ставить на Vercel/prod).
`next.config.mjs` удаляет эти env vars при старте сервера чтобы не мешали Supabase.

---

## Яндекс Карты (реализовано)

Embed через `map-widget/v1/org/trak/1100951090` в `ContactsSection.tsx`.
Без API-ключа — используется публичный виджет организации.

---

## СМС-уведомления (не реализовано)

Клиенту при подтверждении записи.
Провайдер: SMSC.ru или SMS.ru
Env: `SMS_API_KEY`
