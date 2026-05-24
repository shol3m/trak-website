# ТРАК — Claude Code Project Guide

## ПРАВИЛА (читать обязательно)

### Сессия
- Одна сессия = одно задание. Не берись за смежные задачи.
- Читай только файлы, нужные для текущей задачи — не больше.
- Не держи лишний контекст: не читай весь /docs, только нужный файл.
- Экономь токены: минимум чтений, минимум объяснений, только действия.
- Не пушить в git без явной команды пользователя.

### Планирование
- Сначала план (5-7 строк), жди одобрения — потом код.
- В плане: какие файлы затронуты, какие компоненты переиспользуются, что создаётся.
- Не предлагай альтернативы — только один рекомендуемый вариант.

### Код
- Не объясняй что делаешь — просто делай.
- Не трогай файлы, которые не касаются текущей задачи.
- Пиши комментарии только там где стоит TODO.
- Один компонент = один файл = одна задача.
- Моковые данные — только в /lib/mock-data.ts.
- Переиспользуй существующие компоненты — не создавай новые без необходимости.

## СТЕК (не обсуждается)
Next.js 14 · App Router · TypeScript · Tailwind CSS · Framer Motion
Prisma · PostgreSQL · Zustand · react-hook-form · zod · NextAuth.js
Swiper · embla-carousel-react · embla-carousel-autoplay

## СТРУКТУРА
/app           — страницы (App Router)
/components    — UI компоненты
/lib           — утилиты, prisma, mock-data
/docs          — документация проекта (читать перед задачей)
/prompts       — файлы задач
/prisma        — схема БД
/public        — статические файлы (логотип, изображения)

## ДОКУМЕНТЫ ПРОЕКТА
- Бриф компании:      docs/BRIEF.md
- Дизайн-система:     docs/DESIGN.md
- Архитектура:        docs/ARCHITECTURE.md
- Интеграции:         docs/INTEGRATIONS.md
- Описание измненений:  docs/PROGRESS.md

## КОМПОНЕНТЫ (актуально)

### UI
- `components/ui/Button.tsx` — базовая кнопка
- `components/ui/SectionHeading.tsx` — заголовок секции (title + subtitle)
- `components/ui/BookingModal.tsx` — модалка записи (имя + телефон + авто), маска телефона, rate-limit, honeypot
- `components/ui/ServiceCard.tsx` — карточка услуги с SVG-иконкой и кнопкой "Записаться". Поле `icon` удалено из MockService — не использовать emoji
- `components/ui/ServiceBookingCTA.tsx` — телефон + кнопка записи (открывает BookingModal)
- `components/ui/WhatsAppButton.tsx` — fixed floating кнопка, wa.me/79991334973, tooltip при hover
- `components/ui/ReviewCard.tsx` — карточка отзыва
- `components/ui/ProductCard.tsx` — карточка товара, поддержка FeaturedProduct и MockProduct, onAddToCart. Prop `theme` удалён — цвета через семантические токены
- `components/ui/CartDrawer.tsx` — корзина (слайд справа), два вида: cart и checkout, POST /api/order
- `components/ui/ThemeToggle.tsx` — Sun/Moon кнопка переключения темы (в Header)
- `components/providers/ThemeProvider.tsx` — обёртка next-themes (attribute="class", defaultTheme="system")

### Layout
- `components/layout/Container.tsx` — обёртка с max-width и padding
- `components/layout/Header.tsx` — fixed хедер с логотипом и кнопкой CTA. На мобиле: ThemeToggle + корзина + бургер (телефон убран из мобильной строки — дублировал то, что есть в меню)
- `components/layout/Footer.tsx` — футер с динамическим годом. trustItems: 3 элемента (30+ лет, 50 000+ позиций, Пн–Вс)

