'use client'
import { useState } from 'react'
import { PRIO_COLORS, ALL_PRIOS, getProgressColor, inputStyle } from '@/lib/constants'
import ProgressBar from './ProgressBar'

/**
 * Single project row with inline editing capability.
 * @param {Object} props
 * @param {Object} props.project - Project data
 * @param {boolean} props.canEdit - Whether the user can edit
 * @param {Function} props.onSave - Callback with updated project
 * @param {Function} props.onDelete - Callback to delete the project
 * @param {Array} props.allClusters - List of all cluster names for autocomplete
 */
export default function ProjectRow({ project, canEdit, onSave, onDelete, allClusters }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ ...project })

  function handleSave() {
    onSave({ ...draft, fertig: Number(draft.fertig) })
    setEditing(false)
  }

  if (editing) {
    return (
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', background: '#0a1628' }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 100px', gap: 8, marginBottom: 10 }}>
          <select
            value={draft.prio || ''}
            onChange={e => setDraft(f => ({ ...f, prio: e.target.value }))}
            style={inputStyle}
          >
            {ALL_PRIOS.map(p => <option key={p}>{p}</option>)}
          </select>
          <input
            value={draft.titel || ''}
            onChange={e => setDraft(f => ({ ...f, titel: e.target.value }))}
            style={inputStyle}
            placeholder="Projekttitel"
          />
          <input
            value={draft.cluster || ''}
            onChange={e => setDraft(f => ({ ...f, cluster: e.target.value }))}
            style={inputStyle}
            placeholder="Cluster"
            list="cluster-dl"
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="number"
              min="0"
              max="100"
              value={draft.fertig}
              onChange={e => setDraft(f => ({ ...f, fertig: e.target.value }))}
              style={{ ...inputStyle, textAlign: 'center' }}
            />
            <span style={{ color: '#64748b', fontSize: 12 }}>%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn"
            onClick={handleSave}
            style={{ padding: '6px 16px', background: '#22c55e', border: 'none', borderRadius: 3, color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Speichern
          </button>
          <button
            className="btn"
            onClick={() => { setEditing(false); setDraft({ ...project }) }}
            style={{ padding: '6px 14px', background: 'transparent', border: '1px solid #334155', borderRadius: 3, color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="row-hover"
      style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 180px 140px 80px',
        padding: '10px 16px', borderBottom: '1px solid #1e293b',
        alignItems: 'center', transition: 'background 0.15s'
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: PRIO_COLORS[project.prio] || '#6b7280', fontFamily: "'IBM Plex Mono', monospace" }}>
        {project.prio || '—'}
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{project.titel}</div>
        {project.projektnr && (
          <div style={{ fontSize: 10, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>{project.projektnr}</div>
        )}
      </div>
      <div style={{ paddingRight: 8 }}>
        {(project.cluster || 'Sonstiges').split(', ').map((c, i) => (
          <div key={i} style={{ fontSize: 10, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</div>
        ))}
      </div>
      <div style={{ paddingRight: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}><ProgressBar value={project.fertig} /></div>
          <span style={{ fontSize: 11, color: getProgressColor(project.fertig), fontFamily: "'IBM Plex Mono', monospace", minWidth: 32, textAlign: 'right' }}>
            {project.fertig}%
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {canEdit && (
          <>
            <button
              className="btn"
              onClick={() => setEditing(true)}
              style={{ padding: '4px 10px', background: '#1e3a5f', border: '1px solid #1d4ed8', borderRadius: 3, color: '#93c5fd', fontSize: 11, cursor: 'pointer' }}
            >
              Edit
            </button>
            <button
              className="btn"
              onClick={onDelete}
              style={{ padding: '4px 8px', background: 'transparent', border: '1px solid #334155', borderRadius: 3, color: '#64748b', fontSize: 11, cursor: 'pointer' }}
            >
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  )
}
