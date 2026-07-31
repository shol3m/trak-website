// Remove proxy env vars at server startup — HTTPS_PROXY is only needed for Telegram API
// calls in booking/order routes; it breaks Supabase HTTP requests for everything else
delete process.env.HTTPS_PROXY
delete process.env.HTTP_PROXY

// Public Supabase keys — safe to default here since they are NEXT_PUBLIC_ (bundled client-side)
process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'https://scprbpqwugshqbttbowe.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??= 'sb_publishable_588VWvqjtvBQoWcqy2aSuQ_We17-S4S'

const DEAD_FLAT_CATEGORIES = [
  'dvigateli',
  'filtry',
  'tormoznaya-sistema',
  'podveska',
  'masla-i-zhidkosti',
  'transmissiya',
  'prochee',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return DEAD_FLAT_CATEGORIES.map((slug) => ({
      source: `/catalog/${slug}`,
      destination: '/catalog',
      permanent: true,
    }))
  },
}

export default nextConfig