### Sections (активные на главной странице — в порядке рендера)
- `components/sections/HeroSlider.tsx` — Swiper-слайдер (3 слайда, fade, autoplay 8с, navigation, pagination). Слайд 2 открывает BookingModal. Фото: `public/images/hero-1..3.webp` (реальные WebP)
- `components/sections/AdvantagesSection.tsx` — преимущества (4 SVG-иконки inline)
- `components/sections/CategoriesSection.tsx` — категории товаров горизонтальными строками (icon + name + chevron). SVG-иконки (карта ICONS по slug)
- `components/sections/ProductsSection.tsx` — 4 featured товара из БД (getFeaturedProducts)
- `components/sections/ServiceSection.tsx` — виды услуг, вкладки по группам. 3 feature-пункта с SVG checkmark
- `components/sections/ReviewsSection.tsx` — Embla Carousel, autoplay 4с, 1/2/3 колонки. 5 реальных отзывов. Карточки `h-full` для одинаковой высоты

### Sections (не используются на главной)
- `components/sections/HeroSection.tsx` — старый hero, не удалять
- `components/sections/BrandsSection.tsx` — 4 бренда (ГАЗ/УАЗ/ВАЗ/КАМАЗ), убран с главной
- `components/sections/PartFinderSection.tsx` — подбор Марка→Модель→Категория→/catalog, убран с главной
- `components/sections/ServiceGallery.tsx` — Embla Carousel галерея сервиса, 6 фото. Ждёт реальные фото `gallery-1..6.jpg` (сейчас SVG-заглушки). Не подключён нигде
- `components/sections/ContactsSection.tsx` — не используется, заменён страницей `app/contacts/page.tsx`

