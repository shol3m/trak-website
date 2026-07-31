# ПРОГРЕСС ПРОЕКТА ТРАК

_Последнее обновление: 2026-08-01_

---

## Фиксы по итогам аудита (code-review + code-auditor, 2026-08-01)

- `next.config.mjs` — `redirects()`: 7 старых мёртвых категорий (`dvigateli`, `filtry` и т.д.) → `/catalog` (308, permanent)
- `app/catalog/[...path]/page.tsx` — если сегмент URL не резолвится в категорию и путь ≥2 сегментов, пробуем найти товар по последнему сегменту (`getProductByArticle`) и редиректим на `/product/[article]` — закрывает старые ссылки `/catalog/[slug]/[article]` без хардкода паттернов
- `lib/db-catalog.ts` — дерево категорий переведено с голой module-level переменной (`_treeCache`, живёт только в рамках одного serverless-инстанса) на `unstable_cache` с тегом `categories` — инвалидация теперь работает across всех инстансов. Добавлен `invalidateCategoryTree()`, вызывается из `app/api/products/route.ts` после успешного синка от 1С
- `lib/db-catalog.ts` — явный `.limit(5000)` на оба запроса категорий (было без лимита — PostgREST молча обрезает на дефолтных ~1000, а категорий уже 927)
- **Поймали и починили баг в процессе:** обёртка `unstable_cache` кеширует и ошибочный результат, если функция не throw'ает. При первом же транзиентном таймауте БД (`57014 canceling statement due to statement timeout` на JOIN Category↔Product) пустое дерево закешировалось намертво — все категории отдавали 404. Функция теперь `throw`-ит на ошибке вместо `return {cats:[],...}`, `loadTree()` ловит исключение и деградирует как раньше (retry на следующий запрос, а не постоянный пустой кеш)

## Вторая волна фиксов по аудиту (2026-08-01)

- `lib/db-catalog.ts` — фильтр товаров по ветке категорий (`getProducts({categoryPath})`) был `Category.path LIKE 'X%'` без границы `/` после префикса: теоретически id одной категории мог оказаться строковым префиксом id другой (проверял вживую — коллизий на текущих 927 id нет, но гарантии не было). Заменено на `path.eq.X OR path.like.X/*` — закрывает границу полностью
- `lib/db-catalog.ts` — `getCategoryNode()`/`getCategoryTree()` теперь различают «категории нет» (null, дерево загрузилось) и «БД недоступна» (throw). `/catalog` при сбое молча прячет плитки (как раньше), `/catalog/[...path]` при сбое показывает «каталог временно недоступен» вместо жёсткого 404 — раньше сбой БД выглядел как несуществующая страница
- `app/api/products/route.ts` — `getCategoryId()` кешировал только успешные попадания по `Код_Каталога`; товар с неизвестным/пустым кодом дёргал Prisma заново на каждой строке синка с этим кодом. Теперь кешируется и фолбэк
- `scripts/generate-import-csv.mjs` — единственное оставшееся место со старой keyword-категоризацией по названию (расходилась с реальной по `Код_Каталога`). Переведено на ту же логику, что и остальные импорт-скрипты — подгружает карту `externalId → categoryId` одним запросом в начале
- `next-auth` — проверил, нигде не импортируется, но **не удалял**: в `CLAUDE.md` явно прописан в разделе «СТЕК (не обсуждается)», значит это декларированный выбор под будущую авторизацию, а не случайный мёртвый код. Оставлено как есть
- Настроен ESLint (`.eslintrc.json`, `next/core-web-vitals`) — раньше `npm run lint` не работал вообще, конфига не было. Нашлось одно предупреждение (`react-hooks/exhaustive-deps` на дебаунсе поиска в `CatalogView.tsx`) — намеренно подавлено с комментарием, добавление зависимостей сломало бы дебаунс

## Реальное дерево категорий 1С + иерархический каталог (2026-08-01)

### Категории из справочника 1С

- Получен `КаталогиСайт.txt` — официальный справочник категорий от 1С: 920 категорий, иерархия до 4 уровней (`Код` / `КодРодитель` / `Наименование`)
- `prisma/schema.prisma` — добавлено поле `Category.externalId` (уникальное, хранит `Код` из справочника)
- `scripts/import-categories.mjs` — новый скрипт, парсит `КаталогиСайт.txt` и заливает полное дерево в `Category` (path/level/parentId по иерархии). Идемпотентен (upsert по `externalId`)
- `app/api/products/route.ts` — категоризация товаров теперь по `Код_Каталога` (2-е поле CSV от 1С, раньше игнорировалось) через `Category.externalId`, вместо угадывания по ключевым словам в названии. Неизвестный/пустой код → категория «Прочее»
- `scripts/import-products.mjs` — тот же принцип категоризации (для одноразовых импортов из `products.csv`)
- `lib/categories.ts` — удалена keyword-детекция (`detectCategorySlug`, `CATEGORY_KEYWORDS`), она больше не нужна. `STATIC_CATEGORIES` оставлен — используется только для витрины на главной (`CategoriesSection`)
- **Существующие 280k товаров перекатегоризированы** — прогнан свежий `products.csv` через обновлённый `scripts/import-products.mjs` (813 реальных категорий теперь используются, старые 7 плоских полностью опустели). Нашли и исправили баг: `ON CONFLICT DO UPDATE SET` в SQL не включал `"categoryId"`, из-за чего первый прогон отчитался об успехе, но категорию не менял — поймали только сверкой живых данных, не по логу скрипта

