'use client'

/**
 * Audit log panel showing all project changes.
 * @param {Object} props
 * @param {Array} props.logs - Array of audit log entries
 * @param {boolean} props.loading - Whether logs are still loading
 */
export default function AuditLogPanel({ logs, loading }) {
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>Lade Protokoll...</div>
  }

  if (logs.length === 0) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#475569', fontSize: 14 }}>
        Noch keine Änderungen protokolliert.<br />
        <span style={{ fontSize: 12 }}>Bearbeite oder füge ein Projekt hinzu — es erscheint hier.</span>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 14 }}>{logs.length} Einträge</div>
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '160px 100px 100px 200px 1fr',
          padding: '9px 16px', borderBottom: '1px solid #334155',
          fontSize: 10, color: '#475569', letterSpacing: 2
        }}>
          <div>ZEITPUNKT</div>
          <div>NUTZER</div>
          <div>AKTION</div>
          <div>PROJEKT</div>
          <div>DETAILS</div>
        </div>
        {logs.map(l => (
          <div key={l.id} style={{
            display: 'grid', gridTemplateColumns: '160px 100px 100px 200px 1fr',
            padding: '10px 16px', borderBottom: '1px solid #0f172a',
            fontSize: 12, alignItems: 'center'
          }}>
            <div style={{ color: '#64748b', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }}>
              {new Date(l.ts).toLocaleString('de-DE')}
            </div>
            <div style={{ color: '#94a3b8' }}>{l.username}</div>
            <div style={{
              color: l.action === 'Gelöscht' ? '#ef4444' : l.action === 'Hinzugefügt' ? '#22c55e' : '#f59e0b',
              fontWeight: 600
            }}>
              {l.action}
            </div>
            <div style={{ color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {l.projekt_titel}
            </div>
            <div style={{ color: '#64748b' }}>{l.details}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
