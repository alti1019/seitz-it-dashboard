'use client'
import ProjectRow from './ProjectRow'

/**
 * Project table with sortable column headers.
 * @param {Object} props
 * @param {Array} props.projekte - Filtered and sorted projects
 * @param {boolean} props.canEdit - Whether the user can edit
 * @param {Function} props.onSave - Callback for saving project edits
 * @param {Function} props.onDelete - Callback for deleting a project
 * @param {Array} props.allClusters - All cluster names for autocomplete
 */
export default function ProjectTable({ projekte, canEdit, onSave, onDelete, allClusters }) {
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '80px 1fr 180px 140px 80px',
        padding: '9px 16px', borderBottom: '1px solid #334155',
        fontSize: 10, color: '#475569', letterSpacing: 2
      }}>
        <div>PRIO</div>
        <div>PROJEKT</div>
        <div>CLUSTER</div>
        <div>FORTSCHRITT</div>
        <div>AKTIONEN</div>
      </div>
      {projekte.map(p => (
        <ProjectRow
          key={p.id}
          project={p}
          canEdit={canEdit}
          onSave={onSave}
          onDelete={() => onDelete(p.id)}
          allClusters={allClusters}
        />
      ))}
      {projekte.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>Keine Projekte gefunden.</div>
      )}
    </div>
  )
}
