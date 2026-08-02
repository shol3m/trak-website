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
Vitest (тесты) · ESLint (`next/core-web-vitals`)

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
- `components/ui/BookingModal.tsx` — модалка записи на СТО (имя + телефон + авто), маска телефона, rate-limit, honeypot
- `components/ui/PartRequestModal.tsx` — модалка подбора запчасти (какая деталь нужна + телефон + опционально авто), тот же паттерн маски/rate-limit/honeypot, шлёт в тот же `/api/booking`
- `components/ui/ServiceCard.tsx` — карточка услуги с SVG-иконкой и кнопкой "Записаться". Поле `icon` удалено из MockService — не использовать emoji
- `components/ui/ServiceBookingCTA.tsx` — телефон + кнопка записи (открывает BookingModal)
- `components/ui/WhatsAppButton.tsx` — fixed floating кнопка, wa.me/79991334973, tooltip при hover
- `components/ui/ReviewCard.tsx` — карточка отзыва
- `components/ui/ProductCard.tsx` — карточка товара, поддержка FeaturedProduct и MockProduct, onAddToCart. Prop `theme` удалён — цвета через семантические токены
- `components/ui/CartDrawer.tsx` — корзина (слайд справа), два вида: cart и checkout, POST /api/order
- `components/ui/ThemeToggle.tsx` — Sun/Moon кнопка переключения темы (в Header)
- `components/ui/Breadcrumb.tsx` — хлебные крошки, используется в `app/catalog/[...path]/page.tsx` и `app/product/[article]/page.tsx`
- `components/providers/ThemeProvider.tsx` — обёртка next-themes (attribute="class", defaultTheme="system")

### Layout
- `components/layout/Container.tsx` — обёртка с max-width и padding
- `components/layout/TopBar.tsx` — тонкая fixed-полоса над Header (доставка + телефон), `top-0`, высота 36px. Есть на всех страницах
- `components/layout/Header.tsx` — fixed хедер (`top-9`, под TopBar), логотип, десктоп-навигация (Каталог/Сервис/О нас/Контакты, `hidden lg:flex`, между логотипом и поиском), строка поиска (десктоп: инлайн; мобилка: в выпадающем меню) → `/catalog?q=...`, телефон, кнопка CTA. На мобиле: ThemeToggle + корзина + бургер (меню включает те же nav-ссылки)
- `components/layout/Footer.tsx` — футер с динамическим годом. trustItems: 3 элемента (30+ лет, 50 000+ позиций, Пн–Вс)

Глобальный отступ под контент — `app/layout.tsx`, `pt-[100px]` (36px TopBar + 64px Header). Страницы `catalog/[...path]` и `product/[article]` добавляют свой `pt-24` поверх этого.

### Sections (активные на главной странице — в порядке рендера)
- `components/sections/CategoryNavTabs.tsx` — вкладки быстрого перехода по 15 реальным корневым категориям (`getCategoryTree()`, дерево передаётся пропом из `app/page.tsx`), ссылки `/catalog/${slug}`. `'use client'`, `embla-carousel-react` (`dragFree`) со стрелками-кнопками (`hidden sm:flex`, дизейблятся на краях). Только на главной, сразу под Header
- `components/sections/HeroSlider.tsx` — Swiper-слайдер (3 слайда, fade, autoplay 8с, navigation, pagination). Слайд 2 открывает BookingModal. Фото: `public/images/hero-1..3.webp` (реальные WebP)
- `components/sections/StatsBrandsRow.tsx` — реальные цифры (30+ лет / 50 000+ позиций / Пн–Вс) + трастовая строка. Бейджи марок авто (ГАЗ/УАЗ/ВАЗ/КАМАЗ) и брендов запчастей (BOSCH/FEBEST/MANN/TRW/TRIALLI/FENOX, подобраны по частоте в `products.csv`) — рабочие ссылки на `/catalog?brand=...`, каждая запись имеет `label` (витринная кириллица) и `dbBrand` (точное значение `Product.brandName`, для UAZ/LADA/KAMAZ — латиницей)
- `components/sections/PartFinderCTA.tsx` — тёмный баннер «Не знаете артикул нужной детали?» (стиль rossko.ru): фото эксперта слева (`public/images/partfinder-expert.png`, реальное фото, blend-градиент убирает шов с фоном карточки), текст + телефон + кнопка `PartRequestModal` справа. Заменил `ProductsSection` (2026-08-03)
- `components/sections/ServiceSection.tsx` — виды услуг, вкладки по группам, строка-услуга (иконка · название · длительность · цена · кнопка)
- `components/sections/ReviewsSection.tsx` — Embla Carousel, autoplay 4с, 1/2/3 колонки. 5 реальных отзывов. Карточки `h-full` для одинаковой высоты

