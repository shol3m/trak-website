import type { MockReview } from '@/lib/mock-data'

export default function ReviewCard({ review }: { review: MockReview }) {
  const date = new Date(review.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] p-6 flex flex-col gap-3">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < review.rating ? 'text-[#C4922A]' : 'text-[#2A2A2A]'}>
            ★
          </span>
        ))}
      </div>
      <p className="font-body text-[#F0F0F0] text-sm leading-relaxed flex-1">{review.text}</p>
      <div className="flex items-center justify-between">
        <span className="font-body font-medium text-[#F0F0F0] text-sm">{review.name}</span>
        <span className="font-body text-[#888888] text-xs">{date}</span>
      </div>
    </div>
  )
}
