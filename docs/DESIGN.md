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

Важно: НЕ использовать next/font/google — падает на Netlify при выставленном HTTP_PROXY

## Компонент: кнопки
Primary:   bg-red text-white hover:bg-red-dark, px-6 py-3 rounded-none (квадратные)
Secondary: border border-red text-red hover:bg-red hover:text-white
Ghost:     text-gray hover:text-white underline

## Анимации (Framer Motion)
Появление секций: { opacity: 0, y: 40 } → { opacity: 1, y: 0 }, duration 0.6
Счётчики:         animate при входе в viewport
Карточки hover:   scale 1.02, translateY -4px, box-shadow red-glow

## Принципы
- Тёмная тема везде, без светлых страниц
- Углы кнопок — прямые (border-radius: 0), не скруглённые
- Красный — только для CTA и акцентов, не для фонов секций
- Шум/текстура фона — тонкий noise overlay на hero секции