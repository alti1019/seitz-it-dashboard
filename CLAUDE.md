# IT-Dashboard Autohaus Seitz Gruppe

## Projekt-Briefing
- **Kunde:** Autohaus Seitz Gruppe
- **Typ:** IT-Projektplanung Dashboard (internes Tool)
- **Status:** In Entwicklung
- **Erstellt:** 2026-02-18
- **Ursprung:** Umbau einer Single-File HTML-App in vollwertige Web App

## Tech-Stack
- **Framework:** Next.js 14 (App Router) — JavaScript (kein TypeScript)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel (Auto-Deploy via Git)
- **Styling:** Inline-Styles (IBM Plex Sans + IBM Plex Mono)
- **Fonts:** IBM Plex via next/font/google (lokal gehostet, DSGVO-konform)

## Features
- [x] Projekt-Setup (Next.js + Supabase)
- [ ] Supabase Schema (projekte + audit_log)
- [ ] Auth mit Rollen (admin/editor/viewer)
- [ ] Projekt-Tabelle mit Inline-Edit
- [ ] Cluster-Ansicht (Karten)
- [ ] Aenderungsprotokoll (Audit Log)
- [ ] Spalten-Sortierung
- [ ] Echtzeit-Updates (Realtime)
- [ ] Vercel Deployment

## Architektur
```
src/
  app/
    layout.jsx          # IBM Plex Fonts, globale Styles
    page.jsx            # Hauptseite (App Entry Point)
  components/
    Login.jsx
    ProjectRow.jsx
    ProjectTable.jsx    # mit Spalten-Sortierung
    ClusterView.jsx
    AddProjectModal.jsx
    AuditLogPanel.jsx
    StatsBar.jsx
  hooks/
    useAuth.js
    useProjekte.js      # mit Realtime
    useAuditLog.js
  lib/
    supabase.js
    constants.js        # PRIO_ORDER, PRIO_COLORS etc.
supabase/
  schema.sql            # im Supabase SQL Editor ausfuehren
  seed.sql              # Initialdaten (100 Projekte)
```

## Umgebungsvariablen
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Benutzerrollen
| Rolle   | Rechte                              |
|---------|-------------------------------------|
| admin   | Lesen, Schreiben, Loeschen, Logs    |
| editor  | Lesen, Schreiben                    |
| viewer  | Nur Lesen                           |

## Konventionen
- Code-Kommentare und Variablennamen: Englisch
- UI-Labels: Deutsch
- Commit-Messages: Deutsch (fuer Praesentation)
- Inline-Styles (kein Tailwind, wie Original-HTML)
- DSGVO: Fonts lokal via next/font/google

## Wichtig: Praesentation
- BUILD_LOG.md dokumentiert jeden Bauschritt
- ARCHITECTURE.md erklaert die Gesamtarchitektur
- Git-Verlauf zeigt den schrittweisen Aufbau
- Dient als Demo fuer AI-gestuetzten Entwicklungsprozess
