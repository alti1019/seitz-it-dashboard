import { createBrowserClient } from '@supabase/ssr'

let _supabase = null

/**
 * Creates a new Supabase browser client instance.
 * Uses environment variables for URL and anon key.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Lazy-initialized singleton for Client Components.
 * Avoids errors during Next.js build/prerender when env vars are not set.
 */
export const supabase = new Proxy({}, {
  get(_, prop) {
    if (!_supabase) {
      _supabase = createClient()
    }
    return _supabase[prop]
  }
})
