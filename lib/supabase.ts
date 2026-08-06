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

// Client for reads wrapped in unstable_cache (currently: category tree).
// Same connection: close fix, but WITHOUT forcing cache: 'no-store' — that
// flag makes Next.js treat the fetch as an explicit dynamic-usage signal,
// which throws ("Dynamic server usage: no-store fetch") when the surrounding
// page is statically generated (e.g. "/"), even though the fetch is already
// inside unstable_cache's own tag-based caching boundary. Omitting `cache`
// here lets unstable_cache govern caching instead of fighting it.
export const supabaseCached = createClient(url, key, {
  global: {
    fetch: (input, init) => {
      const headers = new Headers((init as RequestInit)?.headers as HeadersInit)
      headers.set('connection', 'close')
      return fetch(input as string, { ...(init as RequestInit), headers })
    },
  },
})
