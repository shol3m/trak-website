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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`${basePath}/${cat.slug}`}
          className="group flex items-center justify-between gap-2 bg-bg-card border border-ui-border hover:border-[#C8102E]/50 px-4 py-3.5 transition-colors duration-150"
        >
          <span className="font-body text-sm text-text-base leading-snug">{cat.name}</span>
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