### Иерархический каталог (замена плоского таб-бара)

- `lib/db-catalog.ts` — `getCategoryTree()` / `getCategoryNode(slug)`: дерево строится 2 запросами, кешируется в памяти модуля, `hasProducts` считается рекурсивно вверх (категория «жива», если у нее или у потомка есть товар). `getProducts()` фильтрует по префиксу `Category.path` — сразу вся ветка, не только точная категория
- `app/catalog/page.tsx` — плитки 15 корневых категорий + общий поиск по всем товарам
- `app/catalog/[...path]/page.tsx` — новый catch-all вместо `[slug]/page.tsx`, работает на любую глубину дерева: хлебные крошки + плитки подкатегорий + товары всей ветки
- `app/catalog/CategoryTiles.tsx`, `components/ui/Breadcrumb.tsx` — новые переиспользуемые компоненты
- Товар переехал с `/catalog/[slug]/[article]` на `/product/[article]` — освобождает роут категорий от коллизий с catch-all, артикул и так глобально уникален
- `components/sections/CategoriesSection.tsx` (главная) — 6 плиток вели на старые 7 slug, которые опустели после перекатегоризации → переведены на поиск по ключевому слову (`/catalog?q=...`) вместо прямой ссылки на (теперь пустую) категорию

### Мелкий фикс UX

- `app/catalog/CatalogView.tsx` — оба пустых состояния каталога («Товары появятся после первой синхронизации с 1С») заменены на нейтральное «Товары не найдены» — старая формулировка была видна покупателям на сайте

---

## Наведение порядка + документация (2026-05-25)

### Реализовано

- Убраны ~25 скриншотов из корня → перемещены в `screenshots/` (добавлен в `.gitignore`)
- Удалены: `logo.png` в корне (дубль), `utils/supabase/` (не использовался), `app/font-compare/` (dev-страница)
- Удалён мёртвый код `SearchRow` / `adaptSearch` из `lib/db-catalog.ts`
- `.gitignore` обновлён: добавлены `.playwright-mcp/`, `screenshots/`, `*.woff2`
- `app/sitemap.ts` — добавлен `/contacts` (был пропущен)
- Документация приведена в соответствие: `CLAUDE.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/BRIEF.md`

---

## Каталог UX + Контакты + UX-фиксы (2026-05-23 – 2026-05-25)

### Реализовано

**Страница `/contacts` (полный редизайн):**
- `app/contacts/page.tsx` — два отдела в левой колонке, карта + адрес в правой (grid 2 колонки)
- Каждый отдел с цветным left-border strip: Магазин `#C8102E`, Автосервис `#1A3A6B`, Оптовый `#C4922A`
- Яндекс.Карты embed `map-widget/v1/org/trak/1100951090`, высота 320px
- Email / WhatsApp в блоке `bg-bg-muted` (визуально отличается от карточек отделов)
- `ContactsSection.tsx` более не используется — заменён страницей

**CatalogView — полная переработка UX (`app/catalog/CatalogView.tsx`):**
- Debounced поиск 350ms (useEffect с setTimeout). Sync от server props через отдельный useEffect
- Сортировка: `price_asc` / `price_desc` (сортировка по имени убрана — вызывала таймауты)
- Переключатель вид: сетка / список. Список — компонент `ProductListRow` (артикул + название + статус + цена + кнопка)
- `buildUrl()` — централизованный билдер URL с q/sort/page параметрами
- Кнопка «Все» захардкожена как `/catalog` (не через `buildUrl`) — исправляет баг с категорией на `basePath`
- `lib/db-catalog.ts` — параметр `sort`, поиск мультислово AND через цепочку `.or()`:
  ```ts
  for (const word of words) query = query.or(`name.ilike.%${word}%,article.ilike.%${word}%`)
  ```

**UX-фиксы главной страницы:**
- `CategoriesSection.tsx` — карточки категорий переделаны в горизонтальные строки (icon + name + chevron) вместо вертикальных карточек
- `ServiceSection.tsx` — добавлены 3 feature-пункта (checkmark-circle SVG) перед CTA: «3D развал-схождение», «Гарантия», «Без выходных»
- `ReviewsSection.tsx` + `ReviewCard.tsx` — добавлен `h-full` для выравнивания высот карточек в Embla Carousel
- `SectionHeading.tsx` — добавлен `mx-auto` для центрирования subtitle при `align="center"`

### Известные ограничения поиска
Поиск работает как substring ilike — «фильтр» найдёт «фильтры», но опечатки не обрабатываются. Fuzzy-поиск требует GIN-индекс в БД (pg_trgm) — не реализован из-за statement timeout на 280k строках без индекса.

---

## Design Review + Emoji → SVG (2026-05-22)

### Реализовано

