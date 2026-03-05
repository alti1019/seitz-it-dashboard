'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'seitz-dashboard-user'
const AUTH_KEY = 'seitz-dashboard-auth'
const PASSWORD = 'Seitz2026!'

/**
 * Auth hook with shared password gate + user name selection.
 * Password is validated client-side and persisted in localStorage.
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false)
  const [displayName, setDisplayName] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === '1') setAuthenticated(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setDisplayName(stored)
    setLoading(false)
  }, [])

  /**
   * Validate shared password and persist auth state.
   * @param {string} password
   * @returns {boolean} whether password was correct
   */
  function login(password) {
    if (password !== PASSWORD) return false
    localStorage.setItem(AUTH_KEY, '1')
    setAuthenticated(true)
    return true
  }

  /**
   * Select a user by name and persist to localStorage.
   * @param {string} name - Display name
   */
  function selectUser(name) {
    localStorage.setItem(STORAGE_KEY, name)
    setDisplayName(name)
  }

  /** Clear only the name selection — stays authenticated. */
  function clearUser() {
    localStorage.removeItem(STORAGE_KEY)
    setDisplayName(null)
  }

  /** Full logout — clears password auth and name. */
  function logout() {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(STORAGE_KEY)
    setAuthenticated(false)
    setDisplayName(null)
  }

  return {
    user: displayName,
    displayName,
    authenticated,
    loading,
    login,
    selectUser,
    clearUser,
    logout,
    canEdit: true,
  }
}
