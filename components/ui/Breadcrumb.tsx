import Link from 'next/link'

export type BreadcrumbItem = {
  name: string
  href?: string
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 font-body text-xs text-text-dim mb-8 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#C8102E] transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-text-base truncate max-w-[200px]">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
