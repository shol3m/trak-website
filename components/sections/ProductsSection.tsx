'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ProductCard from '@/components/ui/ProductCard'
import Button from '@/components/ui/Button'
import { featuredProducts } from '@/lib/mock-data'

export default function ProductsSection() {
  return (
    <section className="py-20 bg-bg-muted">
      <Container>
        <div className="flex items-end justify-between mb-10">
          <SectionHeading title="Популярные товары" />
          <Button href="/catalog" variant="secondary" size="sm" className="hidden sm:inline-flex mb-10">
            Смотреть всё
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

        <div className="mt-8 sm:hidden">
          <Button href="/catalog" variant="secondary" className="w-full">Смотреть весь каталог</Button>
        </div>
      </Container>
    </section>
  )
}
