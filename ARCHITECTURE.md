# IT-Dashboard Autohaus Seitz – Architektur

## Ueberblick

Web App zur Verwaltung von IT-Projekten der Autohaus Seitz Gruppe.
Gebaut mit Claude Code aus einer einzelnen HTML-Datei in eine vollwertige, gehostete Web App.

## Stack

| Schicht    | Technologie                | Begruendung                                         |
|------------|----------------------------|-----------------------------------------------------|
| Framework  | Next.js 14 (App Router)    | Natives Vercel-Hosting, modernes React               |
| Datenbank  | Supabase PostgreSQL        | Echtzeit-Updates, Row Level Security                 |
| Auth       | Supabase Auth              | Email/Passwort + Rollen via User Metadata            |
| Realtime   | Supabase Realtime          | Aenderungen sofort fuer alle User sichtbar           |
| Hosting    | Vercel                     | Auto-Deployment bei Git Push, Zero-Config            |
| Styling    | Inline-Styles              | 1:1 Uebernahme aus Original-HTML, kein Build-Step    |
| Fonts      | IBM Plex (next/font/google)| Lokal gehostet, DSGVO-konform                       |

## Benutzerrollen

| Rolle   | Rechte                                      |
|---------|---------------------------------------------|
| admin   | Lesen, Schreiben, Loeschen, Logs einsehen   |
| editor  | Lesen, Schreiben                             |
| viewer  | Nur Lesen                                    |

Rollen werden im Supabase Dashboard unter User Metadata gesetzt:
```json
{ "role": "admin", "display_name": "Max Mustermann" }
```

## Datenbankstruktur

