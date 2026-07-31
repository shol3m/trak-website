# Архитектура сайта ТРАК

_Последнее обновление: 2026-08-01_

---

## Страницы (реализованы)

| Путь | Описание |
|---|---|
| `/` | Главная: HeroSlider → AdvantagesSection → CategoriesSection → ProductsSection → ServiceSection → ReviewsSection |
| `/catalog` | Корень каталога: плитки 15 корневых категорий (`getCategoryTree()`) + общий поиск по всем товарам (debounce 350ms, мультислово AND), сортировка (цена ↑↓), переключатель сетка/список, пагинация (50/стр) |
| `/catalog/[...path]` | Catch-all для дерева категорий 1С (920 категорий, до 4 уровней). Категория определяется по последнему сегменту URL (слаги глобально уникальны). Хлебные крошки + плитки подкатегорий + товары всей ветки (фильтр по префиксу `Category.path`, не только точная категория) |
| `/product/[article]` | Карточка товара: галерея, артикул, цена, кнопка в корзину, полный breadcrumb через `getCategoryNode()` |
| `/service` | Услуги автосервиса по вкладкам (mock-данные) |
| `/about` | О компании: stats, сертификаты с lightbox |
| `/contacts` | Контакты: отделы с цветными бордерами, Яндекс.Карты embed |
| `/` (layout) | Header + Footer на всех страницах |

**Редиректы старых URL** (`next.config.mjs` + логика в `[...path]/page.tsx`):
- 7 старых плоских категорий (`dvigateli`, `filtry`...) → `/catalog` (308, статический редирект)
- Старые `/catalog/[slug]/[article]` → `/product/[article]` (307, динамический: если сегмент не резолвится в категорию, но резолвится в товар по артикулу)

## Страницы (не реализованы)
- `/portfolio`, `/reviews`, `/articles` — нет дизайна, не приоритет
- `/account`, `/checkout` — нет авторизации (NextAuth установлен, но не используется)

---

