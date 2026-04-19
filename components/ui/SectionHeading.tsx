type Props = {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ title, subtitle, align = 'left' }: Props) {
  const alignCls = align === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`mb-10 ${alignCls}`}>
      <h2 className="font-heading text-3xl md:text-4xl text-[#F0F0F0] uppercase tracking-wide">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[#888888] font-body text-base max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  )
}