### Sections (не используются на главной)
- `components/sections/CategoriesSection.tsx` — сетка плиток (иконка сверху, название снизу). SVG-иконки (карта `ICONS` по slug), `SEARCH_TERM` в `lib/categories.ts`. Убрана с главной (2026-08-03) — дублировала категории из `CategoryNavTabs`
- `components/sections/ProductsSection.tsx` — 4 featured товара из БД (getFeaturedProducts). Убрана с главной (2026-08-03), заменена на `PartFinderCTA` — `getFeaturedProducts` не «популярное», а просто последние засинканные товары, фото пока плейсхолдеры
- `components/sections/HeroSection.tsx` — старый hero, не удалять
- `components/sections/HeroBanner.tsx` / `components/sections/HeroBannerIcon.tsx` — черновые варианты статичного hero-баннера (фото-инсет / контурная иконка машины), заказчику не понравились — вернули `HeroSlider`. Не удалять, вдруг пригодятся
- `components/sections/AdvantagesSection.tsx` — преимущества (4 SVG-иконки inline), убран с главной (дублировал `StatsBrandsRow`)
- `components/sections/BrandsSection.tsx` — 4 бренда (ГАЗ/УАЗ/ВАЗ/КАМАЗ), убран с главной
- `components/sections/PartFinderSection.tsx` — подбор Марка→Модель→Категория→/catalog, убран с главной
- `components/sections/ServiceGallery.tsx` — Embla Carousel галерея сервиса, 6 фото. Ждёт реальные фото `gallery-1..6.jpg` (сейчас SVG-заглушки). Не подключён нигде

