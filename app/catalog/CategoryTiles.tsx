import Link from 'next/link'
import type { TreeCategory } from '@/lib/db-catalog'

export default function CategoryTiles({
  categories,
  basePath,
}: {
  categories: TreeCategory[]
  basePath: string
}) {
  if (categories.length === 0) return null

  return (
    <div
      className="no-scrollbar flex overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-1 gap-2 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 sm:gap-3 mb-6 sm:mb-8"
      style={{ scrollbarWidth: 'none' }}
    >
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/${cat.slug}`}
          className="group shrink-0 snap-start flex items-center justify-between gap-2 bg-bg-card border border-ui-border hover:border-[#C8102E]/50 px-3 py-2.5 sm:px-4 sm:py-3.5 transition-colors duration-150"
        >
          <span className="font-body text-sm text-text-base leading-snug whitespace-nowrap sm:whitespace-normal sm:truncate">{cat.name}</span>
          <svg
            className="w-4 h-4 shrink-0 text-text-dim group-hover:text-[#C8102E] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>
      ))}
    </div>
  )
}
