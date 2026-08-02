export default function TopBar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 h-9 bg-[#1A3A6B] text-white/80">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs font-body">
        <span className="truncate">Доставка по всей России · Самовывоз сегодня из магазина в Уфе</span>
        <a href="tel:+73472237208" className="hidden sm:inline shrink-0 hover:text-white transition-colors duration-200">
          +7 347 223-72-08
        </a>
      </div>
    </div>
  )
}
