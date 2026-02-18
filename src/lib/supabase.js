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
 * Returns the lazy-initialized Supabase singleton.
 * Call this inside hooks/components, not at module level,
 * to avoid build errors when env vars are not yet set.
 */
export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient()
  }
  return _supabase
}
