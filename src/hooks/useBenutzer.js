'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * Hook for loading and adding users from the benutzer table.
 * Includes Realtime subscription for live updates.
 */
export function useBenutzer() {
  const [benutzer, setBenutzer] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    fetchBenutzer()

    const channel = supabase
      .channel('benutzer-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'benutzer' }, () => {
        fetchBenutzer()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchBenutzer() {
    const { data, error } = await getSupabase()
      .from('benutzer')
      .select('*')
      .order('name', { ascending: true })
    if (error) {
      setBenutzer([])
    } else {
      setBenutzer(data)
    }
    setLoading(false)
  }

  /**
   * Add a new user name to the benutzer table.
   * @param {string} name - Display name
   */
  async function addBenutzer(name) {
    const { error } = await getSupabase()
      .from('benutzer')
      .insert([{ name }])
    if (error) throw error
    await fetchBenutzer()
  }

  return { benutzer, loading, addBenutzer }
}
