import type { MockReview } from '@/lib/mock-data'

export default function ReviewCard({ review }: { review: MockReview }) {
  const date = new Date(review.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-bg-card border border-ui-border p-6 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating ? 'text-[#C4922A]' : 'text-ui-border'}>
            ★
          </span>
        ))}
      </div>
      <p className="font-body text-text-base text-sm leading-relaxed flex-1">{review.text}</p>
      <div className="flex items-center justify-between">
        <span className="font-body font-medium text-text-base text-sm">{review.name}</span>
        <span className="font-body text-text-dim text-xs">{date}</span>
      </div>
    </div>
  )
}
