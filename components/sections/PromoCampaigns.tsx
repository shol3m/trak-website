'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import { mockCampaigns, CAMPAIGN_IMAGES, type MockCampaign } from '@/lib/mock-data'

const CAMPAIGN_ICONS: Record<MockCampaign['icon'], ReactNode> = {
  stock: <path d="M20 6L9 17l-5-5" />,
  budget: (
    <>
      <path d="M12 2H4a2 2 0 0 0-2 2v8l11 11a2 2 0 0 0 2.8 0l7.2-7.2a2 2 0 0 0 0-2.8L12 2z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  brand: (
    <>
      <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  oil: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />,
}

export default function PromoCampaigns() {
  return (
    <section className="py-12 sm:py-16 bg-bg-page">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockCampaigns.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <Link
                href={c.href}
                className="group relative flex flex-col aspect-[3/4] bg-bg-card border border-ui-border hover:border-[#C8102E] transition-colors duration-200 overflow-hidden"
              >
                {CAMPAIGN_IMAGES[c.id] ? (
                  <div className="relative flex-1 overflow-hidden">
                    <Image
                      src={CAMPAIGN_IMAGES[c.id]}
                      alt={c.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="relative flex-1 flex items-center justify-center bg-bg-muted">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[#C8102E]"
                    >
                      {CAMPAIGN_ICONS[c.icon]}
                    </svg>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 p-4">
                  <p className="font-heading uppercase text-sm leading-tight text-text-base">{c.title}</p>
                  <p className="font-body text-xs leading-relaxed text-text-dim line-clamp-2">{c.description}</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 font-body text-xs text-[#C8102E] group-hover:gap-2 transition-all duration-200">
                    {c.cta}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
