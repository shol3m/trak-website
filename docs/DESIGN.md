# Дизайн-система ТРАК

## Цвета
Актуальная система — семантические токены (см. таблицу ниже, введены в P5, 2026-04-25). Старые статичные CSS-переменные (`--red`, `--black`, `--dark`, `--steel`, `--border`, `--white`, `--gray`) были вытеснены ими и в `globals.css` больше не существуют — не искать, не добавлять по памяти из старых версий этого файла.

## Типографика
Заголовки H1-H3: Roboto Condensed (700, 900) — переменная `--font-russo` / Tailwind класс `font-heading`
Текст body:       IBM Plex Sans (400, 500, 600, 700)
Моно/артикулы:    IBM Plex Mono (400, 500)
Подключение:      next/font/local — локальные файлы из public/fonts/ (без сетевых запросов при сборке)

Файлы шрифтов (public/fonts/):
- roboto-condensed-{700,900}-{latin,cyrillic}.woff2  ← используется как font-heading
- russo-one-{latin,cyrillic}.woff2  ← файлы есть, но НЕ подключены в layout.tsx
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
- Поддержка light/dark темы через `next-themes`. Default: system preference. Все цвета через семантические токены
- Углы кнопок — прямые (border-radius: 0), не скруглённые
- Красный — только для CTA и акцентов, не для фонов секций
- Шум/текстура фона — тонкий noise overlay на hero секции