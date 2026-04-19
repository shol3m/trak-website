# ПРОГРЕСС ПРОЕКТА ТРАК

_Последнее обновление: 2026-04-20 (сессия 6)_

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
