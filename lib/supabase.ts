import { createClient } from '@supabase/supabase-js'

// Defaults are set in next.config.mjs (NEXT_PUBLIC_ keys are intentionally public)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

export const supabase = createClient(url, key, {
  global: {
    fetch: (input, init) => {
      // cache: 'no-store' — skip Next.js data cache
      // connection: close — prevents stale keep-alive 15s timeouts between requests
      const headers = new Headers((init as RequestInit)?.headers as HeadersInit)
      headers.set('connection', 'close')
      return fetch(input as string, { ...(init as RequestInit), cache: 'no-store', headers })
    },
  },
})
