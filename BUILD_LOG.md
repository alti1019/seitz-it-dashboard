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

---

## Schritt 3 – Supabase Client und Umgebungsvariablen
**Was:** Supabase Browser-Client mit `@supabase/ssr` konfiguriert. Singleton-Pattern fuer Client Components. `.env.example` als Vorlage und `.env.local` fuer lokale Entwicklung angelegt.
**Warum:** `@supabase/ssr` ist die offizielle Loesung fuer Supabase in Next.js App Router. Der Singleton verhindert mehrfache Client-Instanzen. Umgebungsvariablen trennen Konfiguration vom Code.
**Dateien:** `src/lib/supabase.js`, `.env.example`, `.env.local`
**Status:** Abgeschlossen

---

## Schritt 4 – CRUD-Hooks mit Realtime
**Was:** Zwei Custom Hooks erstellt: `useProjekte` (Laden, Hinzufuegen, Bearbeiten, Loeschen von Projekten mit Realtime-Subscription) und `useAuditLog` (Aenderungsprotokoll lesen und schreiben). Beide Hooks nutzen Supabase Realtime — Aenderungen anderer User sind sofort sichtbar.
**Warum:** Custom Hooks kapseln die Datenbanklogik sauber und machen sie in allen Komponenten wiederverwendbar. Realtime-Subscriptions ersetzen das manuelle Polling und sorgen fuer sofortige Aktualisierung bei allen eingeloggten Nutzern.
**Dateien:** `src/hooks/useProjekte.js`, `src/hooks/useAuditLog.js`
**Status:** Abgeschlossen

---

## Schritt 5 – Auth-System mit Supabase Auth
**Was:** `useAuth` Hook mit Supabase Auth implementiert. Ersetzt die hardcodierten Username/Password-Paare aus der HTML durch echte Email/Passwort-Authentifizierung. Rollen (admin/editor/viewer) werden ueber Supabase User Metadata gesteuert. Hook liefert `user`, `role`, `displayName`, `canEdit` und `signIn`/`signOut` Funktionen.
**Warum:** Echte Authentifizierung statt Client-seitiger Passwort-Pruefung. Supabase Auth bietet sichere Session-Verwaltung, JWTs und nahtlose Integration mit Row Level Security. Rollen in User Metadata sind flexibel und ohne eigene Rollen-Tabelle nutzbar.
**Dateien:** `src/hooks/useAuth.js`
**Anleitung Benutzer anlegen:**
1. Supabase Dashboard → Authentication → Users → Add User
2. Email + Passwort setzen
3. User anklicken → Edit → Raw User Meta Data: `{ "role": "admin", "display_name": "Admin" }`
**Status:** Abgeschlossen
