'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { mockModels, mockCategories } from '@/lib/mock-data'
import type { MockProduct } from '@/lib/mock-data'

const brandLabels: Record<MockProduct['brand'], string> = {
  GAZ: 'ГАЗ',
  VAZ: 'ВАЗ (Лада)',
  UAZ: 'УАЗ',
  KAMAZ: 'КАМАЗ',
}

const brands = (Object.keys(mockModels) as MockProduct['brand'][])

const selectCls =
  'w-full bg-bg-page border border-ui-border text-text-base font-body text-sm px-4 py-3 appearance-none focus:outline-none focus:border-[#C8102E] transition-colors duration-200 disabled:text-text-dim disabled:cursor-not-allowed'

export default function PartFinderSection() {
  const router = useRouter()
  const [brand, setBrand] = useState<MockProduct['brand'] | ''>('')
  const [model, setModel] = useState('')
  const [category, setCategory] = useState('')

  function handleBrandChange(val: MockProduct['brand'] | '') {
    setBrand(val)
    setModel('')
  }

  function handleSubmit() {
    if (!brand) return
    const params = new URLSearchParams()
    params.set('brand', brand)
    if (model) params.set('model', model)
    if (category) params.set('category', category)
    router.push(`/catalog?${params.toString()}`)
  }

  const models = brand ? mockModels[brand] : []

  return (
    <section className="py-20 bg-bg-card">
      <Container>
        <SectionHeading
          title="Подбор запчастей"
          subtitle="Выберите марку, модель и категорию — найдём нужную деталь"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-bg-card border border-ui-border p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <label className="block font-body text-xs uppercase tracking-widest text-text-dim mb-2">
                Марка
              </label>
              <div className="relative">
                <select
                  value={brand}
                  onChange={(e) => handleBrandChange(e.target.value as MockProduct['brand'] | '')}
                  className={selectCls}
                >
                  <option value="">Выберите марку</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{brandLabels[b]}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-text-dim mb-2">
                Модель
              </label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className={selectCls}
                >
                  <option value="">Выберите модель</option>
                  {models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>

            <div>
              <label className="block font-body text-xs uppercase tracking-widest text-text-dim mb-2">
                Категория
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Все категории</option>
                  {mockCategories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!brand}
            className="bg-[#C8102E] hover:bg-[#9B0B22] disabled:bg-bg-muted disabled:text-text-dim disabled:cursor-not-allowed text-white font-body text-sm px-8 py-3 transition-colors duration-200"
          >
            Найти запчасть
          </button>
        </motion.div>
      </Container>
    </section>
  )
}

function ChevronIcon() {
  return (
    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-dim">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  )
}
