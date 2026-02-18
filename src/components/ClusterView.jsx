'use client'
import { useState, useMemo } from 'react'
import { PRIO_COLORS, getProgressColor } from '@/lib/constants'
import ProgressBar from './ProgressBar'

/**
 * Cluster card view grouping projects by their cluster.
 * @param {Object} props
 * @param {Array} props.projekte - Filtered projects
 */
export default function ClusterView({ projekte }) {
  const [expandedCluster, setExpandedCluster] = useState(null)

  const byCluster = useMemo(() => {
    const map = {}
    projekte.forEach(p => {
      const cls = p.cluster ? p.cluster.split(', ') : ['Sonstiges']
      cls.forEach(c => {
        if (!map[c]) map[c] = []
        if (!map[c].find(x => x.id === p.id)) map[c].push(p)
      })
    })
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]))
  }, [projekte])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
      {byCluster.map(([cluster, projs]) => {
        const avg = Math.round(projs.reduce((s, p) => s + p.fertig, 0) / projs.length)
        const isOpen = expandedCluster === cluster
        return (
          <div key={cluster} className="cluster-card" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 4, overflow: 'hidden' }}>
            <div
              onClick={() => setExpandedCluster(isOpen ? null : cluster)}
              style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{cluster}</div>
                <div style={{ fontSize: 11, color: '#475569' }}>
                  {projs.length} Projekte · {isOpen ? '▲ einklappen' : '▼ aufklappen'}
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 70 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: getProgressColor(avg), fontFamily: "'IBM Plex Mono', monospace" }}>{avg}%</div>
                <div style={{ width: 70, marginTop: 6 }}><ProgressBar value={avg} height={5} /></div>
              </div>
            </div>
            {isOpen && (
              <div style={{ borderTop: '1px solid #334155' }} className="fade-in">
                {projs.map(p => (
                  <div key={p.id} style={{
                    padding: '10px 18px', borderBottom: '1px solid #0f172a',
                    display: 'flex', alignItems: 'center', gap: 10
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: PRIO_COLORS[p.prio] || '#6b7280', fontFamily: "'IBM Plex Mono', monospace", minWidth: 40 }}>
                      {p.prio || '—'}
                    </span>
                    <span style={{ fontSize: 12, color: '#cbd5e1', flex: 1, lineHeight: 1.3 }}>{p.titel}</span>
                    <span style={{ fontSize: 12, color: getProgressColor(p.fertig), fontFamily: "'IBM Plex Mono', monospace", minWidth: 36, textAlign: 'right' }}>
                      {p.fertig}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
