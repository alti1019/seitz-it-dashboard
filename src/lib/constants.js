/** Priority sort order – lower number = higher priority */
export const PRIO_ORDER = {
  'A++++': 0,
  'A+++': 1,
  'A++': 2,
  'A+': 3,
  'A': 4,
  'B': 5,
  'C': 6,
  '?': 7
}

/** Priority badge colors */
export const PRIO_COLORS = {
  'A++++': '#ef4444',
  'A+++': '#f97316',
  'A++': '#f59e0b',
  'A+': '#eab308',
  'A': '#22c55e',
  'B': '#3b82f6',
  'C': '#8b5cf6',
  '?': '#6b7280'
}

/** All priority levels in order */
export const ALL_PRIOS = ['A++++', 'A+++', 'A++', 'A+', 'A', 'B', 'C', '?']

/** Status filter options with colors */
export const STATUS_OPTIONS = [
  { key: 'done', label: 'Abgeschlossen', color: '#22c55e' },
  { key: 'active', label: 'In Bearbeitung', color: '#f59e0b' },
  { key: 'todo', label: 'Noch offen', color: '#64748b' },
]

/** Bereich tabs for project categories */
export const BEREICHE = ['Gesamt', 'IT', 'Prozessmanagement']

/**
 * Returns a color based on completion percentage.
 * @param {number} p - Completion percentage (0-100)
 * @returns {string} Hex color code
 */
export function getProgressColor(p) {
  if (p === 100) return '#22c55e'
  if (p >= 70) return '#84cc16'
  if (p >= 30) return '#f59e0b'
  if (p > 0) return '#ef4444'
  return '#475569'
}

/** Shared input field styles */
export const inputStyle = {
  width: '100%',
  background: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 3,
  padding: '8px 11px',
  color: '#e2e8f0',
  fontSize: 13,
  outline: 'none'
}
