'use client'

import { useEffect, useRef, useState } from 'react'

type BrandOption = { label: string; dbBrand: string }

export default function BrandSelect({
  value,
  makes,
  brands,
  onChange,
}: {
  value: string[]
  makes: BrandOption[]
  brands: BrandOption[]
  onChange: (dbBrands: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
    else setQuery('')
  }, [open])

  const selectedLabels = [...makes, ...brands]
    .filter((b) => value.includes(b.dbBrand))
    .map((b) => b.label)

  const q = query.trim().toLowerCase()
  const filteredMakes = q ? makes.filter((b) => b.label.toLowerCase().includes(q)) : makes
  const filteredBrands = q ? brands.filter((b) => b.label.toLowerCase().includes(q)) : brands
  const nothingFound = filteredMakes.length === 0 && filteredBrands.length === 0

  function toggle(dbBrand: string) {
    onChange(
      value.includes(dbBrand) ? value.filter((v) => v !== dbBrand) : [...value, dbBrand]
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2.5 bg-bg-card border border-ui-border font-body text-xs hover:border-[#C8102E]/50 transition-colors min-w-[160px] justify-between"
      >
        <span className={`truncate ${selectedLabels.length ? 'text-text-base' : 'text-text-dim'}`}>
          {selectedLabels.length === 0
            ? 'Марка / бренд'
            : selectedLabels.length === 1
              ? selectedLabels[0]
              : `Марка / бренд (${selectedLabels.length})`}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`shrink-0 text-text-dim transition-transform duration-150 ${open ? 'rotate-180' : ''}`}>
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-72 max-h-96 flex flex-col bg-bg-card border border-ui-border shadow-lg">
          <div className="p-2 border-b border-ui-border shrink-0">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск марки или бренда..."
              className="w-full px-2.5 py-1.5 bg-bg-page border border-ui-border text-text-base font-body text-xs focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div className="overflow-y-auto">
            {value.length > 0 && (
              <button
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-2 font-body text-xs text-text-dim hover:bg-bg-muted transition-colors border-b border-ui-border"
              >
                Сбросить выбор ({value.length})
              </button>
            )}

            {filteredMakes.length > 0 && (
              <div>
                <div className="px-3 pt-2 pb-1 font-body text-[10px] uppercase tracking-wide text-text-ghost">Марки техники</div>
                {filteredMakes.map((b) => (
                  <label
                    key={b.dbBrand}
                    className="flex items-center gap-2 px-3 py-1.5 font-body text-xs hover:bg-bg-muted transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(b.dbBrand)}
                      onChange={() => toggle(b.dbBrand)}
                      className="accent-[#C8102E] w-3.5 h-3.5 shrink-0"
                    />
                    <span className={value.includes(b.dbBrand) ? 'text-[#C8102E]' : 'text-text-base'}>{b.label}</span>
                  </label>
                ))}
              </div>
            )}

            {filteredBrands.length > 0 && (
              <div>
                <div className="px-3 pt-2 pb-1 font-body text-[10px] uppercase tracking-wide text-text-ghost">Бренды запчастей</div>
                {filteredBrands.map((b) => (
                  <label
                    key={b.dbBrand}
                    className="flex items-center gap-2 px-3 py-1.5 font-body text-xs hover:bg-bg-muted transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(b.dbBrand)}
                      onChange={() => toggle(b.dbBrand)}
                      className="accent-[#C8102E] w-3.5 h-3.5 shrink-0"
                    />
                    <span className={value.includes(b.dbBrand) ? 'text-[#C8102E]' : 'text-text-base'}>{b.label}</span>
                  </label>
                ))}
              </div>
            )}

            {nothingFound && (
              <div className="px-3 py-4 text-center font-body text-xs text-text-dim">Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
