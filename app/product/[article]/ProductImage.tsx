'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false)

  if (src && !error) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-6"
        sizes="(max-width: 768px) 100vw, 50vw"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 opacity-30 text-text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}