**Иконки:**
- `lib/categories.ts` — удалено поле `icon` (было emoji)
- `lib/mock-data.ts` — удалено поле `icon` из типа `MockService` и всех 17 услуг
- `components/sections/CategoriesSection.tsx` — emoji заменены на SVG-иконки (карта `ICONS` по slug)
- `components/sections/ServiceSection.tsx` — emoji → красный SVG checkmark-circle
- `components/ui/ServiceCard.tsx` — emoji → SVG иконка инструмента
- `app/about/page.tsx` — emoji в advantages → inline SVG (медаль, склад, ключ, щит)

**Галерея сервиса:**
- `components/sections/ServiceGallery.tsx` — пути `.svg` → `.jpg`, добавлен стилизованный плейсхолдер (иконка + alt-текст) пока нет реальных фото

**Хедер:**
- Мобильная строка: убран дублирующий номер телефона `font-mono text-xs` (он есть в бургер-меню)

**SEO/Meta:**
- `app/layout.tsx` — добавлены `og:url: 'https://trak-ufa.ru'` и `og:siteName: 'ТРАК'`

### Правило на будущее
Emoji запрещены в UI. Только SVG-иконки (stroke, currentColor, viewBox 0 0 24 24).

---

## Каталог + Security + Категории из БД (2026-05-22)

### Реализовано

**Каталог через Supabase JS клиент:**
- `lib/supabase.ts` (новый) — `createClient` с кастомным fetch: `cache: no-store`, `connection: close` (предотвращает 15s stale keep-alive таймауты), удаляет `HTTPS_PROXY`/`HTTP_PROXY` при инициализации
- `lib/db-catalog.ts` — полностью переписан на Supabase JS. Prisma оставлен только для `getOrCreateCategoryId` (используется в import-скриптах). Причина: Prisma + Supavisor (порт 6543) зависал на `DEALLOCATE ALL` при второй транзакции в рамках одного PrismaClient на Windows — нерешаемо без смены хостинга
- `next.config.mjs` — удаляет proxy env vars при старте; задаёт дефолты для `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `app/catalog/page.tsx` — `getProducts` + `getCategories` через `Promise.all`
- `app/catalog/[slug]/page.tsx` — то же + allowlist валидация `params.slug` (→ 404 для неизвестных)
- `app/catalog/CatalogView.tsx` — принимает `categories: DbCategory[]` как prop вместо хардкода `STATIC_CATEGORIES`

**Категории из БД:**
- `getCategories()` в `lib/db-catalog.ts` — fetches из Supabase с module-level кешем
- `DbCategory` тип экспортируется из `lib/db-catalog.ts`
- Отображаются в табах каталога динамически; добавление категории в Supabase → подхватывается автоматически

**Security hardening (коммит d7def04):**
- `app/api/products/route.ts`, `app/api/orders/route.ts` — `checkBasicAuth`: `===` → `timingSafeEqual` из `node:crypto`
- `lib/db-catalog.ts` — `sanitizeSearch()`: вырезает `(),"'\` из поискового запроса перед передачей в PostgREST `.or()` фильтр
- `app/catalog/[slug]/page.tsx` — allowlist `VALID_SLUGS` перед запросом в БД
- `app/api/orders/route.ts` — исправлен `checkBasicAuth` (тот же паттерн что в products)

**RLS:**
- `public.Brand` — включён RLS (ранее был единственной незащищённой таблицей)

**Производительность каталога (локально):**
- Cold start первый запрос: ~5-7s (DNS + TCP handshakes)
- Последующие: 0.5-1s
- На Vercel (co-located с Supabase eu-west-2) будет быстрее

### Нерешённые проблемы
- **`NEXT_PUBLIC_SUPABASE_URL`** и **`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`** нужно добавить в `.env.local` (если не заданы — дефолты берутся из `next.config.mjs`, что нормально для локальной разработки)

---

## Загрузка каталога + интеграция 1С (2026-05-20)

### Реализовано

- **`products.csv`** — получен от 1С разработчика: 280 072 товара, формат `Код;Код_Каталога;...` (заголовок `;`, данные `\t`)
- **`scripts/generate-import-csv.mjs`** — генератор CSV для импорта через Supabase Dashboard (трансформирует products.csv → формат таблицы Product)
- **`scripts/import-products.mjs`** — скрипт прямого импорта через pg/Supabase JS (для будущего использования когда будет стабильное соединение)
- **`utils/supabase/`** — клиент-хелперы (server.ts, client.ts, middleware.ts) для работы с Supabase JS
- **`app/api/products/route.ts`** — исправлен парсер CSV: теперь определяет разделитель автоматически (`\t` или `;`)
- **Категории в БД** — 7 категорий созданы: dvigateli, filtry, tormoznaya-sistema, podveska, masla-i-zhidkosti, transmissiya, prochee
- **Импорт** — 280к товаров загружены через Supabase Dashboard (Table Editor → Import CSV)

### Структура products.csv

| Колонка | Название | Пример |
|---|---|---|
| 0 | Код (externalId) | `000086047` |
| 1 | Код_Каталога | `000000688` |
| 2 | Код_Поставщика | `50515632` |
| 3 | Наименование | `Диск тормозной` |
| 4 | Артикул | `PBD2753` |
| 5 | Бренд | `PATRON` |
| 6 | Цена1 | `0` |
| 7 | Остаток | `0` |

### Известные ограничения

