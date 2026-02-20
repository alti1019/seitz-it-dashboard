'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'seitz-dashboard-user'

/**
 * Simplified auth hook using localStorage for user selection.
 * No password, no Supabase Auth — just a display name.
 */
export function useAuth() {
  const [displayName, setDisplayName] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setDisplayName(stored)
    setLoading(false)
  }, [])

  /**
   * Select a user by name and persist to localStorage.
   * @param {string} name - Display name
   */
  function selectUser(name) {
    localStorage.setItem(STORAGE_KEY, name)
    setDisplayName(name)
  }

  /** Clear current user selection. */
  function clearUser() {
    localStorage.removeItem(STORAGE_KEY)
    setDisplayName(null)
  }

  return {
    user: displayName,
    displayName,
    loading,
    selectUser,
    clearUser,
    canEdit: true,
  }
}
