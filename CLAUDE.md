# ТРАК — Claude Code Project Guide

## ПРАВИЛА (читать обязательно)

### Сессия
- Одна сессия = одно задание. Не берись за смежные задачи.
- Читай только файлы, нужные для текущей задачи — не больше.
- Не держи лишний контекст: не читай весь /docs, только нужный файл.
- Экономь токены: минимум чтений, минимум объяснений, только действия.

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
- `components/ui/ServiceCard.tsx` — карточка услуги с кнопкой "Записаться"
- `components/ui/ServiceBookingCTA.tsx` — телефон + кнопка записи (открывает BookingModal)
- `components/ui/WhatsAppButton.tsx` — fixed floating кнопка, wa.me/79991334973, tooltip при hover
- `components/ui/ReviewCard.tsx` — карточка отзыва
- `components/ui/ProductCard.tsx` — карточка товара, поддержка FeaturedProduct и MockProduct, onAddToCart. Prop `theme` удалён — цвета через семантические токены
- `components/ui/CartDrawer.tsx` — корзина (слайд справа), два вида: cart и checkout, POST /api/order
- `components/ui/ThemeToggle.tsx` — Sun/Moon кнопка переключения темы (в Header)
- `components/providers/ThemeProvider.tsx` — обёртка next-themes (attribute="class", defaultTheme="system")

### Layout
- `components/layout/Container.tsx` — обёртка с max-width и padding
- `components/layout/Header.tsx` — fixed хедер с логотипом и кнопкой CTA
- `components/layout/Footer.tsx` — футер с динамическим годом. trustItems: 3 элемента (30+ лет, 50 000+ позиций, Пн–Вс)

### Sections (порядок на главной странице)
- `components/sections/HeroSlider.tsx` — Swiper-слайдер (3 слайда, fade, autoplay 5с, navigation, pagination). Заменяет HeroSection на главной. Слайд 2 открывает BookingModal.
- `components/sections/HeroSection.tsx` — старый hero (не используется на главной, не удалять)
- `components/sections/AdvantagesSection.tsx` — преимущества (SVG-иконки)
- `components/sections/BrandsSection.tsx` — 4 бренда (ГАЗ/УАЗ/ВАЗ/КАМАЗ), staggered анимация. **Закомментирован в page.tsx**
- `components/sections/ServiceSection.tsx` — виды услуг
- `components/sections/CategoriesSection.tsx` — категории товаров
- `components/sections/PartFinderSection.tsx` — подбор Марка→Модель→Категория→/catalog
- `components/sections/ProductsSection.tsx` — список товаров
- `components/sections/ServiceGallery.tsx` — Embla Carousel, 6 фото сервиса, autoplay 3.5с, адаптивно 1/2/3 колонки. Фото: `public/images/gallery-1..6.jpg` (заглушки .svg, заменить на .jpg)
- `components/sections/ReviewsSection.tsx` — Embla Carousel слайдер отзывов, autoplay 4с, 1/2/3 колонки. 5 реальных отзывов из 2ГИС/Яндекс.Карт в mock-data
- `components/sections/ContactsSection.tsx` — контакты и карта

### Pages
- `app/page.tsx` — главная страница
- `app/service/page.tsx` — страница услуг
- `app/about/page.tsx` — страница о компании. Stats: 2 элемента (30+, 50 000+), flex-горизонталь по центру
- `app/catalog/page.tsx` — каталог (фильтры по бренду + категории, URL-params)
- `app/catalog/CatalogView.tsx` — client-компонент с фильтрами и grid товаров (переиспользуется в [slug])
- `app/catalog/[slug]/page.tsx` — каталог с предвыбранной категорией
- `app/catalog/[slug]/[article]/page.tsx` — страница товара (галерея, артикул, цена)
- `app/catalog/[slug]/[article]/AddToCartButton.tsx` — client-кнопка "Добавить в корзину"
- `app/catalog/[slug]/[article]/ProductImage.tsx` — client-компонент изображения товара с onError fallback

### Lib
- `lib/cart-store.ts` — Zustand store: items, isOpen, add/remove/update/clear. Persist localStorage 'trak-cart'. Экспортирует useCartTotal, useCartCount
- `lib/phone-utils.ts` — formatPhone, normalizePhone, isPhoneValid (переиспользуются в BookingModal и CartDrawer)

### API & SEO
- `app/api/booking/route.ts` — POST, zod-валидация, отправка в два Telegram-чата, поддержка HTTPS_PROXY (runtime only)
- `app/api/order/route.ts` — POST, zod-валидация (name, phone, items[], comment), отправка заказа в Telegram
- `app/sitemap.ts` — 4 URL для SEO (/, /service, /catalog, /about)

### Slug ↔ категория (важно)
mockCategories slug не совпадает с product.category — маппинг в SLUG_TO_CATEGORY в CatalogView и product page:
- dvigateli → Двигатели, filtry → Фильтры, tormoznaya-sistema → Тормозная система
- podveska → Подвеска, masla-i-zhidkosti → Масла и жидкости, transmissiya → Трансмиссия

### Не реализовано
- `app/api/products/route.ts` — API каталога (спроектировано, не реализовано)

## ОГРАНИЧЕНИЯ СЕРВИСА (важно для контента)
- Шиномонтаж — НЕТ
- Кузовной ремонт — НЕТ
- Все остальные виды ремонта — ЕСТЬ (3D развал-схождение, ремонт двигателя, КПП, ходовой, электрики)
- Магазин: запчасти только ГАЗ, ВАЗ, УАЗ, КАМАЗ
- Сервис: ГАЗ, ВАЗ, УАЗ + иномарки

## АУДИТ UX/UI (2026-04-22) — ПРИОРИТЕТЫ

### P1 — Сделать в первую очередь
1. ~~Hero CTA "Записаться на СТО" → открывать BookingModal~~ ✓ реализовано в HeroSlider (слайд 2)
2. ContactsSection — добавить реальный адрес улицы и embed Яндекс.Карт
3. app/layout.tsx — добавить JSON-LD LocalBusiness + OpenGraph meta
4. globals.css — убрать z-index:9999 с body::before (ломает focus rings)
5. ReviewsSection subtitle — убрать "500 клиентов за 30 лет" (антидовер), добавить ссылку на Яндекс.Карты
6. Заменить SVG-заглушки в public/images/ на реальные WebP фото (hero-1..3, gallery-1..6)

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

## ENV
- `HTTP_PROXY` / `HTTPS_PROXY` — только для локальной разработки (Telegram через прокси)
- На Netlify эти переменные НЕ ставить — ломают сборку

## ИЗВЕСТНЫЕ ФИКСЫ ВЕРСИЙ (не менять без причины)
| Проблема | Решение |
|---|---|
| Prisma 7 сломал datasource url | Используем Prisma 5 |
| Tailwind v4 несовместим с tailwind.config.ts | Используем Tailwind v3 |
| next.config.ts не поддерживается Next.js 14 | Файл называется next.config.mjs |
| TypeScript ошибка при импорте CSS | Есть types/css.d.ts |
| next/font/google падает на Netlify с HTTP_PROXY | Шрифты локальные, next/font/local |

## ЧТО НЕ РЕАЛИЗОВАНО (следующие задачи)
- `app/api/products/route.ts` — API каталога (спроектировано, не реализовано)
- Подключение реальной БД / источника данных поставщика (mock-данные временные)
- Баги темы (см. P6 выше): разделение секций, рамки, прозрачные модалки, чёрные карточки
