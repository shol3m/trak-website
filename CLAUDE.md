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
- Переезд на прод:     docs/MIGRATION.md
- Аудит UX/функциональности: docs/AUDIT.md

## КОМПОНЕНТЫ (актуально)

### UI
- `components/ui/Button.tsx` — базовая кнопка
- `components/ui/SectionHeading.tsx` — заголовок секции (title + subtitle). `<h2>` — `uppercase` (2026-08-04) — без капса заглавные У/Ц/Щ/Д в Oswald (cyrillic) рисуются с хвостиком ниже базовой линии (реальная особенность контура шрифта, не рендер-баг — проверено через fontTools, `yMin -147` у этих 4 букв против `yMin 0` у остальных прописных), на смешанном регистре хвостик выглядел как повисшая буква. CSS `text-transform`, не JS `.toUpperCase()` — реальный текст в DOM не меняется, SEO/скринридеры видят исходный регистр
- `components/ui/BookingModal.tsx` — модалка записи на СТО (имя + телефон + авто), маска телефона, rate-limit, honeypot
- `components/ui/PartRequestModal.tsx` — модалка подбора запчасти (какая деталь нужна + телефон + опционально авто), тот же паттерн маски/rate-limit/honeypot, шлёт в тот же `/api/booking`
- `components/ui/ServiceCard.tsx` — карточка услуги с SVG-иконкой и кнопкой "Записаться". Поле `icon` удалено из MockService — не использовать emoji. Иконка берётся из `lib/service-icons.tsx` по `service.group` (не гаечный ключ для всех групп, см. `SERVICE_GROUP_ICONS`, 2026-08-04)
- `components/ui/ServiceBookingCTA.tsx` — телефон + кнопка записи (открывает BookingModal)
- `components/ui/WhatsAppButton.tsx` — fixed floating кнопка, wa.me/79991334973, tooltip при hover
- `components/ui/ReviewCard.tsx` — карточка отзыва
- `components/ui/ProductCard.tsx` — карточка товара, поддержка FeaturedProduct и MockProduct. Prop `theme` удалён — цвета через семантические токены. Бренд — текстом рядом с артикулом (не плашка поверх фото, убрано 2026-08-04). Бейдж «Под заказ» — янтарный (`amber`), не серый (был неразличим на глаз). Проп `onAddToCart` убран (2026-08-04) — компонент сам читает/пишет `useCartStore`: пока товара нет в корзине — кнопка «В корзину»/«Заказать», после добавления — инлайн-степпер (−/количество/+) вместо повторной кнопки, `updateQuantity` не открывает `CartDrawer` (только первый клик «В корзину» через `addItem`+`openCart`). Тот же паттерн — в `ProductListRow` (локальный компонент внутри `CatalogView.tsx`, list-режим)
- `components/ui/BrandSelect.tsx` — выпадающая панель марки/бренда с живым поиском (заменила нативный `<select>` на 200+ опций, 2026-08-04), группы «Марки техники»/«Бренды запчастей». **Множественный выбор** (2026-08-04, тем же днём вторым проходом) — чекбоксы вместо кнопок-строк, `value`/`onChange` типа `string[]`, панель не закрывается после выбора (закрытие — только по клику вне панели или кнопке «Сбросить выбор»), используется в `CatalogView.tsx`
- `components/ui/CartDrawer.tsx` — корзина (слайд справа), два вида: cart и checkout. Emoji (🛒 пустая корзина, ✅ «Заказ принят») заменены на SVG (2026-08-04) — P5 (2026-04-25) убирал только 📦-плейсхолдер товара, эти два оставались. Форма чек-аута (2026-08-04, вместе с `/cart`) вынесена в `CheckoutForm.tsx` — сам drawer больше не хранит name/phone/comment/status/rate-limit, только `view: 'cart' | 'checkout'` для переключения экрана; поведение не изменилось. Ссылка «Перейти в корзину» → `/cart` рядом с «Очистить корзину» (2026-08-04) — до этого на `/cart` невозможно было попасть ни из одного места UI, только вручную по URL
- `components/ui/CheckoutForm.tsx` — форма оформления заказа (имя/телефон/комментарий, honeypot, rate-limit 30с, POST `/api/order`, экран успеха), вынесена из `CartDrawer.tsx` (2026-08-04) и переиспользуется там же и на `/cart`. Пропы опциональные: `onSuccessContinue` — что делает кнопка «Продолжить покупки» после успеха (drawer передаёт `closeCart`; `/cart` не передаёт — рендерится `Link` на `/catalog`), `onOrderPlaced` — вызывается сразу при успехе, до `clearCart()` (нужен вызывающей странице, если её рендер зависит от `items.length`, — см. `app/cart/CartView.tsx`). Плейсхолдер поля «Комментарий» — «Дополнительная информация по заказу» (было «Адрес доставки или дополнительная информация», убрано по просьбе заказчика)
- `components/ui/ThemeToggle.tsx` — Sun/Moon кнопка переключения темы (в Header)
- `components/ui/Breadcrumb.tsx` — хлебные крошки, используется в `app/catalog/[...path]/page.tsx` и `app/product/[article]/page.tsx`
- `components/providers/ThemeProvider.tsx` — обёртка next-themes (attribute="class", defaultTheme="system")