- **Категории** — сейчас 7 (по ключевым словам в названии). Реальных категорий в 1С — 813 `Код_Каталога`, маппящихся на ~15 групп как на trak-ufa.ru. **Ждём от 1С справочник категорий** (`Код_Каталога → Название`).
- **Подключение к БД локально** — `DATABASE_URL` использует transaction pooler (порт 5432 session mode). Прямое соединение через `pg` нестабильно из-за особенностей локальной сети. Импорт через Supabase Dashboard работает надёжно.
- **`DIRECT_URL`** — обновлён на прямой URL Supabase (db.scprbpqwugshqbttbowe.supabase.co:5432)

### ID категорий в БД

| Slug | ID |
|---|---|
| dvigateli | cmp9tvhvf0000hae5xtc3hkzr |
| filtry | cmp9tvjdm0003hae5h3nfkkzm |
| masla-i-zhidkosti | cmpcznfz5047dz0y |
| podveska | cmp9tvmru000bhae5gz7yrlvg |
| prochee | cmp9tvkvw0006hae5j9jjx1wo |
| tormoznaya-sistema | cmpcznfjkfqjxeo4 |
| transmissiya | cmpczng409hstnkg |

---

## Следующие шаги (приоритет)

### 1. Проверить каталог на сайте
После завершения импорта: `npm run dev` → `/catalog` — убедиться что товары отображаются.

### 2. Задеплоить на Vercel
Добавить в Vercel Dashboard → Settings → Environment Variables:
- `DATABASE_URL` — session pooler URL (уже должен быть)
- `DIRECT_URL` — прямой URL Supabase
- `NEXT_PUBLIC_SUPABASE_URL` = `https://scprbpqwugshqbttbowe.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_588VWvqjtvBQoWcqy2aSuQ_We17-S4S`
- `SYNC_LOGIN`, `SYNC_PASSWORD` — для 1С API
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_CHAT_ID_2`
- **НЕ ставить** `HTTPS_PROXY`, `HTTP_PROXY` — сломают сборку

### 3. FTP-синхронизация (GitHub Actions)
Текущая интеграция с 1С работает через FTP: 1С выгружает `products.csv` на FTP-сервер.
Нужно создать `.github/workflows/sync-products.yml`:
- Запускается по расписанию (cron, раз в сутки или чаще)
- Скачивает `products.csv` с FTP
- Прогоняет через логику категоризации
- Делает upsert в БД через `pg` (на GitHub Actions сеть стабильная)
- Использует те же env vars что и сайт

### 4. Категории от 1С (ждём)
Когда придёт справочник `Код_Каталога → Название`:
- Обновить `lib/categories.ts` — заменить 7 категорий на реальные (~15 как на trak-ufa.ru)
- Написать SQL для перекатегоризации товаров в БД
- Обновить UI каталога (вкладки/фильтры)

### 5. Переезд с Vercel на другой хостинг
Сайт будет переезжать на другой хостинг и домен.
- GitHub Actions cron не зависит от хостинга — переносить не нужно
- FTP worker останется рабочим
- Нужно обновить `NEXTAUTH_URL` и `vercel.json` → конфиг нового хостинга

---

## Security fixes (2026-05-17)

### Исправлено

- `app/api/orders/route.ts` — CSV injection: все поля экранируются через `escapeCsv()` (защита от формул в Excel)
- `app/api/order/route.ts` — price tampering: цена берётся из `Product.priceRetail` по артикулу, клиентская цена используется только если товар не найден в БД
- `app/api/order/route.ts`, `app/api/booking/route.ts` — Telegram injection: убран `parse_mode: 'Markdown'`, сообщения отправляются plain text
- `app/api/products/route.ts`, `app/api/orders/route.ts` — Basic Auth: `split(':')` заменён на `indexOf(':')` (корректная обработка паролей с двоеточием)
- `lib/prisma.ts` — query logging отключён в production (утечка PII в логи Netlify)

---

## Supabase + подключение БД к Netlify (2026-05-17)

### Реализовано

- **Supabase** — создан проект, схема задеплоена через `prisma db push`
- **Connection pooler** — переключились на Supavisor (Transaction mode, порт 6543) для стабильной работы Prisma в serverless
- `prisma/schema.prisma` — добавлен `directUrl = env("DIRECT_URL")` и `binaryTargets = ["native", "rhel-openssl-3.0.x"]` для работы на Netlify (Linux)
- `.env.local` — `DATABASE_URL` (pooler), `DIRECT_URL` (прямое соединение), `SYNC_LOGIN`, `SYNC_PASSWORD`
- **Netlify env** — добавлены `DATABASE_URL`, `DIRECT_URL`, `SYNC_LOGIN`, `SYNC_PASSWORD`
- Импорт CSV протестирован локально — 9/9 строк без ошибок

### Данные для специалиста 1С
- **URL:** `https://trak-website.netlify.app/api/products`
- **Метод:** POST, тело — CSV с разделителем `;`
- **Auth:** Basic Auth (логин/пароль — в `.env.local`)

### Следующие шаги
1. **Первая синхронизация** — 1С делает POST с реальным прайсом, проверяем каталог
2. **Фото товаров** — решить как быть без изображений из 1С (заглушка или Supabase Storage)
3. **Заменить SVG-заглушки** в `public/images/` на реальные фото (hero-1..3, gallery-1..6)

---

## SEO + адрес + отзывы (2026-05-17)

