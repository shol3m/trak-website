# Задача 1: Инициализация проекта

Прочитай docs/DESIGN.md и docs/ARCHITECTURE.md

Выполни:
1. npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
2. Установи зависимости: framer-motion zustand react-hook-form zod @prisma/client prisma next-auth
3. Настрой tailwind.config.ts — добавь цвета из DESIGN.md как extend.colors
4. Настрой next/font/google — Russo One + IBM Plex Sans + IBM Plex Mono в app/layout.tsx
5. Создай app/globals.css с CSS-переменными из DESIGN.md
6. Создай prisma/schema.prisma с моделями из ARCHITECTURE.md
7. Создай lib/prisma.ts (singleton)
8. Создай lib/mock-data.ts — 12 товаров (4 ВАЗ, 4 ГАЗ, 4 УАЗ) и 3 отзыва
9. Создай .env.example из INTEGRATIONS.md

Не создавай страницы — только инфраструктура.