## API Routes

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/booking` | Запись на СТО → Telegram. Zod-валидация, honeypot. ⚠️ "Rate-limit" — только client-side UI-стейт, сервер ничем не защищён (см. «Известные технические ограничения») |
| POST | `/api/order` | Заказ из корзины → БД + Telegram. Цена из БД по артикулу (защита от подмены цены с клиента для известных товаров) |
| GET | `/api/orders` | Для 1С: PENDING заказы → CSV, затем → PROCESSING. Basic Auth |
| POST | `/api/products` | Для 1С: приём CSV прайса, upsert в БД, категория по `Код_Каталога` → `Category.externalId`. После успешного синка — `invalidateCategoryTree()` (сбрасывает кеш дерева категорий на всех инстансах). Basic Auth |

---

## Источники данных

### Каталог (чтение) — Supabase JS клиент
`lib/supabase.ts` → `lib/db-catalog.ts` → Supabase PostgREST (HTTP/REST)

Используется для всех read-операций каталога: `getProducts`, `getProductByArticle`, `getFeaturedProducts`, `getCategoryTree`, `getCategoryNode`.

Дерево категорий кешируется через `unstable_cache` (тег `categories`, см. «Дерево категорий» ниже) — не голой module-level переменной, инвалидация из `/api/products` работает на всех serverless-инстансах.

**Почему не Prisma для каталога:** Prisma + Supavisor transaction mode (порт 6543) на Windows зависает на `DEALLOCATE ALL` при второй транзакции в рамках одного PrismaClient. Обходится через HTTP-клиент Supabase (stateless, без connection pool).

### Заказы / Бронирования (запись) — Prisma
`lib/prisma.ts` → Supavisor pooler (порт 6543)

Используется для write-операций: сохранение заказов, бронирований; и для 1С-синхронизации (`/api/products`).

### Import-скрипты — Prisma / raw pg напрямую
`scripts/import-products.mjs` (Prisma), `scripts/import-categories.mjs` (raw `pg` Client, идемпотентен), `scripts/generate-import-csv.mjs` (raw `pg`, только для чтения карты категорий)

### Дерево категорий — materialized path
`Category.path` = `/id-родителя/.../id-этой-категории`. Фильтр «товары этой ветки целиком» — `path = X OR path LIKE 'X/%'` (через `.or()` с `foreignTable`, не голый `LIKE 'X%'` — иначе id одной категории теоретически может оказаться строковым префиксом другой).

`getCategoryTree()`/`getCategoryNode()` строят дерево в памяти из закешированных строк, `hasProducts` считается рекурсивно вверх (категория «жива», если у неё самой или у любого потомка есть активный товар). Различают «категории нет» (null) от «БД недоступна» (throw) — на сбой БД `/catalog/[...path]` показывает «временно недоступен», не жёсткий 404.

---

## Структура данных (актуальные поля)

### Product
```
id, article, name, slug, description, categoryId
priceRetail, priceWholesale?, stock
isActive (bool), isOrderable (bool)
brandName?, externalId?, source?, syncedAt?
weight?, createdAt, updatedAt
```

### Category (927 записей: 920 из справочника 1С + 7 старых плоских, больше не используются товарами)
```
id, name, slug, path, level, sortOrder, parentId, externalId
```
`externalId` = `Код` из `КаталогиСайт.txt` (справочник 1С), уникальный. Дерево до 4 уровней. Старые 7 slug (`dvigateli`, `filtry`, `podveska`, `tormoznaya-sistema`, `masla-i-zhidkosti`, `transmissiya`, `prochee`) остались в БД как fallback-категория `prochee` + мёртвые записи, товарами больше не заполняются.

### Order + OrderItem
```
Order: id, userId?, name, phone, total, status, comment?, syncedAt?, createdAt
OrderItem: id, orderId, productId?, article, itemName, quantity, price
```

### Booking
```
id, userId?, name, phone, carBrand?, carModel?, carYear?, service, date, status, comment?
```

---

## Глобальный стейт (Zustand)

- `lib/cart-store.ts` — `useCartStore`: items[], isOpen, addItem, removeItem, updateQty, clearCart, openCart. Persist в localStorage (`trak-cart`). Экспортирует `useCartTotal`, `useCartCount`.

---

## RLS (Row Level Security)

Все таблицы с включённым RLS:

| Таблица | Публичный доступ (anon) |
|---|---|
| Product | SELECT (isActive = true) |
| Category | SELECT |
| Brand, CarModel | SELECT |
| ProductImage | SELECT |
| Article | SELECT (publishedAt NOT NULL) |
| Order, OrderItem, Booking | ❌ (deny all) |
| User, Account, Session, Review | ❌ (deny all) |
| _prisma_migrations | ❌ (deny all) |

---

## Конфигурация

### next.config.mjs
- Удаляет `HTTPS_PROXY`/`HTTP_PROXY` при старте (мешают Supabase HTTP-запросам)
- Задаёт дефолты для `NEXT_PUBLIC_SUPABASE_*` (публичные ключи, нормально хардкодить)

### tailwind.config.ts
- `darkMode: 'class'`
- 7 семантических токенов: `bg-bg-page`, `bg-bg-card`, `bg-bg-muted`, `border-ui-border`, `text-text-base`, `text-text-dim`, `text-text-ghost`

### prisma/schema.prisma
- `binaryTargets: ["native", "rhel-openssl-3.0.x"]` — для Windows dev + Linux prod
- `directUrl = env("DIRECT_URL")` — для миграций

---

## Известные технические ограничения

| Ограничение | Причина |
|---|---|
| Prisma не используется для чтения каталога | DEALLOCATE ALL hang на Supavisor с одним PrismaClient |
| Порт 5432 (direct) заблокирован у разработчика | Провайдер блокирует исходящий порт 5432 |
| `connection: close` в Supabase клиенте | Stale keep-alive соединения → 15s таймауты |
| `HTTPS_PROXY` удаляется при старте | Proxy нужен только для Telegram, мешает всему остальному |
| Нет rate-limit на `/api/order`/`/api/booking` | Публичные роуты, ничем не защищены от флуда — известный, не устранённый риск |
| Явный `.limit(5000)` на запросах категорий в `lib/db-catalog.ts` | PostgREST по умолчанию режет выборку на ~1000 строк, категорий уже 927 — без явного лимита рост от 1С может молча обрезаться |

---

## Тесты

Vitest (`npm run test`, конфиг `vitest.config.mts`). Появились 2026-08-01, тестов раньше не было вообще.

- `lib/phone-utils.test.ts` — форматирование номера по мере набора, конвертация 8→7, нормализация, валидация длины
- Дальше по плану: `/api/order`, `/api/booking` (нужны моки Prisma + Telegram-запроса) — см. `CLAUDE.md` → «ЧТО НЕ РЕАЛИЗОВАНО»
