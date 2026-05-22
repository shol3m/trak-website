# Дизайн-система ТРАК

## Цвета (CSS переменные)
--red:        #C8102E   /* акцент, кнопки CTA, логотип */
--red-dark:   #9B0B22   /* hover состояние красных элементов */
--black:      #0D0D0D   /* основной фон */
--dark:       #111111   /* фон карточек */
--steel:      #1E1E1E   /* фон секций */
--border:     #2A2A2A   /* границы */
--white:      #F0F0F0   /* основной текст */
--gray:       #888888   /* вторичный текст */
--gold:       #C4922A   /* акцент для статусов "официальный дилер" */

## Типографика
Заголовки H1-H3: Russo One
Текст body:       IBM Plex Sans
Моно/артикулы:    IBM Plex Mono
Подключение:      next/font/local — локальные файлы из public/fonts/ (без сетевых запросов при сборке)

Файлы шрифтов (public/fonts/):
- russo-one-latin.woff2, russo-one-cyrillic.woff2
- ibm-plex-sans-{400,500,600,700}-{latin,cyrillic}.woff2
- ibm-plex-sans-400i-{latin,cyrillic}.woff2
- ibm-plex-mono-{400,500}-{latin,cyrillic}.woff2

Важно: НЕ использовать next/font/google — падает при выставленном HTTP_PROXY (локальный прокси). Использовать next/font/local.

## Компонент: кнопки
Primary:   bg-red text-white hover:bg-red-dark, px-6 py-3 rounded-none (квадратные)
Secondary: border border-red text-red hover:bg-red hover:text-white
Ghost:     text-gray hover:text-white underline

## Анимации (Framer Motion)
Появление секций: { opacity: 0, y: 40 } → { opacity: 1, y: 0 }, duration 0.6
Счётчики:         animate при входе в viewport
Карточки hover:   scale 1.02, translateY -4px, box-shadow red-glow

## Light/Dark тема (реализовано с P5)
Система: `next-themes` + Tailwind `darkMode: 'class'`. Default: system preference.
ThemeToggle (Sun/Moon) в Header.

### Семантические токены (использовать вместо хардкода цветов)
| Tailwind | Светлая | Тёмная |
|---|---|---|
| `bg-bg-page` | #F5F5F5 | #0D0D0D |
| `bg-bg-card` | #FFFFFF | #111111 |
| `bg-bg-muted` | #EFEFEF | #1E1E1E |
| `border-ui-border` | #E2E2E2 | #2A2A2A |
| `text-text-base` | #0F0F0F | #F0F0F0 |
| `text-text-dim` | #6B7280 | #888888 |
| `text-text-ghost` | #9CA3AF | #444444 |

Акцентные цвета не меняются: `#C8102E` (red), `#1A3A6B` (blue), `#2563EB` (blue-light), `#C4922A` (gold).

Исключения (намеренно не используют токены):
- HeroSlider overlay: `from-[#0D0D0D]/80` — всегда тёмный (поверх фото)
- BookingModal, CartDrawer: `bg-white dark:bg-[#111111]` — непрозрачный фон поверх overlay

## Иконки
Везде только SVG — inline, `stroke="currentColor"`, `fill="none"`, `viewBox="0 0 24 24"`, `strokeWidth="1.5"`.
Акцентные иконки: `text-[#C8102E]` (красный). Нейтральные: `text-text-dim` / `text-text-base`.

**Emoji запрещены** во всём UI — рендерятся по-разному на разных ОС и выбиваются из дизайн-системы.
`MockService.icon` не существует — не добавлять. `STATIC_CATEGORIES.icon` не существует — не добавлять.

## Принципы
- Тёмная тема везде, без светлых страниц
- Углы кнопок — прямые (border-radius: 0), не скруглённые
- Красный — только для CTA и акцентов, не для фонов секций
- Шум/текстура фона — тонкий noise overlay на hero секции