# IT-Dashboard Autohaus Seitz Gruppe

## Projekt-Briefing
- **Kunde:** Autohaus Seitz Gruppe
- **Typ:** IT-Projektplanung Dashboard (internes Tool)
- **Status:** In Entwicklung
- **Erstellt:** 2026-02-18
- **Ursprung:** Umbau einer Single-File HTML-App in vollwertige Web App

## Tech-Stack
- **Framework:** Next.js 14 (App Router) — JavaScript (kein TypeScript)
- **Backend/DB:** Supabase (PostgreSQL + Realtime, kein Auth)
- **Hosting:** Vercel (Auto-Deploy via Git)
- **Styling:** Inline-Styles (IBM Plex Sans + IBM Plex Mono)
- **Fonts:** IBM Plex via next/font/google (lokal gehostet, DSGVO-konform)

## Features
- [x] Projekt-Setup (Next.js + Supabase)
- [x] Supabase Schema (projekte + audit_log + benutzer)
- [x] UserPicker statt Login (Dropdown ohne Passwort, localStorage)
- [x] Projekt-Tabelle mit Inline-Edit
- [x] Cluster-Ansicht (Karten)
- [x] Aenderungsprotokoll (Audit Log)
- [x] Spalten-Sortierung
- [x] Echtzeit-Updates (Realtime)
- [x] Vercel Deployment
- [x] Fortschritt-Filter als Toggle-Buttons (statt Dropdown)
- [x] Bereich-Reiter (Gesamt / IT / Prozessmanagement)
- [x] Start-/Enddatum pro Projekt (Enddatum auto bei 100%)

## Architektur
```
src/
  app/
    layout.jsx          # IBM Plex Fonts, globale Styles
    page.jsx            # Hauptseite (App Entry Point)
  components/
    UserPicker.jsx      # Nutzerauswahl (ersetzt Login.jsx)
    ProjectRow.jsx      # mit Bereich-Badge + Datum
    ProjectTable.jsx    # mit Spalten-Sortierung
    ClusterView.jsx
    AddProjectModal.jsx # mit Bereich + Startdatum
    AuditLogPanel.jsx
    StatsBar.jsx
  hooks/
    useAuth.js          # localStorage-basiert (kein Supabase Auth)
    useBenutzer.js      # CRUD fuer benutzer-Tabelle
    useProjekte.js      # mit Realtime
    useAuditLog.js
  lib/
    supabase.js
    constants.js        # PRIO_ORDER, PRIO_COLORS, STATUS_OPTIONS, BEREICHE
supabase/
  schema.sql            # Vollstaendiges Schema (Neuinstallation)
  migration-v2.sql      # Migration: bereich, datum, benutzer
  seed.sql              # Initialdaten (100 Projekte)
```

## Umgebungsvariablen
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## Benutzerverwaltung
- Keine Rollen, keine Passwoerter
- Einfacher Name-Picker (UserPicker.jsx) mit Dropdown
- Namen in `benutzer`-Tabelle (Supabase), neue per "Name hinzufuegen"
- Auswahl wird in localStorage gespeichert
- Alle Nutzer haben Vollzugriff (canEdit = true)

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