### Реализовано

- `app/layout.tsx` — добавлен OpenGraph (`title`, `description`, `locale: ru_RU`, `type: website`); JSON-LD `AutoPartsStore` с адресом, телефонами, email, часами работы
- `components/sections/ContactsSection.tsx` — subtitle обновлён на реальный адрес: "Уфа, ул. Пархоменко, 171"
- `components/sections/ReviewsSection.tsx` — subtitle упрощён; добавлены кликабельные ссылки "Яндекс.Карты" и "2ГИС" под заголовком секции

### Закрытые пункты P1
- ✓ JSON-LD LocalBusiness + OpenGraph в `app/layout.tsx`
- ✓ z-index:9999 на `body::before` — был исправлен ещё в сессии 10 (→ 0)
- ✓ ReviewsSection — убрана фраза "500 клиентов за 30 лет", добавлены ссылки на площадки отзывов

### Осталось из P1
- Заменить SVG-заглушки в `public/images/` на реальные фото (hero-1..3, gallery-1..6)

---

## Каталог из БД + подготовка к 1С (2026-05-15)

### Реализовано

**Новые файлы:**
- `lib/categories.ts` — тип `CatalogProduct`, `STATIC_CATEGORIES` (7 категорий), `detectCategorySlug(name)`, `PAGE_SIZE=50`
- `lib/db-catalog.ts` — Prisma-функции: `getProducts`, `getProductByArticle`, `getFeaturedProducts`, `getOrCreateCategoryId`

**Изменены:**
- `prisma/schema.prisma` — добавлено поле `brandName String?` на модель Product
- `app/api/products/route.ts` — категория определяется по названию товара (`detectCategorySlug`), сохраняется `brandName`, кеш categoryId на запрос
- `app/catalog/page.tsx` — async server component, читает из Prisma, поиск `?q=`, пагинация `?page=`
- `app/catalog/CatalogView.tsx` — полный рерайт: поиск по артикулу/названию, категории-табы, пагинация 50/стр, пустое состояние
- `app/catalog/[slug]/page.tsx` — статические slugs из STATIC_CATEGORIES, данные из Prisma
- `app/catalog/[slug]/[article]/page.tsx` — товар из Prisma, убран `generateStaticParams`
- `app/catalog/[slug]/[article]/AddToCartButton.tsx` — тип `CatalogProduct`
- `components/ui/ProductCard.tsx` — принимает `CatalogProduct`, опциональный `href`, ссылка на страницу товара
- `lib/cart-store.ts` — тип `CatalogProduct` вместо `MockProduct`
- `components/sections/CategoriesSection.tsx` — статические категории из `STATIC_CATEGORIES`
- `components/sections/ProductsSection.tsx` — принимает `products: CatalogProduct[]`, скрывается если пусто
- `components/sections/PartFinderSection.tsx` — убраны импорты mock-data, standalone
- `app/page.tsx` — async, `getFeaturedProducts(4)` из Prisma
- `lib/mock-data.ts` — удалены каталожные типы (MockProduct, mockProducts, mockCategories, FeaturedProduct, featuredProducts, mockModels); остались MockService/mockServices, MockReview/mockReviews

**Поведение при пустой БД:** каталог показывает заглушку "Товары появятся после первой синхронизации с 1С"; главная страница скрывает ProductsSection.

### Следующие шаги
1. **Supabase** — создать проект, получить `DATABASE_URL`
2. **Netlify env** — добавить `DATABASE_URL`, `SYNC_LOGIN`, `SYNC_PASSWORD`
3. **Миграция** — `npx prisma migrate deploy`
4. **Деплой** — задеплоить на Netlify, проверить `/api/products` и `/api/orders`
5. **Первая синхронизация** — 1С делает POST с реальным прайсом, проверяем каталог
6. **Фото товаров** — решить как быть без изображений из 1С (Supabase Storage или заглушка)

---

## Интеграция с 1С (2026-05-14)

### Реализовано

**`prisma/schema.prisma`**
- `Order.userId` — опциональный (гостевые заказы без авторизации)
- `Order` — добавлены поля `name`, `phone`, `syncedAt`
- `OrderItem.productId` — опциональный (товар может быть не в БД)
- `OrderItem` — добавлены поля `article`, `itemName`

**`app/api/order/route.ts`** — обновлён
- Заказы теперь сохраняются в БД перед отправкой в Telegram
- Telegram-отправка не блокирует сохранение (если токен не задан — просто пропускается)

**`app/api/orders/route.ts`** — новый
- `GET /api/orders` — для 1С: отдаёт заказы со статусом `PENDING` в CSV (разделитель `;`)
- Формат: `Номер_Заказа;Дата;Имя;Телефон;Артикул;Наименование;Количество;Цена;Комментарий`
- После выдачи автоматически помечает заказы как `PROCESSING` + записывает `syncedAt`
- Авторизация: Basic Auth (`SYNC_LOGIN` / `SYNC_PASSWORD` в env)

**`app/api/products/route.ts`** — новый
- `POST /api/products` — для 1С: принимает CSV с разделителем `;`
- Формат входящих данных: `Код;Код_Каталога;Код_Поставщика;Наименование;Артикул;Бренд;Цена1;Остаток`
- Upsert по `externalId` (поле `Код` из 1С)
- Категории создаются автоматически по `Код_Каталога`
- Авторизация: Basic Auth