### Layout
- `components/layout/Container.tsx` — обёртка с max-width и padding
- `components/layout/TopBar.tsx` — **не рендерится** (убран из `app/layout.tsx` 2026-08-03, тестировали хедер без верхней полосы). Файл не удалён, можно вернуть одной строкой при необходимости
- `components/layout/Header.tsx` — fixed хедер, `top-0` (TopBar над ним больше нет), сплошной синий фон `bg-[#1A3A6B]` (не зависит от свет/тёмная тема — единый фирменный тёмный акцент, см. `ТЕМА`). Логотип всегда `/logo-dark.png` (светлый вариант, без переключения по теме). Десктоп-навигация (Каталог/Сервис/О нас/Контакты, `hidden lg:flex`), строка поиска (десктоп: инлайн; мобилка: в выпадающем меню) → `/catalog?q=...`, телефон, красная кнопка CTA «Записаться на СТО». На мобиле: ThemeToggle + корзина + бургер (в выпадающем меню — красная кнопка «Записаться на СТО» + контурная красная «Каталог запчастей», обе выровнены с десктоп-стилем)
- `components/layout/Footer.tsx` — футер с динамическим годом, синий фон `#1A3A6B`. Верхняя trust-плашка с цифрами (30+/50 000+/Пн–Вс) **убрана** (2026-08-03) — дублировала `StatsBrandsRow` выше по странице. Проп `categories: TreeCategory[]` (2026-08-04) — колонка «Каталог» больше не хардкод 5 старых flat-категорий (dvigateli/filtry/...), рендерит первые 5 корневых категорий реального дерева, ссылки `/catalog/${slug}`. `app/layout.tsx` вызывает `getCategoryTree()` (стал `async`) и передаёт `.slice(0, 5)`

Глобальный отступ под контент — `app/layout.tsx`, `pt-16` (только высота Header, 64px — TopBar не рендерится). Страницы `catalog/[...path]` и `product/[article]` добавляют свой `pt-24` поверх этого.