### Tabelle: `projekte`
| Spalte     | Typ           | Beschreibung                    |
|------------|---------------|---------------------------------|
| id         | UUID (PK)     | Automatisch generiert           |
| prio       | TEXT          | Prioritaet (A++++, A+++, ..., C, ?) |
| titel      | TEXT NOT NULL  | Projektbezeichnung              |
| projektnr  | TEXT          | Optionale Projektnummer (#400#) |
| fertig     | INTEGER (0-100) | Fortschritt in Prozent         |
| cluster    | TEXT          | Kategorie(n), komma-getrennt    |
| created_at | TIMESTAMPTZ   | Erstellungszeitpunkt            |
| updated_at | TIMESTAMPTZ   | Automatisch via Trigger         |

### Tabelle: `audit_log`
| Spalte       | Typ         | Beschreibung                    |
|--------------|-------------|---------------------------------|
| id           | UUID (PK)   | Automatisch generiert           |
| ts           | TIMESTAMPTZ | Zeitstempel                     |
| username     | TEXT        | Wer hat die Aenderung gemacht   |
| action       | TEXT        | Art der Aenderung               |
| projekt_titel| TEXT        | Betroffenes Projekt             |
| details      | TEXT        | Was genau geaendert wurde       |

### Sicherheit (Row Level Security)
- Beide Tabellen sind mit RLS geschuetzt
- Nur authentifizierte User (`TO authenticated`) haben Zugriff
- Kein oeffentlicher Zugriff moeglich

## Projektstruktur

```
seitz-it-dashboard/
├── src/
│   ├── app/
│   │   ├── layout.jsx              ← IBM Plex Fonts, globale Styles
│   │   ├── page.jsx                ← Hauptseite (Auth-Gate + Dashboard)
│   │   └── globals.css             ← Minimal (Styles sind inline)
│   ├── components/
│   │   ├── Login.jsx               ← Email/Passwort Login-Formular
│   │   ├── ProjectRow.jsx          ← Einzelne Zeile mit Inline-Edit
│   │   ├── ProjectTable.jsx        ← Sortierbare Tabelle (4 Spalten)
│   │   ├── ClusterView.jsx         ← Cluster-Karten mit Aufklapp-Details
│   │   ├── AddProjectModal.jsx     ← Modal zum Projekt-Hinzufuegen
│   │   ├── AuditLogPanel.jsx       ← Aenderungsprotokoll-Ansicht
│   │   ├── StatsBar.jsx            ← Statistik-Leiste (Gesamt/Fertig/Aktiv/Offen)
│   │   └── ProgressBar.jsx         ← Farbige Fortschrittsanzeige
│   ├── hooks/
│   │   ├── useAuth.js              ← Supabase Auth + Rollen
│   │   ├── useProjekte.js          ← CRUD + Realtime fuer Projekte
│   │   └── useAuditLog.js          ← Audit-Log lesen + schreiben
│   └── lib/
│       ├── supabase.js             ← Lazy-initialisierter Supabase-Client
│       └── constants.js            ← PRIO_ORDER, PRIO_COLORS, Helpers
├── supabase/
│   ├── schema.sql                  ← Datenbankschema (im SQL Editor ausfuehren)
│   └── seed.sql                    ← 100 Initialprojekte
├── public/                         ← Statische Assets
├── .env.example                    ← Vorlage fuer Umgebungsvariablen
├── .env.local                      ← Lokale Umgebungsvariablen (nicht in Git!)
├── BUILD_LOG.md                    ← Schritt-fuer-Schritt Bau-Dokumentation
├── ARCHITECTURE.md                 ← Diese Datei
├── CLAUDE.md                       ← Projekt-Briefing fuer Claude Code
├── IT-Dashboard-Seitz.html         ← Original HTML (Referenz)
└── package.json
```

## Datenfluss

```
Browser (React)
    │
    ├── useAuth() ──────────── Supabase Auth (Login/Logout/Session)
    │
    ├── useProjekte() ──────── Supabase DB (CRUD auf `projekte`)
    │   └── Realtime ◄──────── Supabase Realtime (postgres_changes)
    │
    └── useAuditLog() ──────── Supabase DB (INSERT auf `audit_log`)
        └── Realtime ◄──────── Supabase Realtime (INSERT events)
```

## Deployment-Pipeline

```
Code aendern → git push → GitHub → Vercel Webhook → next build → Live
                                                     (~30 Sekunden)
```

## Lokale Entwicklung

1. Repository klonen
2. `npm install`
3. `.env.local` anlegen (siehe `.env.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
4. `npm run dev` → http://localhost:3000

## Supabase einrichten

1. Neues Projekt auf [supabase.com](https://supabase.com) anlegen
2. SQL Editor oeffnen → `supabase/schema.sql` ausfuehren
3. SQL Editor → `supabase/seed.sql` ausfuehren (100 Projekte laden)
4. Authentication → Users → 3 User anlegen:
   - `admin@seitz.de` / `seitz2024` → Metadata: `{ "role": "admin", "display_name": "Admin" }`
   - `it-leitung@seitz.de` / `seitz2024` → Metadata: `{ "role": "editor", "display_name": "IT-Leitung" }`
   - `gast@seitz.de` / `gast123` → Metadata: `{ "role": "viewer", "display_name": "Gast" }`
5. Project URL + Anon Key aus Settings → API kopieren

## Technische Entscheidungen

| Entscheidung | Begruendung |
|---|---|
| JavaScript statt TypeScript | Original-HTML war JS, Demo-Fokus auf Geschwindigkeit |
| Inline-Styles statt Tailwind | 1:1 visuelle Uebereinstimmung mit Original |
| Supabase statt eigenes Backend | Auth + DB + Realtime aus einer Hand, kein Server noetig |
| Lazy Supabase-Client (Proxy) | Build laeuft auch ohne gesetzte Env-Vars durch |
| next/font/google | Fonts werden lokal ausgeliefert → DSGVO-konform |
| Spalten-Sortierung client-seitig | Bei 100 Projekten performant, kein Server-Roundtrip |

---

*Gebaut mit [Claude Code](https://claude.com/claude-code) — AI-gestuetzte Softwareentwicklung.*
