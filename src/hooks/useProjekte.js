'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * Hook for CRUD operations on the projekte table.
 * Includes Realtime subscription for live updates across all users.
 */
export function useProjekte() {
  const [projekte, setProjekte] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = getSupabase()
    fetchProjekte()

    // Realtime Subscription – changes from other users are visible immediately
    const channel = supabase
      .channel('projekte-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projekte' }, () => {
        fetchProjekte()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchProjekte() {
    const { data, error } = await getSupabase()
      .from('projekte')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setProjekte(data)
    setLoading(false)
  }

  /**
   * Insert a new project into the database.
   * @param {Object} projekt - Project data (titel, prio, fertig, cluster, projektnr)
   * @returns {Object} The inserted project
   */
  async function addProjekt(projekt) {
    const { data, error } = await getSupabase()
      .from('projekte')
      .insert([projekt])
      .select()
      .single()
    if (error) throw error
    await fetchProjekte()
    return data
  }

  /**
   * Update an existing project by ID.
   * @param {string} id - UUID of the project
   * @param {Object} updates - Fields to update
   */
  async function updateProjekt(id, updates) {
    const { error } = await getSupabase()
      .from('projekte')
      .update(updates)
      .eq('id', id)
    if (error) throw error
    await fetchProjekte()
  }

  /**
   * Delete a project by ID.
   * @param {string} id - UUID of the project
   */
  async function deleteProjekt(id) {
    const { error } = await getSupabase()
      .from('projekte')
      .delete()
      .eq('id', id)
    if (error) throw error
    await fetchProjekte()
  }

  return { projekte, loading, error, addProjekt, updateProjekt, deleteProjekt }
}
