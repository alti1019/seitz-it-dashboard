'use client'
import { useState } from 'react'
import { inputStyle } from '@/lib/constants'

/**
 * Simple user picker with dropdown and "add name" option.
 * No password required — just pick a name.
 * @param {Object} props
 * @param {Array} props.benutzer - List of { id, name } from database
 * @param {boolean} props.loading - Whether users are still loading
 * @param {Function} props.onSelect - Callback with selected name
 * @param {Function} props.onAddName - Callback to add a new name
 */
export default function UserPicker({ benutzer, loading, onSelect, onAddName }) {
  const [selected, setSelected] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  function handleSelect() {
    if (selected) onSelect(selected)
  }

  async function handleAddName() {
    if (!newName.trim()) return
    setAdding(true)
    try {
      await onAddName(newName.trim())
      setNewName('')
      setShowAdd(false)
      setSelected(newName.trim())
    } catch (err) {
      alert('Fehler: ' + err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 400, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: 40 }} className="fade-in">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: '#475569', letterSpacing: 3, marginBottom: 8 }}>AUTOHAUS SEITZ GRUPPE</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#f1f5f9' }}>IT-Projektplanung</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Wer bist du?</div>
        </div>

        {loading ? (
          <div style={{ color: '#475569', fontSize: 13, padding: 20, textAlign: 'center' }}>Laden...</div>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>NAME AUSWÄHLEN</div>
              <select
                autoFocus
                value={selected}
                onChange={e => setSelected(e.target.value)}
                style={inputStyle}
              >
                <option value="">— Bitte wählen —</option>
                {benutzer.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <button
              className="btn"
              onClick={handleSelect}
              disabled={!selected}
              style={{
                width: '100%', padding: 12, background: selected ? '#3b82f6' : '#1e3a5f',
                border: 'none', borderRadius: 3,
                color: selected ? '#fff' : '#64748b',
                cursor: selected ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 600, letterSpacing: 0.5,
                marginBottom: 16,
              }}
            >
              Weiter →
            </button>

            <div style={{ borderTop: '1px solid #334155', paddingTop: 16 }}>
              {!showAdd ? (
                <button
                  className="btn"
                  onClick={() => setShowAdd(true)}
                  style={{
                    width: '100%', padding: 10, background: 'transparent',
                    border: '1px solid #334155', borderRadius: 3,
                    color: '#64748b', fontSize: 12, cursor: 'pointer'
                  }}
                >
                  + Name hinzufügen
                </button>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddName()}
                    placeholder="Neuer Name"
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button
                    className="btn"
                    onClick={handleAddName}
                    disabled={adding || !newName.trim()}
                    style={{
                      padding: '8px 16px', background: '#22c55e', border: 'none',
                      borderRadius: 3, color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                    }}
                  >
                    {adding ? '...' : 'OK'}
                  </button>
                  <button
                    className="btn"
                    onClick={() => { setShowAdd(false); setNewName('') }}
                    style={{
                      padding: '8px 12px', background: 'transparent', border: '1px solid #334155',
                      borderRadius: 3, color: '#64748b', fontSize: 12, cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
