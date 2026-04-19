'use client'

import { motion } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import ReviewCard from '@/components/ui/ReviewCard'
import { mockReviews } from '@/lib/mock-data'

export default function ReviewsSection() {
  return (
    <section className="py-20 bg-[#1E1E1E]">
      <Container>
        <SectionHeading
          title="Отзывы клиентов"
          subtitle="Более 500 довольных клиентов за 30 лет работы"
          align="center"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {mockReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
