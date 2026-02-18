'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * Hook for Supabase Auth with role-based access control.
 * Roles are stored in user_metadata: 'admin', 'editor', 'viewer'.
 *
 * Setup in Supabase Dashboard:
 * 1. Go to Authentication > Users > Add User
 * 2. Create users with email/password
 * 3. After creation, click user > Edit > Raw User Meta Data
 * 4. Set: { "role": "admin", "display_name": "Admin" }
 *
 * Example users:
 *   admin@seitz.de     / seitz2024  → role: "admin"
 *   it-leitung@seitz.de / seitz2024  → role: "editor"
 *   gast@seitz.de       / gast123    → role: "viewer"
 */
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  /**
   * Sign in with email and password.
   * @param {string} email
   * @param {string} password
   */
  async function signIn(email, password) {
    const { error } = await getSupabase().auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  /** Sign out the current user. */
  async function signOut() {
    await getSupabase().auth.signOut()
  }

  const role = user?.user_metadata?.role ?? 'viewer'
  const displayName = user?.user_metadata?.display_name ?? user?.email ?? '?'
  const canEdit = role === 'admin' || role === 'editor'

  return { user, loading, signIn, signOut, role, displayName, canEdit }
}
