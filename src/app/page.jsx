'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProjekte } from '@/hooks/useProjekte'
import { useAuditLog } from '@/hooks/useAuditLog'
import { ALL_PRIOS, PRIO_COLORS, inputStyle } from '@/lib/constants'
import Login from '@/components/Login'
import StatsBar from '@/components/StatsBar'
import ProjectTable from '@/components/ProjectTable'
import ClusterView from '@/components/ClusterView'
import AddProjectModal from '@/components/AddProjectModal'
import AuditLogPanel from '@/components/AuditLogPanel'

/**
 * Main dashboard page. Handles auth gate, filtering, and view switching.
 */
export default function Home() {
  const { user, loading: authLoading, signIn, signOut, canEdit, role, displayName } = useAuth()
  const { projekte, loading, addProjekt, updateProjekt, deleteProjekt } = useProjekte()
  const { logs, loading: logsLoading, addLog } = useAuditLog()

  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [filterPrio, setFilterPrio] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  // Derive all cluster names from projects
  const allClusters = useMemo(() => {
    return [...new Set(projekte.flatMap(r => r.cluster ? r.cluster.split(', ') : ['Sonstiges']))].sort()
  }, [projekte])

  // Filter projects based on search, prio, and status
  const filtered = useMemo(() => {
    let arr = [...projekte]
    if (search) {
      const q = search.toLowerCase()
      arr = arr.filter(p =>
        (p.titel || '').toLowerCase().includes(q) ||
        (p.cluster || '').toLowerCase().includes(q) ||
        (p.projektnr || '').toLowerCase().includes(q)
      )
    }
    if (filterPrio.length) arr = arr.filter(p => filterPrio.includes(p.prio))
    if (filterStatus === 'done') arr = arr.filter(p => p.fertig === 100)
    if (filterStatus === 'active') arr = arr.filter(p => p.fertig > 0 && p.fertig < 100)
    if (filterStatus === 'todo') arr = arr.filter(p => p.fertig === 0)
    return arr
  }, [projekte, search, filterPrio, filterStatus])

  async function handleSave(updated) {
    const original = projekte.find(p => p.id === updated.id)
    if (!original) return

    const changes = []
    if (original.fertig !== updated.fertig) changes.push(`Fortschritt: ${original.fertig}% → ${updated.fertig}%`)
    if (original.prio !== updated.prio) changes.push(`Prio: ${original.prio} → ${updated.prio}`)
    if (original.cluster !== updated.cluster) changes.push('Cluster geändert')
    if (original.titel !== updated.titel) changes.push('Titel geändert')

    try {
      await updateProjekt(updated.id, {
        prio: updated.prio,
        titel: updated.titel,
        cluster: updated.cluster,
        fertig: updated.fertig,
        projektnr: updated.projektnr,
      })
      if (changes.length) {
        await addLog(displayName, 'Bearbeitet', updated.titel, changes.join(', '))
      }
    } catch (err) {
      alert('Fehler beim Speichern: ' + err.message)
    }
  }

  async function handleDelete(id) {
    const p = projekte.find(x => x.id === id)
    if (!p) return
    if (!window.confirm(`Projekt "${p.titel}" wirklich löschen?`)) return

    try {
      await deleteProjekt(id)
      await addLog(displayName, 'Gelöscht', p.titel, 'Projekt gelöscht')
    } catch (err) {
      alert('Fehler beim Löschen: ' + err.message)
    }
  }

  async function handleAdd(newProject) {
    try {
      const inserted = await addProjekt(newProject)
      await addLog(displayName, 'Hinzugefügt', newProject.titel, `Prio: ${newProject.prio}, Cluster: ${newProject.cluster || '—'}`)
    } catch (err) {
      alert('Fehler beim Hinzufügen: ' + err.message)
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#475569', fontSize: 14 }}>Laden...</div>
      </div>
    )
  }

  // Auth gate
  if (!user) return <Login onLogin={signIn} />

  return (
    <main style={{ minHeight: '100vh', background: '#0f172a' }}>
      {/* Cluster datalist for autocomplete */}
      <datalist id="cluster-dl">
        {allClusters.map(c => <option key={c} value={c} />)}
      </datalist>

      {/* HEADER */}
      <header style={{
        background: '#1e293b', borderBottom: '1px solid #334155',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 54 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div>
              <span style={{ fontSize: 10, color: '#475569', letterSpacing: 2, fontFamily: "'IBM Plex Mono', monospace" }}>SEITZ GRUPPE</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f1f5f9', marginLeft: 14 }}>IT-Projektplanung</span>
            </div>
            <nav style={{ display: 'flex', gap: 3 }}>
              {[['list', 'Liste'], ['cluster', 'Cluster'], ['logs', 'Logs']].map(([v, label]) => (
                <button key={v} className="btn" onClick={() => setView(v)} style={{
                  padding: '6px 14px', background: view === v ? '#3b82f6' : 'transparent',
                  border: view === v ? 'none' : '1px solid #334155', borderRadius: 3,
                  color: view === v ? '#fff' : '#94a3b8', fontSize: 12, cursor: 'pointer',
                  fontWeight: view === v ? 600 : 400
                }}>
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontSize: 10, padding: '3px 10px',
              background: role === 'admin' ? '#1d4ed8' : role === 'editor' ? '#065f46' : '#374151',
              borderRadius: 99,
              color: role === 'admin' ? '#bfdbfe' : role === 'editor' ? '#6ee7b7' : '#9ca3af'
            }}>
              {role.toUpperCase()}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{displayName}</span>
            <button
              className="btn"
              onClick={signOut}
              style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #334155', borderRadius: 3, color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* STATS */}
      <StatsBar projekte={projekte} />

      <div style={{ padding: '20px 24px' }}>
        {/* FILTER BAR */}
        {view !== 'logs' && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Suche..."
              style={{ ...inputStyle, width: 210 }}
            />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
              <option value="all">Alle Status</option>
              <option value="done">Abgeschlossen</option>
              <option value="active">In Bearbeitung</option>
              <option value="todo">Noch offen</option>
            </select>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_PRIOS.map(p => (
                <button
                  key={p}
                  className="btn"
                  onClick={() => setFilterPrio(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                  style={{
                    padding: '5px 11px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                    background: filterPrio.includes(p) ? PRIO_COLORS[p] : '#1e293b',
                    border: `1px solid ${filterPrio.includes(p) ? PRIO_COLORS[p] : '#334155'}`,
                    borderRadius: 3, color: filterPrio.includes(p) ? '#fff' : '#64748b'
                  }}
                >
                  {p}
                </button>
              ))}
              {filterPrio.length > 0 && (
                <button
                  className="btn"
                  onClick={() => setFilterPrio([])}
                  style={{ padding: '5px 10px', background: 'transparent', border: '1px solid #334155', borderRadius: 3, color: '#64748b', fontSize: 11, cursor: 'pointer' }}
                >
                  Reset
                </button>
              )}
            </div>
            {canEdit && (
              <button
                className="btn"
                onClick={() => setShowAdd(true)}
                style={{ marginLeft: 'auto', padding: '8px 18px', background: '#3b82f6', border: 'none', borderRadius: 3, color: '#fff', fontSize: 13, cursor: 'pointer', fontWeight: 600 }}
              >
                + Projekt hinzufügen
              </button>
            )}
          </div>
        )}

        {view !== 'logs' && (
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 12 }}>
            {filtered.length} von {projekte.length} Projekten
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>Projekte werden geladen...</div>
        )}

        {/* LIST VIEW */}
        {!loading && view === 'list' && (
          <ProjectTable
            projekte={filtered}
            canEdit={canEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            allClusters={allClusters}
          />
        )}

        {/* CLUSTER VIEW */}
        {!loading && view === 'cluster' && (
          <ClusterView projekte={filtered} />
        )}

        {/* LOGS VIEW */}
        {view === 'logs' && (
          <AuditLogPanel logs={logs} loading={logsLoading} />
        )}
      </div>

      {/* ADD MODAL */}
      {showAdd && (
        <AddProjectModal
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
          allClusters={allClusters}
        />
      )}
    </main>
  )
}