### Pages
- `app/page.tsx` — главная страница
- `app/service/page.tsx` — страница услуг
- `app/about/page.tsx` — страница о компании. Stats: 2 элемента (30+, 50 000+). Advantages: 4 карточки с inline SVG-иконками (не emoji)
- `app/contacts/page.tsx` — контакты: два отдела с цветными left-border (Магазин #C8102E, Автосервис #1A3A6B, Оптовый #C4922A), Яндекс.Карты embed (320px), email/WhatsApp в bg-bg-muted
- `app/catalog/page.tsx` — корень каталога: плитки корневых категорий (`getCategoryTree()`) + общий поиск по всем товарам. URL-params: q (поиск), sort (price_asc/price_desc), page, brand (точный фильтр по `Product.brandName`). `generateMetadata()` — при `?brand=X` отдаёт уникальные title/description для SEO
- `app/catalog/CatalogView.tsx` — client-компонент: debounced поиск 350ms, сортировка, переключатель сетка/список, проп `brand` (заголовок «Запчасти {brand}», снимаемый бейдж-фильтр — подпись «Марка»/«Бренд» определяется по `VEHICLE_MAKE_BRANDS` из `lib/categories.ts`, сохраняется в URL при пагинации). Табов категорий больше нет — берётся `title`/`basePath`/`topSlot` пропсами от вызывающей страницы. Переиспользуется в `[...path]`
- `app/catalog/CategoryTiles.tsx` — плитки подкатегорий (переиспользуется в `page.tsx` и `[...path]/page.tsx`)
- `app/catalog/[...path]/page.tsx` — catch-all для дерева категорий любой глубины. Определяет категорию по последнему сегменту URL (слаги глобально уникальны), товары фильтруются по `Category.path` (вся ветка целиком, не только точная категория). 404 если категория не найдена или в ней нет товаров
- `app/product/[article]/page.tsx` — страница товара (галерея, артикул, цена, полный breadcrumb через `getCategoryNode()`). Раньше жила на `/catalog/[slug]/[article]`, переехала на верхний уровень — артикул глобально уникален, слаг категории в URL не нужен
- `app/product/[article]/AddToCartButton.tsx` — client-кнопка "Добавить в корзину"
- `app/product/[article]/ProductImage.tsx` — client-компонент изображения товара с onError fallback

### Lib
- `lib/supabase.ts` — Supabase JS клиент (читает `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Кастомный fetch: `cache: no-store` + `connection: close` (предотвращает 15s stale keep-alive таймауты). Удаляет `HTTPS_PROXY`/`HTTP_PROXY` при инициализации — прокси нужен только для Telegram.
- `lib/db-catalog.ts` — каталог через Supabase JS (не Prisma). `getProducts()` (принимает `categoryPath` — фильтр по префиксу `Category.path`, вся ветка целиком; `brand` — точный фильтр по `Product.brandName`), `getProductByArticle()`, `getFeaturedProducts()`. `getCategoryTree()` / `getCategoryNode(slug)` — дерево категорий строится из закешированных строк (`unstable_cache`, тег `categories`, не голая module-level переменная — инвалидация работает на всех serverless-инстансах через `invalidateCategoryTree()`, вызывается из `/api/products` после успешного синка), `hasProducts` считается рекурсивно вверх по дереву (категория "активна", если у неё самой или у любого потомка есть товар) — иначе новое дерево из 920 категорий показывало бы пустые ветки.
- `lib/cart-store.ts` — Zustand store: items, isOpen, add/remove/update/clear. Persist localStorage 'trak-cart'. Экспортирует useCartTotal, useCartCount
- `lib/phone-utils.ts` — formatPhone, normalizePhone, isPhoneValid (переиспользуются в BookingModal и CartDrawer)
- `lib/categories.ts` — `VEHICLE_MAKE_BRANDS` — Set значений `Product.brandName`, которые считаются маркой авто, а не брендом запчасти (используется для подписи бейджа в `CatalogView.tsx`)
- `lib/prisma.ts` — Prisma-клиент через Supavisor pooler (порт 6543). Только для write-операций (`/api/order`, `/api/orders`, `/api/products`) и import-скриптов — каталог на чтение использует Supabase JS (см. выше)

### API & SEO
- `app/api/booking/route.ts` — POST, zod-валидация, отправка в два Telegram-чата, поддержка HTTPS_PROXY (runtime only). Обслуживает и `BookingModal` (запись на СТО), и `PartRequestModal` (подбор запчасти) — `name` опционален, есть опциональное поле `part`, текст сообщения в Telegram зависит от того, что заполнено
- `app/api/order/route.ts` — POST, zod-валидация (name, phone, items[], comment), сохранение в БД + отправка в Telegram
- `app/api/orders/route.ts` — GET для 1С: CSV-выгрузка PENDING заказов, Basic Auth, после выдачи → PROCESSING
- `app/api/products/route.ts` — POST для 1С: приём CSV с `;`, upsert по externalId, Basic Auth. После успешного синка — `invalidateCategoryTree()` (сбрасывает кеш дерева категорий на всех serverless-инстансах)
- `app/sitemap.ts` — 5 URL для SEO (/, /service, /catalog, /about, /contacts)

### Slug ↔ категория
Категории в CatalogView берутся из БД через `getCategories()`. Slug → название определяется в БД, не хардкодится.
Реальное дерево категорий от 1С (920 категорий, до 4 уровней) залито в `Category` из `КаталогиСайт.txt` (`scripts/import-categories.mjs`), поле `Category.externalId` = `Код` из справочника. Все 280k товаров перекатегоризированы по реальным кодам (813 категорий сейчас используются). Старые 7 slug (dvigateli, filtry, tormoznaya-sistema, podveska, masla-i-zhidkosti, transmissiya, prochee) больше не используются товарами, но записи в БД не удалялись — `prochee` остаётся fallback-категорией для будущих товаров с неизвестным кодом (см. `docs/PROGRESS.md`, раздел от 2026-08-01).

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
- Магазин: НЕ только ГАЗ/ВАЗ/УАЗ/КАМАЗ — проверено по реальным данным БД (2026-08-01): МАЗ, ПАЗ, УРАЛ, тракторы/спецтехника, грузовые иномарки + сторонние бренды запчастей (BOSCH, FEBEST, TRW, MANN, FENOX, LUZAR и др.), плюс масла/автохимия/лампы/коврики/чехлы. Не сужать копирайт до 4 марок
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
- `Header.tsx`: логотип (`/logo.png`) вместо текста, в тёмной теме — `dark:brightness-0 dark:invert` (заменено в сессии 2026-08-03, см. P9)
- `Footer.tsx`: логотип вместо текста, аналогичный фильтр (заменено в сессии 2026-08-03, см. P9)
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

### P9 — Выполнено ✓ (2026-08-03)
- `public/logo-dark.png` — новый полноцветный логотип (синий/красный «T» + белый «ТРАК»), фон вырезан в прозрачность (был чёрный PNG без альфа-канала). Для тёмных/синих фонов — не CSS-фильтр
- `Header.tsx`: `dark:brightness-0 dark:invert` убран. Теперь два `<Image>` (`/logo.png` + `/logo-dark.png`), переключение классами `dark:hidden` / `hidden dark:block`
- `Footer.tsx`: `brightness-0 invert` убран (футер всегда на синем `#1A3A6B`), логотип — `/logo-dark.png` напрямую, без фильтра

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
| `/api/booking`/`/api/order` возвращают 502 «Ошибка отправки» локально | Локальный прокси-клиент на `HTTPS_PROXY` (`127.0.0.1:12334`) не запущен — Telegram заблокирован напрямую в РФ. Если прямой доступ временно доступен (проверить `curl https://api.telegram.org/`), можно закомментировать `HTTPS_PROXY`/`HTTP_PROXY` в `.env.local` и перезапустить дев-сервер; иначе — запустить прокси-клиент |

## ЧТО НЕ РЕАЛИЗОВАНО (следующие задачи)

### Приоритет 0 — план реконструкции главной закрыт (2026-08-03)
Очередь из `docs/PROGRESS.md` (Header, CategoryNavTabs, StatsBrandsRow, CategoriesSection, PartFinderCTA, ServiceSection, ContactsSection duplicate) пройдена полностью, п.1–7. Hero-слайдер и мобильная адаптивность (Header/TopBar/CategoryNavTabs/PartFinderCTA) неоднократно проверены Playwright MCP на 375/1440px в течение сессий.
- Дождаться от заказчика точный график работы (пока в футере заглушка)

### Приоритет 1 — безопасность и надёжность
- **Rate-limit на `/api/order` и `/api/booking`** — публичные POST-роуты без всякой защиты от флуда. Client-side "rate-limit" в `BookingModal` — это просто UI-стейт, тривиально обходится прямым запросом
- **Тесты на `/api/order` и `/api/booking`** — самые критичные пути (деньги/заказы), нужны моки Prisma + Telegram-запроса. Тесты на `lib/phone-utils.ts` уже есть (`npm run test`) — это следующий, более тяжёлый шаг

### Приоритет 2 — продуктовые решения (не код, нужно решить)
- **9 из 18 таблиц в схеме пустые**: `User`/`Account`/`Session` (под `next-auth`, задекларирован в стеке, не реализован), `Brand`, `CarModel`, `ProductCompatibility`, `AttributeDefinition`, `ProductAttribute`, `ProductBrand`, `Review`. Либо реализовывать (проще всего начать с `Review` — контент уже есть в `lib/mock-data.ts`), либо явно выпиливать неиспользуемое
- **FTP-синхронизация** — GitHub Actions workflow: cron → FTP → products.csv → upsert в БД

### Приоритет 3 — производительность/SEO
- **`nextjs-seo-performance` skill ещё не применён к каталогу** — `/catalog` и `/catalog/[...path]` сейчас `force-dynamic`, кеширования нет. При 920 категориях самое время прогнать skill на этом участке (ISR/`revalidate`, JSON-LD на уровне товара)
- **`app/sitemap.ts`** — всего 5 статичных URL, не включает ни один из 280k товаров или 920 категорий

### Мелкое
- **Реальные фото галереи** — заменить SVG-заглушки `public/images/gallery-1..6` на WebP/JPG (hero-1..3 уже реальные WebP, см. `Sections`)
- **Переезд хостинга** — сайт будет переезжать с Vercel на другой хостинг/домен
- Дублирование логики хлебных крошек (`/product/[article]/page.tsx` и `/catalog/[...path]/page.tsx`) и создания fallback-категории «Прочее» (`app/api/products/route.ts` и `scripts/import-products.mjs`) — низкий приоритет, DRY, ничего не ломает

## ИНТЕГРАЦИЯ С 1С (статус)
- `app/api/products/route.ts` — POST, приём CSV от 1С, Basic Auth, авто-определение разделителя (`\t`/`;`). Категория определяется по `Код_Каталога` → `Category.externalId`
- `app/api/orders/route.ts` — GET, выгрузка заказов в CSV для 1С, Basic Auth
- `scripts/import-products.mjs` — скрипт прямого импорта (для отладки)
- `scripts/import-categories.mjs` — импорт дерева категорий из `КаталогиСайт.txt` (920 категорий, справочник 1С). Идемпотентен, безопасно перезапускать
- `scripts/generate-import-csv.mjs` — генератор CSV для Supabase Dashboard импорта
- **products.csv** — полный каталог от 1С: 280 072 товара, загружен в БД через Supabase Dashboard
- **FTP** — 1С кладёт файл на FTP, нужен GitHub Actions worker для автосинхронизации
