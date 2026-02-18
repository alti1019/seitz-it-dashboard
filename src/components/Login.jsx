'use client'
import { useState } from 'react'
import { inputStyle } from '@/lib/constants'

/**
 * Login form component with email/password authentication.
 * @param {Object} props
 * @param {Function} props.onLogin - Callback with (email, password)
 */
export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err.message || 'Anmeldung fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: 400, background: '#1e293b', border: '1px solid #334155', borderRadius: 6, padding: 40 }} className="fade-in">
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: '#475569', letterSpacing: 3, marginBottom: 8 }}>AUTOHAUS SEITZ GRUPPE</div>
          <div style={{ fontSize: 24, fontWeight: 600, color: '#f1f5f9' }}>IT-Projektplanung</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>Internes Dashboard — Bitte anmelden</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>EMAIL</div>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="z.B. admin@seitz.de"
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginBottom: 5 }}>PASSWORT</div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          {error && (
            <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 14, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 3 }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn"
            style={{
              width: '100%', padding: 12, background: '#3b82f6', border: 'none', borderRadius: 3,
              color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', letterSpacing: 0.5,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Anmeldung...' : 'Anmelden →'}
          </button>
        </form>
        <div style={{ marginTop: 28, padding: 16, background: '#0f172a', borderRadius: 3, fontSize: 11, color: '#475569', lineHeight: 2 }}>
          <strong style={{ color: '#64748b' }}>Demo-Zugänge</strong><br />
          admin@seitz.de / seitz2024 → Admin (Vollzugriff)<br />
          it-leitung@seitz.de / seitz2024 → Editor<br />
          gast@seitz.de / gast123 → Nur lesen
        </div>
      </div>
    </div>
  )
}
