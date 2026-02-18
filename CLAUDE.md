# Seitz IT Dashboard

## Projekt-Briefing
- **Kunde:** Seitz IT
- **Typ:** IT-Dashboard (internes Tool)
- **Status:** Setup-Phase
- **Erstellt:** 2026-02-18

## Tech-Stack
- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS + shadcn/ui
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel (Auto-Deploy via Git)
- **Validierung:** Zod
- **Styling:** Tailwind CSS + shadcn/ui

## Features
- [x] Projekt-Setup
- [ ] Auth/Login (Supabase Auth)
- [ ] Dashboard-Layout
- [ ] Daten-Ansichten

## Architektur
```
src/
  app/              # Next.js App Router Pages
    (auth)/          # Auth-geschuetzte Routen
    login/           # Login-Seite (oeffentlich)
    api/             # API Routes
  components/        # React-Komponenten
    ui/              # shadcn/ui Komponenten
  lib/               # Utilities, Supabase Client, Typen
  types/             # TypeScript-Typen
```

## Umgebungsvariablen
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Konventionen
- Code-Kommentare und Variablennamen: Englisch
- UI-Labels: Deutsch
- Commit-Messages: Englisch (Conventional Commits)
- Eine Datei pro Komponente
- Exportierte Funktionen brauchen JSDoc
- Keine console.log in Production
- DSGVO: Google Fonts lokal, cookieless Analytics
