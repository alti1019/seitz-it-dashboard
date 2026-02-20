'use client'
import { useState } from 'react'
import { PRIO_COLORS, ALL_PRIOS, getProgressColor, inputStyle } from '@/lib/constants'
import ProgressBar from './ProgressBar'

/**
 * Formats a date string to German locale (DD.MM.YYYY).
 * @param {string|null} dateStr - ISO date string or null
 * @returns {string} Formatted date or '—'
 */
function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('de-DE')
}

/**
 * Single project row with inline editing capability.
 * @param {Object} props
 * @param {Object} props.project - Project data
 * @param {boolean} props.canEdit - Whether the user can edit
 * @param {Function} props.onSave - Callback with updated project
 * @param {Function} props.onDelete - Callback to delete the project
 * @param {Array} props.allClusters - List of all cluster names for autocomplete
 * @param {boolean} props.showBereich - Whether to show the bereich badge
 */
export default function ProjectRow({ project, canEdit, onSave, onDelete, allClusters, showBereich }) {
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
        <div style={{ display: 'grid', gridTemplateColumns: '140px 160px 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 3 }}>BEREICH</div>
            <select
              value={draft.bereich || 'IT'}
              onChange={e => setDraft(f => ({ ...f, bereich: e.target.value }))}
              style={inputStyle}
            >
              <option value="IT">IT</option>
              <option value="Prozessmanagement">Prozessmanagement</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 3 }}>STARTDATUM</div>
            <input
              type="date"
              value={draft.started_at || ''}
              onChange={e => setDraft(f => ({ ...f, started_at: e.target.value }))}
              style={inputStyle}
            />
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.4 }}>{project.titel}</span>
          {showBereich && project.bereich && (
            <span style={{
              fontSize: 9, padding: '1px 6px', borderRadius: 3,
              background: project.bereich === 'IT' ? '#1e3a5f' : '#3b1f5e',
              color: project.bereich === 'IT' ? '#93c5fd' : '#c4b5fd',
              fontWeight: 600, letterSpacing: 0.5, whiteSpace: 'nowrap',
            }}>
              {project.bereich === 'Prozessmanagement' ? 'PM' : project.bereich}
            </span>
          )}
        </div>
        {project.projektnr && (
          <div style={{ fontSize: 10, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>{project.projektnr}</div>
        )}
        <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>
          Start: {formatDate(project.started_at)} · Ende: {formatDate(project.ended_at)}
        </div>
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
