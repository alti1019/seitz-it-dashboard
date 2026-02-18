'use client'
import { useState, useEffect } from 'react'
import { getSupabase } from '@/lib/supabase'

/**
 * Hook for reading and writing audit log entries.
 * Tracks all changes to projects with user, action, and details.
 */
export function useAuditLog() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    fetchLogs()

    // Realtime for audit log updates
    const channel = supabase
      .channel('audit-log-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_log' }, () => {
        fetchLogs()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function fetchLogs() {
    const { data, error } = await getSupabase()
      .from('audit_log')
      .select('*')
      .order('ts', { ascending: false })
      .limit(200)
    if (error) {
      setLogs([])
    } else {
      setLogs(data)
    }
    setLoading(false)
  }

  /**
   * Write a new entry to the audit log.
   * @param {string} username - Name of the user performing the action
   * @param {string} action - Type of action (Bearbeitet, Hinzugefuegt, Geloescht, etc.)
   * @param {string} projektTitel - Title of the affected project
   * @param {string} details - Description of what changed
   */
  async function addLog(username, action, projektTitel, details) {
    const { error } = await getSupabase()
      .from('audit_log')
      .insert([{
        username,
        action,
        projekt_titel: projektTitel,
        details
      }])
    if (error) throw error
  }

  return { logs, loading, addLog }
}
