'use client'
import { useMemo } from 'react'

/**
 * Statistics bar showing project overview counts.
 * @param {Object} props
 * @param {Array} props.projekte - Array of all projects
 */
export default function StatsBar({ projekte }) {
  const stats = useMemo(() => {
    const t = projekte.length
    const done = projekte.filter(p => p.fertig === 100).length
    const active = projekte.filter(p => p.fertig > 0 && p.fertig < 100).length
    const todo = projekte.filter(p => p.fertig === 0).length
    const avg = t > 0 ? Math.round(projekte.reduce((s, p) => s + (p.fertig || 0), 0) / t) : 0
    return { t, done, active, todo, avg }
  }, [projekte])

  const items = [
    { label: 'Gesamt', val: stats.t, color: '#64748b' },
    { label: 'Fertig', val: stats.done, color: '#22c55e' },
    { label: 'Aktiv', val: stats.active, color: '#f59e0b' },
    { label: 'Offen', val: stats.todo, color: '#ef4444' },
    { label: 'Ø Fortschritt', val: stats.avg + '%', color: '#3b82f6' },
  ]

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
      {items.map((s, i) => (
        <div key={i} style={{
          flex: 1, padding: '14px 20px',
          borderRight: i < 4 ? '1px solid #334155' : 'none',
          background: '#1e293b'
        }}>
          <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, marginBottom: 4 }}>{s.label.toUpperCase()}</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>{s.val}</div>
        </div>
      ))}
    </div>
  )
}
