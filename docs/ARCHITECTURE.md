# Архитектура сайта ТРАК

_Последнее обновление: 2026-05-22_

---

## Страницы (реализованы)

| Путь | Описание |
|---|---|
| `/` | Главная: HeroSlider, Advantages, Service, Categories, Products, ServiceGallery, Reviews, Contacts |
| `/catalog` | Каталог запчастей: поиск, категории-табы, пагинация (50/стр) |
| `/catalog/[slug]` | Каталог по категории (slug = dvigateli, filtry, podveska, tormoznaya-sistema, masla-i-zhidkosti, transmissiya) |
| `/catalog/[slug]/[article]` | Карточка товара: галерея, артикул, цена, кнопка в корзину |
| `/service` | Услуги автосервиса по вкладкам (mock-данные) |
| `/about` | О компании: stats, сертификаты с lightbox |
| `/` (layout) | ContactsSection + Footer на всех страницах |

## Страницы (не реализованы)
- `/portfolio`, `/reviews`, `/articles` — нет дизайна, не приоритет
- `/account`, `/checkout` — нет авторизации (NextAuth установлен, но не используется)

---

## API Routes

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/booking` | Запись на СТО → Telegram. Zod-валидация, honeypot, rate-limit |
| POST | `/api/order` | Заказ из корзины → БД + Telegram. Цена из БД по артикулу |
| GET | `/api/orders` | Для 1С: PENDING заказы → CSV, затем → PROCESSING. Basic Auth |
| POST | `/api/products` | Для 1С: приём CSV прайса, upsert в БД. Basic Auth |

---

## Источники данных

### Каталог (чтение) — Supabase JS клиент
`lib/supabase.ts` → `lib/db-catalog.ts` → Supabase PostgREST (HTTP/REST)

Используется для всех read-операций каталога: `getProducts`, `getProductByArticle`, `getFeaturedProducts`, `getCategories`.

**Почему не Prisma для каталога:** Prisma + Supavisor transaction mode (порт 6543) на Windows зависает на `DEALLOCATE ALL` при второй транзакции в рамках одного PrismaClient. Обходится через HTTP-клиент Supabase (stateless, без connection pool).

### Заказы / Бронирования (запись) — Prisma
`lib/prisma.ts` → Supavisor pooler (порт 6543)

Используется для write-операций: сохранение заказов, бронирований; и для 1С-синхронизации (`/api/products`).

### Import-скрипты — Prisma напрямую
`scripts/import-products.mjs`, `getOrCreateCategoryId()` в `lib/db-catalog.ts`

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

### Category (7 записей)
```
id, name, slug, path, level, sortOrder
```
Slugs: `dvigateli`, `filtry`, `podveska`, `tormoznaya-sistema`, `masla-i-zhidkosti`, `transmissiya`, `prochee`

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
