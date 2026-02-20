'use client'
import { useState } from 'react'
import { ALL_PRIOS, inputStyle } from '@/lib/constants'

/**
 * Modal dialog for adding a new project.
 * @param {Object} props
 * @param {Function} props.onAdd - Callback with new project data
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Array} props.allClusters - All cluster names for autocomplete
 */
export default function AddProjectModal({ onAdd, onClose, allClusters }) {
  const [newP, setNewP] = useState({
    titel: '', prio: 'A', fertig: 0, cluster: '',
    projektnr: '', bereich: 'IT', started_at: '',
  })

  function handleAdd() {
    onAdd({
      ...newP,
      fertig: Number(newP.fertig),
      started_at: newP.started_at || null,
    })
    onClose()
  }

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: 36, width: 520, maxWidth: '95vw' }} className="fade-in">
        <div style={{ fontSize: 18, fontWeight: 600, color: '#f1f5f9', marginBottom: 24 }}>Neues Projekt hinzufügen</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>TITEL *</div>
          <input
            autoFocus
            value={newP.titel}
            onChange={e => setNewP(f => ({ ...f, titel: e.target.value }))}
            style={inputStyle}
            placeholder="Projekttitel"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>PRIORITÄT</div>
            <select value={newP.prio} onChange={e => setNewP(f => ({ ...f, prio: e.target.value }))} style={inputStyle}>
              {ALL_PRIOS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>FORTSCHRITT (%)</div>
            <input
              type="number"
              min="0"
              max="100"
              value={newP.fertig}
              onChange={e => setNewP(f => ({ ...f, fertig: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>BEREICH</div>
            <select value={newP.bereich} onChange={e => setNewP(f => ({ ...f, bereich: e.target.value }))} style={inputStyle}>
              <option value="IT">IT</option>
              <option value="Prozessmanagement">Prozessmanagement</option>
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>STARTDATUM</div>
            <input
              type="date"
              value={newP.started_at}
              onChange={e => setNewP(f => ({ ...f, started_at: e.target.value }))}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>CLUSTER</div>
          <input
            value={newP.cluster}
            onChange={e => setNewP(f => ({ ...f, cluster: e.target.value }))}
            style={inputStyle}
            placeholder="z.B. IT-Security / Endpoint / Hardening"
            list="cluster-dl"
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>PROJEKTNR. (OPTIONAL)</div>
          <input
            value={newP.projektnr}
            onChange={e => setNewP(f => ({ ...f, projektnr: e.target.value }))}
            style={inputStyle}
            placeholder="#000#"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 8, justifyContent: 'flex-end' }}>
          <button
            className="btn"
            onClick={onClose}
            style={{ padding: '9px 18px', background: 'transparent', border: '1px solid #334155', borderRadius: 3, color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}
          >
            Abbrechen
          </button>
          <button
            className="btn"
            onClick={handleAdd}
            disabled={!newP.titel}
            style={{
              padding: '9px 20px',
              background: newP.titel ? '#3b82f6' : '#1e3a5f',
              border: 'none', borderRadius: 3,
              color: newP.titel ? '#fff' : '#64748b',
              cursor: newP.titel ? 'pointer' : 'not-allowed',
              fontSize: 13, fontWeight: 600
            }}
          >
            Hinzufügen
          </button>
        </div>
      </div>
    </div>
  )
}
