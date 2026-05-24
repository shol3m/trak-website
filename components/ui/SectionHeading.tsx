type Props = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  eyebrow?: string
}

export default function SectionHeading({ title, subtitle, align = 'left', eyebrow }: Props) {
  const alignCls = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`mb-10 ${alignCls}`}>
      {align === 'left' && <div className="w-8 h-0.5 bg-[#C8102E] mb-4" />}
      {eyebrow && (
        <span className="font-body text-xs text-[#C8102E] uppercase tracking-[0.2em] mb-2 block">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading text-3xl md:text-4xl text-text-base leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-text-dim font-body text-base max-w-xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
