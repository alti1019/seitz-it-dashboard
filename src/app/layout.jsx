import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export const metadata = {
  title: 'IT-Projektplanung – Autohaus Seitz Gruppe',
  description: 'Internes Dashboard zur Verwaltung von IT-Projekten der Autohaus Seitz Gruppe',
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body style={{
        margin: 0, padding: 0,
        background: '#0f172a',
        fontFamily: "'IBM Plex Sans', var(--font-ibm-plex-sans), sans-serif",
        color: '#e2e8f0',
        boxSizing: 'border-box',
      }}>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: #1e293b; }
          ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
          input, select, textarea, button { font-family: inherit; }
          .row-hover:hover { background: #1e293b !important; }
          .btn:hover { opacity: 0.82; transform: translateY(-1px); }
          .btn { transition: opacity 0.15s, transform 0.15s; }
          .cluster-card:hover { border-color: #3b82f6 !important; }
          .cluster-card { transition: border-color 0.2s; }
          .fade-in { animation: fadeIn 0.2s ease; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
          .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(2px); }
        `}</style>
        {children}
      </body>
    </html>
  )
}
