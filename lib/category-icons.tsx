import type { ReactNode } from 'react'

// Icon per real root category slug (see getCategoryTree() in lib/db-catalog.ts).
// Same "inner shapes only" pattern as lib/service-icons.tsx — the consuming
// component wraps these in a shared <svg>.
export const CATEGORY_ICONS: Record<string, ReactNode> = {
  avtoaksessuary: (
    <>
      <rect x="2" y="9" width="8" height="6" rx="3" />
      <path d="M10 12h11M17 12v3M20 12v2" />
    </>
  ),
  avtozapchasti: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
    </>
  ),
  avtosvet: (
    <>
      <path d="M12 3a6 6 0 0 0-6 6c0 3 2 4.5 3 6h6c1-1.5 3-3 3-6a6 6 0 0 0-6-6z" />
      <path d="M9 18h6M10 21h4" />
    </>
  ),
  'avtohimiya-i-avtokosmetika': (
    <>
      <path d="M9 2h6" />
      <path d="M10 2v4l-2 2v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8l-2-2V2" />
      <path d="M8 13h8" />
    </>
  ),
  avtoelektronika: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1" />
      <path d="M7 9H3M7 15H3M21 9h-4M21 15h-4M9 7V3M15 7V3M9 21v-4M15 21v-4" />
    </>
  ),
  'akkumulyatory-i-zaryadka': (
    <>
      <rect x="2" y="8" width="17" height="10" rx="1.5" />
      <path d="M19 11v4M6 8V6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2" />
      <path d="M12.5 10.5L10 14h3l-2.5 3.5" />
    </>
  ),
  detali: (
    <>
      <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'dopolnitelnoe-oborudovanie': (
    <>
      <rect x="2" y="8" width="20" height="12" rx="1.5" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 13h20M10 13v2M14 13v2" />
    </>
  ),
  instrumenty: (
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2z" />
  ),
  masla: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
  'originalnye-aksessuary': (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  'sport-i-aktivnyy-otdyh': (
    <>
      <rect x="3" y="10" width="18" height="6" rx="3" />
      <path d="M7 10V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
    </>
  ),
  'tehnicheskie-zhidkosti': (
    <>
      <rect x="5" y="7" width="14" height="14" rx="1.5" />
      <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M9 12h6M9 16h6" />
    </>
  ),
  'shiny-i-diski': (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5M5.6 5.6l3.5 3.5M14.9 14.9l3.5 3.5M18.4 5.6l-3.5 3.5M9.1 14.9l-3.5 3.5" />
    </>
  ),
  'schetki-stekloochistitelya': (
    <>
      <path d="M4 20L18 6" />
      <path d="M4 20l-1-4 4 1z" />
      <path d="M17 3l4 4-3 3-4-4z" />
    </>
  ),
}

export const DEFAULT_CATEGORY_ICON: ReactNode = (
  <>
    <rect x="3" y="7" width="18" height="13" rx="1.5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </>
)

// Real photo per category slug, replaces the SVG icon in CategoryGrid when
// present — filled in incrementally as photos are generated/supplied, see
// public/images/categories/. Falls back to CATEGORY_ICONS for the rest.
// 3 more (avtoelektronika, instrumenty, schetki-stekloochistitelya) are queued —
// GPT prompts for them are in docs/PROGRESS.md (2026-08-06 entry). Add the map
// entry once each public/images/categories/category-<slug>.webp file exists.
export const CATEGORY_IMAGES: Record<string, string> = {
  avtosvet: '/images/categories/category-avtosvet.webp',
  avtoaksessuary: '/images/categories/category-avtoaksessuary.webp',
  avtozapchasti: '/images/categories/category-avtozapchasti.webp',
  masla: '/images/categories/category-masla.webp',
  'akkumulyatory-i-zaryadka': '/images/categories/category-akkumulyatory-i-zaryadka.webp',
  'avtohimiya-i-avtokosmetika': '/images/categories/category-avtohimiya-i-avtokosmetika.webp',
}