### Pages
- `app/page.tsx` — главная страница
- `app/service/page.tsx` — страница услуг
- `app/about/page.tsx` — страница о компании. Stats: 2 элемента (30+, 50 000+). Advantages: 4 карточки с inline SVG-иконками (не emoji)
- `app/contacts/page.tsx` — контакты: два отдела с цветными left-border (Магазин #C8102E, Автосервис #1A3A6B, Оптовый #C4922A), Яндекс.Карты embed (320px), email/WhatsApp в bg-bg-muted
- `app/catalog/page.tsx` — каталог с URL-params: q (поиск), sort (price_asc/price_desc), page
- `app/catalog/CatalogView.tsx` — client-компонент: debounced поиск 350ms, сортировка, переключатель сетка/список, категории-табы. Переиспользуется в [slug]
- `app/catalog/[slug]/page.tsx` — каталог с предвыбранной категорией
- `app/catalog/[slug]/[article]/page.tsx` — страница товара (галерея, артикул, цена)
- `app/catalog/[slug]/[article]/AddToCartButton.tsx` — client-кнопка "Добавить в корзину"
- `app/catalog/[slug]/[article]/ProductImage.tsx` — client-компонент изображения товара с onError fallback

### Lib
- `lib/supabase.ts` — Supabase JS клиент (читает `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Кастомный fetch: `cache: no-store` + `connection: close` (предотвращает 15s stale keep-alive таймауты). Удаляет `HTTPS_PROXY`/`HTTP_PROXY` при инициализации — прокси нужен только для Telegram.
- `lib/db-catalog.ts` — каталог через Supabase JS (не Prisma). `getProducts()`, `getProductByArticle()`, `getFeaturedProducts()`, `getCategories()` с module-level кешем. `getOrCreateCategoryId()` — Prisma, только для import-скриптов.
- `lib/cart-store.ts` — Zustand store: items, isOpen, add/remove/update/clear. Persist localStorage 'trak-cart'. Экспортирует useCartTotal, useCartCount
- `lib/phone-utils.ts` — formatPhone, normalizePhone, isPhoneValid (переиспользуются в BookingModal и CartDrawer)

### API & SEO
- `app/api/booking/route.ts` — POST, zod-валидация, отправка в два Telegram-чата, поддержка HTTPS_PROXY (runtime only)
- `app/api/order/route.ts` — POST, zod-валидация (name, phone, items[], comment), сохранение в БД + отправка в Telegram
- `app/api/orders/route.ts` — GET для 1С: CSV-выгрузка PENDING заказов, Basic Auth, после выдачи → PROCESSING
- `app/api/products/route.ts` — POST для 1С: приём CSV с `;`, upsert по externalId, Basic Auth
- `app/sitemap.ts` — 5 URL для SEO (/, /service, /catalog, /about, /contacts)

### Slug ↔ категория
Категории в CatalogView берутся из БД через `getCategories()`. Slug → название определяется в БД, не хардкодится.
Известные slugs: dvigateli, filtry, tormoznaya-sistema, podveska, masla-i-zhidkosti, transmissiya, prochee

### Правила иконок (важно)
**Никакого emoji в UI.** Везде SVG-иконки (stroke, currentColor, 24×24 viewBox).
- `AdvantagesSection` — 4 SVG иконки inline
- `CategoriesSection` — карта `ICONS` по slug в самом компоненте
- `ServiceCard`, `ServiceSection` — SVG иконка инструмента / checkmark
- `app/about/page.tsx` — advantages с inline SVG
- `MockService` не имеет поля `icon` — не добавлять

### Не реализовано / ожидает
- Реальные фото галереи: `public/images/gallery-1..6.jpg` — пока SVG-заглушки (ServiceGallery не подключён)
- FTP-синхронизация: GitHub Actions workflow для автосинхронизации CSV из 1С
- Fuzzy-поиск: нужен GIN-индекс на pg_trgm в БД — сейчас поиск по подстроке (ilike)

## ОГРАНИЧЕНИЯ СЕРВИСА (важно для контента)
- Шиномонтаж — НЕТ
- Кузовной ремонт — НЕТ
- Все остальные виды ремонта — ЕСТЬ (3D развал-схождение, ремонт двигателя, КПП, ходовой, электрики)
- Магазин: запчасти только ГАЗ, ВАЗ, УАЗ, КАМАЗ
- Сервис: ГАЗ, ВАЗ, УАЗ + иномарки

## АУДИТ UX/UI (2026-04-22) — ПРИОРИТЕТЫ

### P1 — Выполнено ✓ (2026-05-17)
1. ~~Hero CTA "Записаться на СТО" → открывать BookingModal~~ ✓ реализовано в HeroSlider (слайд 2)
2. ~~ContactsSection — добавить реальный адрес улицы и embed Яндекс.Карт~~ ✓ адрес "ул. Пархоменко, 171", карта через iframe
3. ~~app/layout.tsx — добавить JSON-LD LocalBusiness + OpenGraph meta~~ ✓ AutoPartsStore JSON-LD + OpenGraph
4. ~~globals.css — убрать z-index:9999 с body::before~~ ✓ исправлено в сессии 10 (→ 0)
5. ~~ReviewsSection subtitle — убрать "500 клиентов за 30 лет", добавить ссылку на Яндекс.Карты~~ ✓
6. ~~Заменить SVG-заглушки hero-1..3 на реальные WebP~~ ✓ `hero-1..3.webp` загружены в `public/images/`
   Заменить SVG-заглушки gallery-1..6 на реальные JPG — **ждёт фото**

### P2 — Выполнено ✓ (2026-04-23)
- `components/sections/BrandsSection.tsx` — 4 бренда, staggered анимация, hover border-red
- `components/sections/PartFinderSection.tsx` — Марка → Модель → Категория → /catalog
- `components/ui/WhatsAppButton.tsx` — fixed bottom-right, wa.me/79991334973

### P3 — Выполнено ✓ (2026-04-23)
- AdvantagesSection: emoji → SVG-иконки (checkmark, lightning, shield, clock)
- Footer: динамический год — был реализован в сессии 10
- `app/sitemap.ts` — создан (/, /service, /catalog, /about)

### P4 — Выполнено ✓ (2026-04-25)
- `components/sections/HeroSlider.tsx` — Swiper-баннер, 3 слайда, заменил HeroSection на главной
- `components/sections/ServiceGallery.tsx` — Embla Carousel галерея сервиса
- `public/images/` — создана, SVG-заглушки hero-1..3 и gallery-1..6 (заменить на WebP/JPG)
- `app/catalog/CatalogView.tsx` — переведён на тёмную тему
- `app/about/page.tsx` — добавлен lightbox для сертификатов, макет 3+2 по ориентации фото
- `public/certificates/` — 5 реальных JPG: cert-1..3 свидетельства, cert-4..5 сертификаты

### P5 — Выполнено ✓ (2026-04-25)
- Внедрён `next-themes` (light/dark/system), ThemeProvider в layout
- `tailwind.config.ts` — добавлен `darkMode: 'class'` + 7 семантических цветовых токенов
- `globals.css` — CSS-переменные для обеих тем, плавный transition
- `components/ui/ThemeToggle.tsx` — кнопка Sun/Moon в Header
- Все компоненты, секции и страницы переведены на семантические токены
- ProductCard: удалён prop `theme`, цвета теперь автоматические через токены
- CartDrawer: placeholder 📦 заменён на SVG-иконку

### P6 — Выполнено ✓ (2026-04-29)
- `PartFinderSection` + `ServiceGallery`: переведены на `bg-bg-card` / `bg-bg-muted` для чередования секций
- `tailwind.config.ts`: добавлен `borderColor.DEFAULT` → семантический токен (фикс белых рамок в dark mode без явного `border-{color}`)
- `BookingModal` + `CartDrawer`: явный `bg-white dark:bg-[#111111]` вместо `bg-bg-card` для непрозрачного фона
- ProductCard/FeaturedProduct: токены корректны, чёрного фона нет

### P8 — Выполнено ✓ (2026-04-30)
- `Header.tsx`: логотип (`/logo.png`) вместо текста, `dark:brightness-0 dark:invert` в тёмной теме
- `Footer.tsx`: логотип вместо текста, аналогичный фильтр
- `ThemeToggle`: вынесен на мобильную панель хедера (не в бургер-меню)
- `HeroSlider`: текст адаптивный `text-4xl→7xl`, autoplay замедлен до 8с
- `ServiceSection`: вкладки по группам услуг вместо длинного списка
- `ContactsSection`: embed Яндекс.Карт (`map-widget/v1/org/trak/1100951090`)
- `CatalogView`: фильтры-бренды с горизонтальной прокруткой на мобиле
- `ProductCard`: адаптив на мобиле — цена/кнопка в колонку, меньшие отступы
- `types/swiper-css.d.ts`: декларации для TypeScript (фикс сборки Netlify)
- `app/page.tsx`: PartFinderSection закомментирован

### P7 — Выполнено ✓ (2026-04-29)
- `ReviewsSection`: переведён на Embla Carousel слайдер, 5 реальных отзывов из 2ГИС/Яндекс.Карт
- `mockReviews` в `lib/mock-data.ts`: заменены 3 заглушки на 5 реальных отзывов
- `Footer.tsx` trustItems: убран «2 направления», добавлен «Пн–Вс / без выходных», осталось 3 элемента
- `BrandsSection`: закомментирован в `app/page.tsx`
- `about/page.tsx` stats: убраны «4 бренда» и «1 представитель», осталось 2 элемента в flex-строке

## ТЕМА

### Система: next-themes + Tailwind darkMode: "class"
Реализована поддержка light/dark темы через CSS-переменные + Tailwind семантические токены.
ThemeToggle добавлен в Header. Default: system preference.

### Семантические токены (использовать везде вместо хардкода)
| Tailwind-класс | Светлая | Тёмная |
|---|---|---|
| `bg-bg-page` | #F5F5F5 | #0D0D0D |
| `bg-bg-card` | #FFFFFF | #111111 |
| `bg-bg-muted` | #EFEFEF | #1E1E1E |
| `border-ui-border` | #E2E2E2 | #2A2A2A |
| `text-text-base` | #0F0F0F | #F0F0F0 |
| `text-text-dim` | #6B7280 | #888888 |
| `text-text-ghost` | #9CA3AF | #444444 |

Акцентные цвета не меняются: `#C8102E` (red), `#1A3A6B` (blue), `#2563EB` (blue-light), `#C4922A` (gold).

### Известные проблемы темы
Баги P6 закрыты (2026-04-29). Новых известных проблем нет.

### HeroSlider
Overlay (`from-[#0D0D0D]/80`) намеренно всегда тёмный — корректно для слайдера поверх фото.

## ШРИФТЫ
- Шрифты локальные: `public/fonts/` (woff2, latin + cyrillic)
- `app/layout.tsx` использует `next/font/local` — нет сетевых запросов при сборке
- НЕ использовать `next/font/google` — падает на Netlify если выставлен HTTP_PROXY
- **Заголовки (`font-heading`):** Roboto Condensed 700/900 — файлы `roboto-condensed-{700,900}-*.woff2`, переменная `--font-russo`
- **Body (`font-body`):** IBM Plex Sans 400–700 — файлы `ibm-plex-sans-*.woff2`
- **Mono (`font-mono`):** IBM Plex Mono 400/500 — файлы `ibm-plex-mono-*.woff2`
- Файлы `russo-one-*.woff2` есть в `public/fonts/` но НЕ подключены — не удалять

## ENV
- `NEXT_PUBLIC_SUPABASE_URL` — URL Supabase проекта (обязательно, в т.ч. локально)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — публичный ключ Supabase (обязательно)
- `HTTP_PROXY` / `HTTPS_PROXY` — только для локальной разработки (Telegram через прокси). `next.config.mjs` удаляет их при старте чтобы не мешали Supabase HTTP-запросам.
- На Vercel эти переменные НЕ ставить — ломают сборку
- `SYNC_LOGIN` / `SYNC_PASSWORD` — Basic Auth для эндпоинтов 1С (`/api/products`, `/api/orders`)
- `DATABASE_URL` — Prisma pooler URL (только для import-скриптов и миграций, каталог использует Supabase JS)
- `DIRECT_URL` — Prisma direct URL (только для миграций)

## ИЗВЕСТНЫЕ ФИКСЫ ВЕРСИЙ (не менять без причины)
| Проблема | Решение |
|---|---|
| Prisma 7 сломал datasource url | Используем Prisma 5 |
| Tailwind v4 несовместим с tailwind.config.ts | Используем Tailwind v3 |
| next.config.ts не поддерживается Next.js 14 | Файл называется next.config.mjs |
| TypeScript ошибка при импорте CSS | Есть types/css.d.ts |
| next/font/google падает на Netlify с HTTP_PROXY | Шрифты локальные, next/font/local |
| Prisma + Supavisor (порт 6543) зависает на `DEALLOCATE ALL` второй транзакции | Каталог переведён на Supabase JS клиент (HTTP/REST). Prisma остался только для import-скриптов. |
| Stale TCP keep-alive соединения → 15s таймаут на повторных запросах к Supabase | `connection: close` заголовок в кастомном fetch `lib/supabase.ts` |
| `HTTPS_PROXY` из `.env.local` тормозит Supabase HTTP-запросы | `next.config.mjs` удаляет proxy env vars при старте сервера |

## ЧТО НЕ РЕАЛИЗОВАНО (следующие задачи)
- **FTP-синхронизация** — GitHub Actions workflow: cron → FTP → products.csv → upsert в БД
- **Категории 1С** — ждём справочник `Код_Каталога → Название` от 1С разработчика (сейчас 7 приблизительных категорий по ключевым словам)
- **Реальные фото** — заменить SVG-заглушки `public/images/` (hero-1..3, gallery-1..6) на WebP
- **Переезд хостинга** — сайт будет переезжать с Vercel на другой хостинг/домен

## ИНТЕГРАЦИЯ С 1С (статус)
- `app/api/products/route.ts` — POST, приём CSV от 1С, Basic Auth, авто-определение разделителя (`\t`/`;`)
- `app/api/orders/route.ts` — GET, выгрузка заказов в CSV для 1С, Basic Auth
- `scripts/import-products.mjs` — скрипт прямого импорта (для отладки)
- `scripts/generate-import-csv.mjs` — генератор CSV для Supabase Dashboard импорта
- **products.csv** — полный каталог от 1С: 280 072 товара, загружен в БД через Supabase Dashboard
- **FTP** — 1С кладёт файл на FTP, нужен GitHub Actions worker для автосинхронизации