### Env-переменные (добавить)
```
SYNC_LOGIN=логин
SYNC_PASSWORD=пароль
```

### Что ещё нужно
- Получить логин/пароль от специалиста 1С для тестирования
- Уточнить формат ответа на заказы если 1С ожидает что-то иное

---

## P2 + P3 аудита UX/UI (2026-04-23, сессия 11)

### P2 — Новые компоненты

- `components/sections/BrandsSection.tsx` — 4 карточки брендов (ГАЗ — "Официальный дилер", УАЗ — "Субдилер"), staggered Framer Motion, hover border-red. Вставлена в `app/page.tsx` после AdvantagesSection
- `components/sections/PartFinderSection.tsx` — client-компонент: select Марка → Модель → Категория. При выборе марки обновляет список моделей. Кнопка "Найти запчасть" → `/catalog?brand=...&model=...&category=...`. Вставлена после CategoriesSection
- `components/ui/WhatsAppButton.tsx` — fixed bottom-right, зелёный (#25D366), анимация появления delay 1.5s, tooltip при hover. Добавлена в `app/layout.tsx`
- `lib/mock-data.ts` — добавлен `mockModels: Record<brand, string[]>` (5 моделей ГАЗ, 5 ВАЗ, 4 УАЗ, 4 КАМАЗ)

### P3 — Улучшения

- `components/sections/AdvantagesSection.tsx` — emoji (`✓`, `⚡`, `🛡`, `30+`) заменены на inline SVG-иконки (checkmark, lightning, shield, clock)
- `components/layout/Footer.tsx` — динамический год уже был реализован в сессии 10 (`new Date().getFullYear()`)
- `app/sitemap.ts` — создан, 4 URL: `/`, `/service`, `/catalog`, `/about`

`npx tsc --noEmit` — ✓

---

## Данные + анимации (2026-04-22, сессия 10)

**Исправление данных:**
- `docs/BRIEF.md` — разделены марки: магазин (ГАЗ/ВАЗ/УАЗ/КАМАЗ) vs сервис (ГАЗ/ВАЗ/УАЗ + иномарки); добавлено примечание об ограничениях (нет шиномонтажа и кузовного ремонта)
- `CLAUDE.md` — добавлена секция "ОГРАНИЧЕНИЯ СЕРВИСА"
- `lib/mock-data.ts` — тип group расширен (`'Электрика'`); добавлены 3 услуги: Ремонт КПП, Ремонт генератора, Ремонт стартера (итого 17 услуг)

**Баг-фикс:**
- `app/globals.css` — `body::before` z-index исправлен с 9999 → 0 (ранее перекрывал focus rings)

**Анимации (Framer Motion, без новых зависимостей):**
- `components/sections/HeroSection.tsx` — parallax на фоновые градиенты (useScroll + useTransform); animated counter для "50 000+" от 0 до значения при появлении в viewport
- `components/sections/AdvantagesSection.tsx` — hover lift на карточках (y: -4px, red shadow)
- `components/layout/Footer.tsx` — TrustCounter анимирует числа "30+" и "50 000+" при скролле до футера; динамический год через `new Date().getFullYear()`; добавлен "Ремонт КПП" в список сервиса

`npm run build` — ✓

---

## UX/UI Аудит (2026-04-22, сессия 9)

**Проведён полный аудит — код изменений не вносился, только план.**

### P1 — Критические проблемы (реализовать первыми)
1. `HeroSection.tsx` — CTA "Записаться на СТО" открывает href=/service вместо BookingModal
2. `ContactsSection.tsx` — нет реального адреса улицы; нет embed Яндекс.Карт
3. `app/layout.tsx` — нет JSON-LD LocalBusiness, нет OpenGraph тегов
4. `app/globals.css` — `body::before` имеет z-index:9999, перекрывает focus rings (accessibility)
5. `ReviewsSection.tsx` — subtitle "500 клиентов за 30 лет" звучит как антидоверие

### P2 — Новые компоненты к созданию
- `BrandsSection.tsx` — логотипы брендов поставщиков
- `PartFinderSection.tsx` — подбор запчастей по марке/модели/категории
- WhatsApp floating кнопка

### P3 — Улучшения
- Emoji иконки в AdvantagesSection → SVG
- Footer: динамический год
- mock-data: новые группы услуг (Шины, Кузов/кондиционер, Электрика)
- `app/sitemap.ts` — создать для SEO

### Тема
Рекомендована гибридная: Header/Hero/Footer тёмные, остальные секции светлые (#F5F7FA).
Палитра задокументирована в CLAUDE.md.

### Шрифты
Текущие Russo One + IBM Plex Sans — оставить. IBM Plex Mono — только для артикулов деталей.

---

## Последние изменения (2026-04-22, сессия 8)

**Выполнено — точечный рефакторинг:**
- `components/layout/Header.tsx` — nav-ссылки `/catalog` и `/delivery` скрыты (закомментированы до реализации)
- `components/sections/HeroSection.tsx` — badge синхронизирован с BRIEF.md; CTA "Найти запчасть" → "Наши услуги" (href `/service`)
- `components/layout/Footer.tsx` — статус компании синхронизирован с BRIEF.md; добавлен второй номер сервиса `+7 903 311-16-45`
- `components/sections/ContactsSection.tsx` — tel: ссылки нормализованы (явный формат `tel:+7...`); заменён map-плейсхолдер на кнопку "Открыть на Яндекс.Картах"
- `app/about/page.tsx` — стат "3 бренда" → "4 бренда (ВАЗ, ГАЗ, УАЗ, КАМАЗ)"; сертификаты: document-иконки → SVG-заглушки через `<Image>`
- `lib/mock-data.ts` — `MockService` расширен полем `group`; 4 сервиса → 14 с группировкой по 4 категориям
- `app/service/page.tsx` — рендер услуг по группам с заголовком группы
- `components/ui/ProductCard.tsx` — `<img>` → `<Image>` из next/image, убран eslint-disable
- `components/ui/Button.tsx` — добавлены `focus-visible` стили (ring) для всех вариантов
- `docs/DESIGN.md` — обновлены ссылки на шрифты: Google Fonts → локальные файлы `public/fonts/`
- `app/layout.tsx` — metadata description синхронизирован: добавлен "субдилер УАЗ и ЗМЗ"
- `next.config.mjs` — добавлен `images: { unoptimized: true }`
- `netlify.toml` — создан (build command + @netlify/plugin-nextjs)
- `public/certificates/cert-{1-4}.svg` — созданы SVG-заглушки сертификатов

`npm run build` — ✓

---

## Последние изменения (2026-04-20, сессия 7)

**Выполнено:**
- `app/layout.tsx` — `next/font/google` заменён на `next/font/local`; шрифты берутся из `public/fonts/` без сетевых запросов при сборке
- `public/fonts/` — добавлены 16 woff2-файлов: Russo One, IBM Plex Sans (400/500/600/700), IBM Plex Mono (400/500); latin + cyrillic сабсеты
- `.env.example` — добавлено предупреждение: `HTTP_PROXY`/`HTTPS_PROXY` только для локальной разработки, не ставить на Netlify
- `npm run build` — прошёл успешно ✓

**Причина:** `next/font/google` пытался скачать шрифты через `HTTP_PROXY=127.0.0.1:12334` во время `next build`, что падало на Netlify (нет локального прокси)

---

## Последние изменения (2026-04-20, сессия 6)

**Выполнено:**
- `.gitignore` — добавлены `.env`, `.env.local`, `.env*.local`, `.next`, `.DS_Store`; ранее секреты не были защищены
- `.env.example` — добавлены `TELEGRAM_CHAT_ID`, `TELEGRAM_CHAT_ID_2`, `HTTPS_PROXY`, `HTTP_PROXY`; все значения пустые
- Проверено: токены нигде не захардкожены в коде — только `process.env`

**⚠️ Внимание:** если `.env.local` был закоммичен до этой сессии — токен бота нужно отозвать через BotFather

---

## Последние изменения (2026-04-20, сессия 5)

**Выполнено:**
- `components/ui/BookingModal.tsx` — порядок полей: Имя → Телефон → Авто; маска телефона `+7 (XXX) XXX-XX-XX`; валидация имени (regex 2–50 символов) и телефона (11 цифр) с ошибками под полями (blur + submit); honeypot поле; rate-limit 30 сек между отправками
- `app/api/booking/route.ts` — строгая zod-валидация: regex для имени и телефона, серверная проверка honeypot

---

## Последние изменения (2026-04-20, сессия 4)

**Выполнено:**
- `app/api/booking/route.ts` — POST endpoint с zod-валидацией, отправляет заявку в два Telegram чата (`TELEGRAM_CHAT_ID`, `TELEGRAM_CHAT_ID_2`), поддержка прокси через `HTTPS_PROXY`
- `components/ui/BookingModal.tsx` — подключена отправка на `/api/booking`, состояния loading/success/error, сброс формы при закрытии
- `.env.local` — добавлены переменные `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

---

## Последние изменения (2026-04-20, сессия 3)

**Выполнено:**
- `app/layout.tsx` — `ContactsSection` вынесен в общий layout (отображается на всех страницах перед футером)
- `app/page.tsx` — убран дублирующий `ContactsSection`
- `components/ui/ServiceBookingCTA.tsx` — новый client-компонент: телефон + кнопка, открывающая `BookingModal`
- `app/service/page.tsx` — CTA-блок заменён на `<ServiceBookingCTA />`, кнопка теперь открывает модальное окно

**Изменённые файлы:**
- `app/layout.tsx`
- `app/page.tsx`
- `app/service/page.tsx`
- `components/ui/ServiceBookingCTA.tsx` (новый)

---

## Последние изменения (2026-04-20, сессия 2)

**Выполнено:**
- `app/service/page.tsx` — кнопка «Позвонить в сервис» → «Записаться на СТО»
- `components/layout/Header.tsx` — `sticky` → `fixed w-full`, hover навигации → синий `#2563EB`
- `app/layout.tsx` — favicon `/logo.png` добавлен в metadata, обёртка `pt-16` для fixed-хедера
- `app/about/page.tsx` — создана страница /about (Hero, Stats, О нас, Преимущества, Сертификаты-плейсхолдеры, CTA)
- Синий `#1A3A6B`/`#2563EB` применён как фирменный акцент (stats-секция, hover, бейджи, карточки сертификатов)

**Изменённые файлы:**
- `app/service/page.tsx`
- `app/layout.tsx`
- `app/about/page.tsx` (новый)
- `components/layout/Header.tsx`

**Примечание по сертификатам:**
Карточки сертификатов готовы к замене на реальные фото — добавить изображения в `public/certificates/cert-1.jpg` ... `cert-4.jpg`.

---

## Последние изменения (2026-04-20)

**Выполнено:**
- Логотип в хедере заменён на текстовый «ТРАК»
- Кнопки «Позвонить в сервис» / «Записаться на сервис» → «Записаться на СТО»
- В модалке добавлено поле «Марка и модель авто», заголовок обновлён
- Категории товаров переименованы («Для двигателя», «Для подвески» и т.д.)
- Шиномонтаж заменён на «3D развал-схождение»
- В HeroSection добавлен синий градиент слева + акцентная полоска под badge

**Изменённые файлы:**
- `components/layout/Header.tsx`
- `components/ui/BookingModal.tsx`
- `components/sections/HeroSection.tsx`
- `components/sections/ServiceSection.tsx`
- `lib/mock-data.ts`

---

## Что сделано

### 1. Инициализация проекта
- Стек: Next.js 14, TypeScript, Tailwind CSS v3, Framer Motion, Prisma 5, Zustand, react-hook-form, zod, NextAuth.js
- Ручная инициализация (create-next-app конфликтовал с CLAUDE.md)
- Фиксы версий: Prisma 5, Tailwind 3, next.config.mjs, types/css.d.ts, tsconfig target ES2017

### 2. Дизайн-система
- `tailwind.config.ts` — бренд-цвета, шрифты (Russo One / IBM Plex Sans / IBM Plex Mono)
- `app/layout.tsx` — Google Fonts через next/font
- `app/globals.css` — CSS-переменные, noise overlay

### 3. База данных (`prisma/schema.prisma`)
- Модели: Brand, CarModel, Category (materialized path), AttributeDefinition, Product, ProductAttribute (valueString/valueNumber), ProductBrand, ProductCompatibility, ProductImage, Order, OrderItem, Booking, Review, Article, User/Account/Session
- Составные индексы для фильтрации каталога 50k+
- Поля интеграции на Product: `externalId`, `source`, `syncedAt`

### 4. Mock-данные (`lib/mock-data.ts`)
- `MockProduct` — 12 товаров (VAZ/GAZ/UAZ/KAMAZ)
- `MockReview` — 3 отзыва
- `MockCategory` — 6 категорий со slug, icon, count
- `MockService` — 4 услуги с ценой и длительностью
- `FeaturedProduct` — универсальный тип (id, name, article, price, stock, imageUrl?)

### 5. Главная страница — UI MVP (`npm run build` ✓)

**Компоненты:**
- `components/layout/Container.tsx` — max-w-[1280px] обёртка
- `components/layout/Header.tsx` — sticky, телефон, CTA кнопка, мобильное меню (AnimatePresence)
- `components/layout/Footer.tsx` — строка доверия (30+/50k+/дилер), 4 колонки, реальные контакты
- `components/ui/Button.tsx` — primary/secondary/ghost, поддержка href
- `components/ui/SectionHeading.tsx` — title + subtitle, align
- `components/ui/ProductCard.tsx` — бейдж "В наличии"/"Под заказ", hover red glow
- `components/ui/ReviewCard.tsx` — звёзды, дата

**Секции (`components/sections/`):**
- `HeroSection` — fullscreen, noise overlay, Framer Motion
- `AdvantagesSection` — 4 карточки преимуществ
- `CategoriesSection` — grid 3×2, Link → /catalog/[slug], hover red border + полоска
- `ProductsSection` — featuredProducts, бейджи наличия
- `ServiceSection` — две колонки, hover "Записаться" на карточках
- `ReviewsSection` — mockReviews
- `ContactsSection` — телефоны, часы, плейсхолдер карты

---

## Следующие шаги

1. **Страница каталога** — `/catalog` и `/catalog/[slug]` с фильтрацией на mock-данных
2. **Страница товара** — `/catalog/[slug]/[article]`
3. **Страница сервиса** — `/service` с формой записи
4. **Catalog API** — спроектировано, не реализовано (`app/api/products/route.ts`, `lib/catalog.ts`)
5. **Корзина** — Zustand store, UI

---

## Известные фиксы

| Проблема | Решение |
|---|---|
| Prisma 7 сломал datasource url | Downgrade до Prisma 5 |
| Tailwind v4 несовместим с tailwind.config.ts | Downgrade до Tailwind v3 |
| next.config.ts не поддерживается Next.js 14 | Переименовать в next.config.mjs |
| TypeScript ошибка при импорте CSS | Создать types/css.d.ts |

---

## Для следующей сессии

Минимальный набор файлов для старта:

```
docs/PROGRESS.md       — этот файл
docs/DESIGN.md         — цвета, типографика, анимации
docs/BRIEF.md          — контакты, марки, услуги
lib/mock-data.ts       — все типы и данные
app/page.tsx           — точка входа главной
prisma/schema.prisma   — структура БД (для API и каталога)
```
