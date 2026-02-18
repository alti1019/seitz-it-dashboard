import { createBrowserClient } from '@supabase/ssr'

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

// Singleton for Client Components
export const supabase = createClient()
