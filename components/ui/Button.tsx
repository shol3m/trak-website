import Link from 'next/link'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit'
}

const variants = {
  primary: 'bg-[#C8102E] text-white hover:bg-[#9B0B22]',
  secondary: 'border border-[#C8102E] text-[#C8102E] hover:bg-[#C8102E] hover:text-white',
  ghost: 'text-[#888888] hover:text-[#F0F0F0] underline',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  children,
  className = '',
  type = 'button',
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center rounded-none font-body font-medium transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