### Sections (активные на главной странице — в порядке рендера)
- `components/sections/CategoryNavTabs.tsx` — вкладки быстрого перехода по 15 реальным корневым категориям (`getCategoryTree()`, дерево передаётся пропом из `app/page.tsx`), ссылки `/catalog/${slug}`. `'use client'`, `embla-carousel-react` (`dragFree`) со стрелками-кнопками (`hidden sm:flex`, дизейблятся на краях). Только на главной, сразу под Header
- `components/sections/HeroSlider.tsx` — Swiper-слайдер (3 слайда, fade, autoplay 8с, navigation, pagination). Слайд 2 открывает BookingModal. Фото: `public/images/hero-1..3.webp` (реальные WebP)
- `components/sections/StatsBrandsRow.tsx` — реальные цифры (С 1992 года / 50 000+ позиций / Пн–Вс) + трастовая строка. Бейджи марок авто (ГАЗ/УАЗ/ВАЗ/КАМАЗ) и брендов запчастей (BOSCH/FEBEST/MANN/TRW/TRIALLI/FENOX, подобраны по частоте в `products.csv`) — рабочие ссылки на `/catalog?brand=...`, каждая запись имеет `label` (витринная кириллица) и `dbBrand` (точное значение `Product.brandName`, для UAZ/LADA/KAMAZ — латиницей)
- `components/sections/PartFinderCTA.tsx` — баннер «Не знаете артикул нужной детали?» (стиль rossko.ru): фото эксперта слева (`public/images/partfinder-expert.png`, реальное фото, blend-градиент убирает шов с фоном карточки), текст + телефон + кнопка `PartRequestModal` справа. Заменил `ProductsSection` (2026-08-03). Фон карточки — синий `#1A3A6B` (был почти чёрный `#161616`, перекрашен 2026-08-03 в единый фирменный тёмный акцент вместе с Header/Footer)
- `components/sections/ServiceSection.tsx` — виды услуг, вкладки по группам, строка-услуга (иконка по группе услуги, см. `lib/service-icons.tsx` · название · длительность · цена · кнопка). Копирайт про марки — «отечественные авто и иномарки» (не список ГАЗ/ВАЗ/УАЗ/КАМАЗ — ошибочно включал КАМАЗ, которого нет в зоне сервиса, 2026-08-04)
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
- `app/about/page.tsx` — страница о компании. Stats: 2 элемента (С 1992 года, 50 000+), секция на `bg-bg-card` (была голубоватая `bg-blue-50`/`dark:#0A1929` — перекрашена 2026-08-03 в нейтральный фон + красные цифры, как в `StatsBrandsRow`). Advantages: 4 карточки с inline SVG-иконками (не emoji)
- `app/contacts/page.tsx` — контакты: два отдела с цветными left-border (Магазин #C8102E, Автосервис #1A3A6B, Оптовый #C4922A), Яндекс.Карты embed (320px), email/WhatsApp в bg-bg-muted
- `app/catalog/page.tsx` — корень каталога: плитки корневых категорий (`getCategoryTree()`) + общий поиск по всем товарам. URL-params: q (поиск), sort (price_asc/price_desc), page, brand (точный фильтр по `Product.brandName`). `generateMetadata()` — при `?brand=X` отдаёт уникальные title/description для SEO
- `app/catalog/CatalogView.tsx` — client-компонент: debounced поиск 350ms, сортировка, переключатель сетка/список. Мобильная раскладка (2026-08-04): сетка карточек `grid-cols-2` от самого маленького экрана (была `grid-cols-1` — карточка на всю ширину, слишком крупно), toolbar `flex-col sm:flex-row` — строка поиска на всю ширину отдельной строкой, сортировка+переключатель вида под ней (было всё в один зажатый `flex`-ряд, поиск сжимался, плейсхолдер обрезался). Проп `brands: string[]` (заголовок «Запчасти {brand}» только когда выбран ровно один; чип-бейдж на каждый выбранный элемент, снимается по отдельности — подпись «Марка»/«Бренд» на чипе определяется по `VEHICLE_MAKE_BRANDS` из `lib/categories.ts`; в URL хранится как `?brand=A,B` через запятую, сохраняется при пагинации). Табов категорий больше нет — берётся `title`/`basePath`/`topSlot` пропсами от вызывающей страницы. Проп `error` (2026-08-03) — если запрос к БД упал, показывает «Не удалось загрузить каталог» вместо ложного «ничего не найдено» (раньше любая ошибка `getProducts()` молча превращалась в пустую выдачу). Переиспользуется в `[...path]`. Фильтры (2026-08-04): «Только в наличии», цена от/до, `BrandSelect` для марки/бренда (множественный выбор, тем же днём вторым проходом) — все сохраняются в URL при пагинации/сортировке, комбинируются, есть «Сбросить фильтры»
- `app/catalog/CategoryTiles.tsx` — плитки подкатегорий (переиспользуется в `page.tsx` и `[...path]/page.tsx`)
- `app/catalog/[...path]/page.tsx` — catch-all для дерева категорий любой глубины. Определяет категорию по последнему сегменту URL (слаги глобально уникальны), товары фильтруются по `Category.path` (вся ветка целиком, не только точная категория). 404 если категория не найдена или в ней нет товаров
- `app/product/[article]/page.tsx` — страница товара (галерея, артикул, цена, полный breadcrumb через `getCategoryNode()`). Раньше жила на `/catalog/[slug]/[article]`, переехала на верхний уровень — артикул глобально уникален, слаг категории в URL не нужен. Бренд — кликабельный кикер над `<h1>` (ссылка на `/catalog?brand=...`), не мелкая красная плашка. Колонка под фото — фикс 380px (`md:grid-cols-[380px_1fr]`), не половина экрана. Условия доставки сознательно не добавлены (заказчик попросил не объявлять, пока не готовы), применяемость по авто — нет данных (`ProductCompatibility` пустая). **Buy-box** (2026-08-04) — цена + `AddToCartButton` объединены в один блок `bg-bg-muted border p-5` (было: голая цена + огромная кнопка `size="lg"` россыпью). Подписи «Описание»/«Гарантия» — обычный bold-текст (`font-bold`, без `uppercase tracking-wider` — тот же кикер-паттерн, что убрали по сайту, см. `SectionHeading`)
- `app/product/[article]/AddToCartButton.tsx` — client, читает/пишет `useCartStore` напрямую (тот же паттерн, что `ProductCard`/`ProductListRow`, 2026-08-04): товара нет в корзине → кнопка `size="md"` (была `size="lg"`, заказчик отметил как слишком крупную) «Добавить в корзину»/«Заказать»; товар уже в корзине → инлайн-степпер (−/количество/+) вместо разового «✓ Добавлено» с `setTimeout`
- `app/product/[article]/ProductImage.tsx` — client-компонент изображения товара с onError fallback
- `app/cart/page.tsx` — тонкая серверная обёртка (metadata: «Корзина — ТРАК») вокруг `CartView.tsx` (2026-08-04, закрывает последний пункт «Приоритет 0.5»)
- `app/cart/CartView.tsx` — client, полноценная страница корзины: список товаров + степпер слева, `CheckoutForm` справа (`lg:sticky`), на мобиле — в колонку. Локальный стейт `orderPlaced` — левая колонка (список) и правая (`CheckoutForm`) всегда в одном и том же поддереве JSX (просто список товаров скрывается через `items.length`, а не через unmount обёртки) — иначе после успешной отправки `clearCart()` обнуляет `items`, компонент переключился бы на другую ветку рендера и **размонтировал** `CheckoutForm` вместе с его стейтом `status === 'success'`, экран «Заказ принят!» никто бы не увидел (поймано и исправлено в этой же сессии через Playwright)

### Lib
- `lib/supabase.ts` — Supabase JS клиент (читает `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Кастомный fetch: `cache: no-store` + `connection: close` (предотвращает 15s stale keep-alive таймауты). Удаляет `HTTPS_PROXY`/`HTTP_PROXY` при инициализации — прокси нужен только для Telegram.
- `lib/db-catalog.ts` — каталог через Supabase JS (не Prisma). `getProducts()` (принимает `categoryPath` — фильтр по префиксу `Category.path`, вся ветка целиком; `brand: string[]` — фильтр по `Product.brandName` через `.in()`, несколько значений одновременно, 2026-08-04 второй проход; `inStock`/`priceMin`/`priceMax` — фильтры наличия и цены, 2026-08-04), `getProductByArticle()`, `getFeaturedProducts()`. Сортировка по умолчанию (без явного `sort`) — `stock desc, priceRetail desc, id asc` («в наличии → с ценой → под заказ»), требует индекс `Product_isActive_stock_priceRetail_idx` (`scripts/add-stock-sort-index.mjs`) — без него тайм-аут на 280k строк. `getCategoryTree()` / `getCategoryNode(slug)` — дерево категорий строится из закешированных строк (`unstable_cache`, тег `categories`, не голая module-level переменная — инвалидация работает на всех serverless-инстансах через `invalidateCategoryTree()`, вызывается из `/api/products` после успешного синка), `hasProducts` считается рекурсивно вверх по дереву (категория "активна", если у неё самой или у любого потомка есть товар) — иначе новое дерево из 920 категорий показывало бы пустые ветки.
  **Поиск (`search`) идёт не через `.select().or()`, а через RPC `search_products`** (2026-08-03, см. `ИЗВЕСТНЫЕ ФИКСЫ ВЕРСИЙ`) — обычный запрос от публичной роли на 280k строк падал по тайм-ауту. `p_brand` — `text[]` (не `text`, 2026-08-04 второй проход, под множественный выбор марки/бренда), в БД `= any($2)` вместо `= $2`; при изменении сигнатуры функции нужен явный `drop function` со старым набором типов аргументов (`scripts/add-search-function.mjs` уже это делает).
- `lib/cart-store.ts` — Zustand store: items, isOpen, add/remove/update/clear. Persist localStorage 'trak-cart'. Экспортирует useCartTotal, useCartCount
- `lib/phone-utils.ts` — formatPhone, normalizePhone, isPhoneValid (переиспользуются в BookingModal и CartDrawer)
- `lib/service-icons.tsx` — `SERVICE_GROUP_ICONS`, SVG-путь по группе услуги (ТО и масла/Диагностика/Ходовая/Двигатель/Электрика), переиспользуется в `ServiceCard.tsx` и `ServiceSection.tsx` (2026-08-04)
- `lib/categories.ts` — `VEHICLE_MAKE_BRANDS` — Set значений `Product.brandName`, которые считаются маркой авто, а не брендом запчасти (используется для подписи бейджа в `CatalogView.tsx`), выводится из `ALL_VEHICLE_MAKES`. `ALL_VEHICLE_MAKES` (54) / `ALL_PART_BRANDS` (147) — полная ручная разметка `Product.brandName` (топ-461 значений, 100+ товаров каждое) на марка/бренд, см. `docs/brand-classification.tsv` и раздел «Классификация брендов» ниже; используются в фильтре каталога (`BrandSelect.tsx`). `CAR_BRANDS`/`PART_BRANDS` — компактный топ-4/топ-8 для главной (`StatsBrandsRow`), `.slice()` от полных списков
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

### P10 — Выполнено ✓ (2026-08-03)
- **Копирайтинг**: собраны референсы (rossko.ru, autopiter.ru, tdbl.ru, stogood.ru) и переписаны тексты в `PartFinderCTA`, `ServiceSection` (интро + 3 буллета), `about/page.tsx` (2 карточки преимуществ), `Footer` (описание) — меньше канцелярита, конкретнее обещания (без непроверяемых SLA вроде «перезвоним за 15 минут»)
- **«30+ лет» → «С 1992 года»** — везде, где раньше было приблизительное «30+»: `StatsBrandsRow`, `Footer` trustItems (до удаления, см. ниже), `about/page.tsx` (hero-текст, stats, таблица характеристик), `app/layout.tsx` (SEO meta description/OG)
- **Header/TopBar**: `TopBar` убран из рендера, `Header` перекрашен в сплошной синий `#1A3A6B` (не зависит от темы), логотип — `/logo-dark.png` без переключения. Глобальный отступ `pt-16` вместо `pt-[100px]`
- **Footer**: убрана верхняя trust-плашка с цифрами (дублировала `StatsBrandsRow`)
- **Единый тёмный акцент**: `PartFinderCTA` (было `#161616`) и stats-секция `about/page.tsx` (было `bg-blue-50`/`dark:#0A1929` + голубые цифры `#2563EB`) перекрашены в тот же синий `#1A3A6B` / красные цифры `#C8102E`, что Header/Footer/StatsBrandsRow — было несколько разных тёмных/синих оттенков вперемешку
- **Критический баг поиска исправлен** — см. `ИЗВЕСТНЫЕ ФИКСЫ ВЕРСИЙ`: точный артикул не находился (тайм-аут). Добавлены GIN trgm-индексы + `SECURITY DEFINER` функция `search_products` в БД, `lib/db-catalog.ts` переведён на неё. Плюс `app/catalog/page.tsx` / `[...path]/page.tsx` / `CatalogView.tsx` — при сбое БД показывают «Не удалось загрузить каталог» вместо ложного «ничего не найдено»

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
- Шрифты локальные: `public/fonts/` (woff2, **latin + latin-ext + cyrillic** — latin-ext обязателен: там лежит ₽ U+20BD, без него символ рубля рендерится системным шрифтом другой толщины, не тем начертанием что цифры рядом)
- `app/layout.tsx` использует `next/font/local` — нет сетевых запросов при сборке
- НЕ использовать `next/font/google` — падает на Netlify если выставлен HTTP_PROXY
- **Заголовки (`font-heading`):** Oswald, вариативный шрифт, закреплён на вес 700 (`weight: '700'`, не диапазон — ни одно из ~45 мест использования `font-heading` в коде не задаёт вес явно, все полагаются на то что шрифт всегда жирный). Файлы `oswald-{latin,latin-ext,cyrillic}.woff2`, переменная `--font-russo` (имя переменной не переименовывали, чтобы не трогать `tailwind.config.ts`)
- **Body (`font-body`):** Inter, вариативный 100–900. Файлы `inter-{latin,latin-ext,cyrillic}.woff2`, переменная `--font-ibm-plex`
- **Mono (`font-mono`):** JetBrains Mono, вариативный 400–800. Файлы `jetbrains-mono-{latin,latin-ext,cyrillic}.woff2`, переменная `--font-ibm-plex-mono`. **Только для артикулов/кодов/чисел** (артикул товара, длительность услуги, количество и суммы в корзине, бейдж корзины) — раньше был на весь UI каталога (поиск, фильтры, счётчик, пагинация, breadcrumb), из-за чего каталог читался как «технический дэшборд»; сужено до `font-body` везде кроме кодов 2026-08-04
- **Замена шрифтов 2026-08-04** (было: IBM Plex Sans/Russo One/IBM Plex Mono): (1) цифры/латиница/кириллица в IBM Plex Sans визуально не совпадали по насыщенности — подсеты собраны из разных релизов шрифта; (2) заказчик оценил прежний набор как «иишный» (шаблонный). Новые шрифты — вариативные: Google отдаёт один файл на подсет, покрывающий весь диапазон начертаний из одного источника, разнобоя толщины между цифрами/латиницей/кириллицей больше нет. Референс подбора — тот же дуэт Oswald+Inter, что у rossko.ru (см. «КОМПОНЕНТЫ» → `PartFinderCTA` про референсы копирайтинга)
- **Кикер-лейблы убраны полностью** (2026-08-04, второй заход после сужения трекинга) — мелкий uppercase-текст над заголовком («Помощь эксперта», «Автосервис», «О компании», «Контакты», «Запись», «Подбор запчасти» и т.д.) читался как штамп AI-лендинга независимо от ширины трекинга. Проверено на живом референсе (`rossko.ru`, Playwright-скриншот) — там кикеров-текста нет вообще, только заголовок; там где есть акцентная плашка — она без текста, отдельно от заголовка (маркер блока, не подпись). Итоговое решение: убрать кикер-текст **и** ранее существовавшую акцентную полоску под ним (`SectionHeading.tsx` — проп `eyebrow` удалён вместе с рендером, `w-8 h-0.5 bg-red` полоска тоже удалена; ни один вызывающий компонент `eyebrow` не использовал, TS не жаловался). Затронуло 9 мест: `SectionHeading.tsx`, `PartFinderCTA.tsx`, `HeroSlider.tsx` (весь бейдж-бордер `slide.badge` над `h1` + акцентная полоска под ним — сам `badge` в данных слайда остался, используется только как `alt` картинки), `ServiceSection.tsx`, `app/about/page.tsx` (hero-кикер «О компании» и CTA-кикер «Свяжитесь с нами»), `app/contacts/page.tsx` (hero-кикер «Контакты»), `BookingModal.tsx` («Запись»), `PartRequestModal.tsx` («Подбор запчасти»), `ServiceBookingCTA.tsx` («Запись по телефону»). Функциональные микро-подписи (подписи полей в `/contacts` — Email/WhatsApp/Адрес/название отдела, `<label>` в неиспользуемом `PartFinderSection.tsx`, заголовки колонок `Footer.tsx`) — не трогали, это не декоративный кикер-над-заголовком, а рабочая разметка данных
- Старые файлы `ibm-plex-*.woff2`, `russo-one-*.woff2` удалены из `public/fonts/` — не восстанавливать без причины

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
| Поиск по каталогу падал по тайм-ауту (`canceling statement due to statement timeout`), особенно на точный артикул | Причина двойная: (1) не было индекса для поиска по подстроке на 280k строк — добавлены GIN trgm-индексы на `Product.name`/`Product.article` (`scripts/add-search-indexes.mjs`); (2) даже с индексом RLS-политика (`isActive = true`) не даёт планировщику использовать индекс для нелипкопруф-операторов вроде `ILIKE` — обойдено через `SECURITY DEFINER`-функцию `search_products` в БД (`scripts/add-search-function.mjs`), которая сама повторяет условие `isActive = true` и строит запрос через `EXECUTE format(...)` с литеральным значением поиска (иначе параметризованный план тоже не видит индекс). `lib/db-catalog.ts` вызывает её через `supabase.rpc('search_products', ...)` вместо `.select().or()`. Функция также принимает `p_in_stock`/`p_price_min`/`p_price_max` (2026-08-04) — при их добавлении сигнатура функции изменилась, старую версию нужно было явно `drop function`, иначе `create or replace` плодит перегрузку с той же именем |
| Дефолтная сортировка каталога (`stock desc, priceRetail desc`) тайм-аутила на 280k строк без подходящего индекса | Добавлен составной индекс `Product_isActive_stock_priceRetail_idx` (`scripts/add-stock-sort-index.mjs`, `CONCURRENTLY`) |
| Локальные скрипты с прямым подключением к Postgres (`DIRECT_URL`) падали по TLS (`self-signed certificate in certificate chain`) | `.env.local` — строка `DIRECT_URL` была повреждена лишним символом сразу после закрывающей кавычки, из-за этого `sslmode=disable` не распознавался как точное совпадение и `pg` пытался открыть TLS-соединение к пулеру. Проверять `.env.local` на посторонние символы, если аналогичная ошибка повторится |

### P11 — Выполнено ✓ (2026-08-04)
- **Каталог**: дефолтная сортировка «в наличии → с ценой → под заказ» + фильтры (наличие/цена/марка-бренд) — п.1 из P1 аудита закрыт
- **Классификация `Product.brandName`** (4646 значений, топ-461 разобран вручную на марка/бренд/исключить/серая зона) — `docs/brand-classification.tsv`, `lib/categories.ts` → `ALL_VEHICLE_MAKES`/`ALL_PART_BRANDS`, `BrandSelect.tsx` (панель с поиском вместо `<select>` на 200+ опций)
- **Карточка товара**: бренд-кикер вместо мелкой красной плашки, блок «Гарантия» (нейтральный текст), фото уже не половина экрана — п.2 из P1 частично закрыт (применяемость и доставка сознательно не добавлены, см. `docs/AUDIT.md`)
- **«Под заказ»** переведён с серого на янтарный везде (каталог + карточка товара) — было неразличимо на глаз
- **Иконки**: гаечный ключ (было единственной «сервисной» иконкой везде) заменён на смысловые, `lib/service-icons.tsx`
- **Копирайт**: убран список «ГАЗ, ВАЗ, УАЗ, КАМАЗ» из текстов сервиса (ошибочно включал КАМАЗ), «доставка» убрана по всему сайту (заказчик попросил — условия не готовы объявлять)

### P12 — Выполнено ✓ (2026-08-04, второй проход)
- **Множественный выбор марки/бренда** в фильтре каталога реализован — `BrandSelect.tsx` (чекбоксы), `?brand=A,B` в URL, `.in()` в `lib/db-catalog.ts`, `search_products` принимает `p_brand text[]`
- **Смена шрифтов**: IBM Plex Sans/Russo One/IBM Plex Mono → Inter/Oswald/JetBrains Mono (все вариативные) — заказчик оценил старый набор как «иишный» и указал на разнобой толщины между цифрами/латиницей/кириллицей. Подробности и причина — раздел «ШРИФТЫ»
- **Символ ₽ другой толщины, чем цифры** — не хватало подсета `latin-ext` (там лежит U+20BD), добавлен для всех трёх шрифтов
- **Кикер-лейблы** (`tracking-[0.2em]`) сужены до `tracking-widest` — заказчик снова отметил их как «иишные» после сужения, см. P0.5 ниже
- **`font-mono` сужен** до артикулов/кодов/чисел — раньше был на весь UI каталога (поиск/фильтры/счётчик/пагинация/breadcrumb), переведено на `font-body`
- **Копирайт**: убрано «собственный» из «с собственным автосервисом» на главной/футере/черновиках hero — заказчик попросил убрать формулировку

## ЧТО НЕ РЕАЛИЗОВАНО (следующие задачи)

### Приоритет 0.5 — дизайн, план от заказчика (2026-08-04) — выполнен полностью
Заказчик прислал скриншоты и продиктовал план после P12: кикер-лейблы, страница товара, каталог на мобилке, отдельная страница корзины. Все 4 пункта реализованы и проверены Playwright MCP в течение той же сессии — см. `docs/PROGRESS.md`.

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
- **«Серая зона» классификации брендов** (245 значений `Product.brandName` — заводы-агрегатчики типа ЗМЗ/ЯМЗ/БелЗАН, региональные дистрибьюторы) — не разобрана, ждёт заказчика. Список — `docs/brand-classification.tsv`, тип `СЕРАЯ_ЗОНА`

## ИНТЕГРАЦИЯ С 1С (статус)
- `app/api/products/route.ts` — POST, приём CSV от 1С, Basic Auth, авто-определение разделителя (`\t`/`;`). Категория определяется по `Код_Каталога` → `Category.externalId`
- `app/api/orders/route.ts` — GET, выгрузка заказов в CSV для 1С, Basic Auth
- `scripts/import-products.mjs` — скрипт прямого импорта (для отладки)
- `scripts/import-categories.mjs` — импорт дерева категорий из `КаталогиСайт.txt` (920 категорий, справочник 1С). Идемпотентен, безопасно перезапускать
- `scripts/generate-import-csv.mjs` — генератор CSV для Supabase Dashboard импорта
- `scripts/add-search-indexes.mjs` — разовый скрипт (2026-08-03): создаёт GIN trgm-индексы на `Product.name`/`Product.article` через `DIRECT_URL`. Безопасно перезапускать (`IF NOT EXISTS`, `CONCURRENTLY` — не блокирует запись во время синка из 1С)
- `scripts/add-search-function.mjs` — разовый скрипт (2026-08-03): создаёт/пересоздаёт `SECURITY DEFINER`-функцию `search_products` в БД (обход RLS-ограничения на поиск по подстроке, см. `ИЗВЕСТНЫЕ ФИКСЫ ВЕРСИЙ`). Безопасно перезапускать (явный `drop function` старой сигнатуры + `create or replace function`, 2026-08-04 — иначе новые параметры `p_in_stock`/`p_price_min`/`p_price_max` создают перегрузку функции)
- `scripts/add-stock-sort-index.mjs` — разовый скрипт (2026-08-04): индекс `Product_isActive_stock_priceRetail_idx` (`CONCURRENTLY`) под дефолтную сортировку каталога. Безопасно перезапускать
- `scripts/audit-brand-classification.mjs` — **не разовый**, перезапускать вручную после крупных синков из 1С (2026-08-04): сверяет живые значения `Product.brandName` (100+ товаров) с `docs/brand-classification.tsv`, печатает только новые/неразмеченные. Ничего не пишет — разметку (МАРКА/БРЕНД/ИСКЛЮЧИТЬ/СЕРАЯ_ЗОНА) вносить руками в `.tsv`, затем при необходимости — в `lib/categories.ts` (`ALL_VEHICLE_MAKES`/`ALL_PART_BRANDS`)
- **products.csv** — полный каталог от 1С: 280 072 товара, загружен в БД через Supabase Dashboard
- **FTP** — 1С кладёт файл на FTP, нужен GitHub Actions worker для автосинхронизации
