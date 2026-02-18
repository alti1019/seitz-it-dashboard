'use client'
import { useState, useMemo } from 'react'
import { PRIO_ORDER } from '@/lib/constants'
import ProjectRow from './ProjectRow'

/**
 * Sortable header component for table columns.
 * @param {Object} props
 * @param {string} props.label - Column label
 * @param {string} props.colKey - Sort key identifier
 * @param {Object} props.sortConfig - Current sort state
 * @param {Function} props.onSort - Callback to change sort
 */
function SortableHeader({ label, colKey, sortConfig, onSort }) {
  const active = sortConfig.key === colKey
  const icon = active ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'
  return (
    <div
      onClick={() => onSort(colKey)}
      style={{
        cursor: 'pointer', userSelect: 'none', fontSize: 11, fontWeight: 600,
        letterSpacing: 1.5, color: active ? '#3b82f6' : '#64748b'
      }}
    >
      {label.toUpperCase()}{icon}
    </div>
  )
}

/**
 * Project table with sortable columns: Prio, Titel, Cluster, Fortschritt.
 * @param {Object} props
 * @param {Array} props.projekte - Filtered projects (sorting handled internally)
 * @param {boolean} props.canEdit - Whether the user can edit
 * @param {Function} props.onSave - Callback for saving project edits
 * @param {Function} props.onDelete - Callback for deleting a project
 * @param {Array} props.allClusters - All cluster names for autocomplete
 */
export default function ProjectTable({ projekte, canEdit, onSave, onDelete, allClusters }) {
  const [sortConfig, setSortConfig] = useState({ key: 'prio', direction: 'asc' })

  const sorted = useMemo(() => {
    return [...projekte].sort((a, b) => {
      if (sortConfig.key === 'prio') {
        const diff = (PRIO_ORDER[a.prio] ?? 99) - (PRIO_ORDER[b.prio] ?? 99)
        return sortConfig.direction === 'asc' ? diff : -diff
      }
      if (sortConfig.key === 'fertig') {
        const diff = a.fertig - b.fertig
        return sortConfig.direction === 'asc' ? diff : -diff
      }
      if (sortConfig.key === 'titel') {
        return sortConfig.direction === 'asc'
          ? a.titel.localeCompare(b.titel, 'de')
          : b.titel.localeCompare(a.titel, 'de')
      }
      if (sortConfig.key === 'cluster') {
        return sortConfig.direction === 'asc'
          ? (a.cluster || '').localeCompare(b.cluster || '', 'de')
          : (b.cluster || '').localeCompare(a.cluster || '', 'de')
      }
      return 0
    })
  }, [projekte, sortConfig])

  function handleSort(key) {
    setSortConfig(prev =>
      prev.key === key
        ? { ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    )
  }

  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 180px 140px 80px',
        padding: '9px 16px', borderBottom: '1px solid #334155'
      }}>
        <SortableHeader label="Prio" colKey="prio" sortConfig={sortConfig} onSort={handleSort} />
        <SortableHeader label="Projekt" colKey="titel" sortConfig={sortConfig} onSort={handleSort} />
        <SortableHeader label="Cluster" colKey="cluster" sortConfig={sortConfig} onSort={handleSort} />
        <SortableHeader label="Fortschritt" colKey="fertig" sortConfig={sortConfig} onSort={handleSort} />
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#64748b' }}>AKTIONEN</div>
      </div>
      {sorted.map(p => (
        <ProjectRow
          key={p.id}
          project={p}
          canEdit={canEdit}
          onSave={onSave}
          onDelete={() => onDelete(p.id)}
          allClusters={allClusters}
        />
      ))}
      {sorted.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>Keine Projekte gefunden.</div>
      )}
    </div>
  )
}
