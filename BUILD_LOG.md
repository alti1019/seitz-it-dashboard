# BUILD_LOG — IT-Dashboard Autohaus Seitz

Dieser Log dokumentiert den schrittweisen Aufbau der App mit Claude Code.
Jeder Schritt wird nach Abschluss hier eingetragen.

---

## Schritt 1 – Next.js Projekt initialisieren
**Was:** Next.js 14 App mit App Router, ESLint und src-Verzeichnis aufgesetzt. Supabase-Pakete (`@supabase/supabase-js`, `@supabase/ssr`) installiert. Original HTML-Datei ins Projekt kopiert als Referenz.
**Warum:** Next.js bietet natives Vercel-Hosting, modernes React mit App Router und serverseitige Optimierungen. JavaScript statt TypeScript gewaehlt, da das Original-Dashboard ebenfalls JS nutzt und die Komplexitaet gering bleibt.
**Dateien:** `package.json`, `next.config.mjs`, `jsconfig.json`, `eslint.config.mjs`, `src/app/layout.js`, `src/app/page.js`, `CLAUDE.md`, `BUILD_LOG.md`
**Status:** Abgeschlossen

---

## Schritt 2 – Supabase Schema und Seed-Daten
**Was:** Datenbankschema mit zwei Tabellen erstellt: `projekte` (IT-Projekte mit Prio, Titel, Cluster, Fortschritt) und `audit_log` (Aenderungsprotokoll). Row Level Security aktiviert — nur authentifizierte User haben Zugriff. Trigger fuer automatisches `updated_at`. Seed-Datei mit allen 100 Projekten aus der Original-HTML generiert.
**Warum:** Supabase PostgreSQL bietet Echtzeit-Updates, Row Level Security und eine REST-API out-of-the-box. Die Seed-Daten stellen sicher, dass die App sofort mit den echten Projektdaten lauffaehig ist.
**Dateien:** `supabase/schema.sql`, `supabase/seed.sql`
**Status:** Abgeschlossen
