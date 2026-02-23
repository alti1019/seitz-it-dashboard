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

---

## Schritt 6 – React Komponenten aus HTML extrahiert
**Was:** Alle UI-Komponenten aus der monolithischen HTML-Datei in separate React-Dateien extrahiert: Login (Email statt Username), ProjectRow (Inline-Edit), ProjectTable, ClusterView (Karten-Ansicht), AddProjectModal, AuditLogPanel, StatsBar, ProgressBar. Zusaetzlich constants.js mit PRIO_ORDER, PRIO_COLORS, getProgressColor und inputStyle.
**Warum:** Modulare Komponentenstruktur ermoeglicht bessere Wartbarkeit, Testbarkeit und Wiederverwendung. Jede Datei hat eine klare Verantwortung. Die Styles wurden 1:1 aus dem Original uebernommen fuer visuell identisches Ergebnis.
**Dateien:** `src/components/Login.jsx`, `src/components/ProjectRow.jsx`, `src/components/ProjectTable.jsx`, `src/components/ClusterView.jsx`, `src/components/AddProjectModal.jsx`, `src/components/AuditLogPanel.jsx`, `src/components/StatsBar.jsx`, `src/components/ProgressBar.jsx`, `src/lib/constants.js`
**Status:** Abgeschlossen

---

## Schritt 7 – Spalten-Sortierung implementiert
**Was:** ProjectTable um interaktive Spalten-Sortierung erweitert. SortableHeader-Komponente mit visuellen Indikatoren (↑ ↓ ↕). Sortierbar sind: Prioritaet (nach PRIO_ORDER), Titel (alphabetisch deutsch), Cluster (alphabetisch) und Fortschritt (numerisch). Klick auf Spalte wechselt Richtung, Klick auf andere Spalte setzt neue Sortierung.
**Warum:** Die Original-HTML hatte nur ein Dropdown-Menue fuer Sortierung. Klickbare Spaltenkoepfe sind intuitiver und entsprechen dem Standard fuer Tabellen-UIs. Die Sortierlogik ist im useMemo gekapselt fuer Performance.
**Dateien:** `src/components/ProjectTable.jsx` (erweitert)
**Status:** Abgeschlossen

---

## Schritt 8 – Next.js App Router Seiten integriert
**Was:** Hauptseite (`page.jsx`) mit allen Ansichten (Liste/Cluster/Logs), Filterleiste und Auth-Gate erstellt. Layout (`layout.jsx`) mit IBM Plex Sans + Mono Fonts via `next/font/google` (DSGVO-konform lokal gehostet). Alle CSS-Animationen und Hover-Effekte aus dem Original uebernommen. Supabase-Client auf Lazy-Initialisierung umgestellt (Proxy-Pattern), damit der Build ohne gesetzte Env-Vars durchlaeuft.
**Warum:** `next/font/google` laedt Fonts zur Build-Zeit herunter und liefert sie lokal aus — kein Google-Request im Browser. Die page.jsx verbindet alle Hooks und Komponenten zur vollstaendigen App. Lazy-Init des Supabase-Clients verhindert Build-Fehler bei fehlenden Env-Vars.
**Dateien:** `src/app/layout.jsx`, `src/app/page.jsx`, `src/lib/supabase.js` (angepasst), `src/app/globals.css` (minimiert)
**Status:** Abgeschlossen

---

## Schritt 9 – Vercel Deployment konfiguriert
**Was:** Projektname in package.json korrigiert. Keine `vercel.json` noetig — Next.js wird von Vercel nativ erkannt. Deployment-Schritte dokumentiert.
**Warum:** Vercel erkennt Next.js automatisch, konfiguriert Build-Command (`next build`) und Output-Verzeichnis (`.next`). Keinerlei manuelle Konfiguration erforderlich — Zero-Config Deployment.
**Deployment-Anleitung:**
1. GitHub-Repo erstellen: `gh repo create seitz-it-dashboard --private --source=.`
2. Code pushen: `git push -u origin master`
3. Vercel Dashboard → "Add New Project" → GitHub-Repo auswaehlen
4. Environment Variables setzen: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy klicken — fertig!
**Dateien:** `package.json` (Name korrigiert)
**Status:** Abgeschlossen

---

## Schritt 10 – Abschlussdokumentation
**Was:** ARCHITECTURE.md mit Gesamtarchitektur erstellt: Stack-Uebersicht, Datenbankstruktur, Projektstruktur, Datenfluss-Diagramm, Deployment-Pipeline, lokale Entwicklungsanleitung und Supabase-Setup-Guide. BUILD_LOG.md mit allen 10 Schritten vervollstaendigt.
**Warum:** Die Dokumentation dient dem IT-Team als Referenz zum Verstaendnis der Architektur. BUILD_LOG und Git-Verlauf dokumentieren den AI-gestuetzten Entwicklungsprozess fuer die Praesentation.
**Dateien:** `ARCHITECTURE.md` (neu), `BUILD_LOG.md` (finalisiert)
**Status:** Abgeschlossen

---

## Schritt 11 – Dashboard-Erweiterung: 4 neue Features
**Was:** Vier Erweiterungen in einem Schritt umgesetzt:
1. **Fortschritt-Filter als Toggle-Buttons** — `<select>` Dropdown durch farbige Toggle-Buttons ersetzt (gleiches Pattern wie Prio-Filter). Multi-Select mit Reset-Button.
2. **Bereich-Reiter (Gesamt/IT/Prozessmanagement)** — Neue Spalte `bereich` in der DB. Tab-Leiste unterhalb des Headers filtert Projekte nach Bereich. Badge am Projekttitel in der Gesamt-Ansicht. StatsBar reagiert ebenfalls auf Bereich-Filter.
3. **UserPicker statt Login** — Supabase Auth komplett entfernt. Neue `benutzer`-Tabelle mit 11 vordefinierten Namen. Einfacher Dropdown ohne Passwort, Name in localStorage. Option "Name hinzufuegen" fuer neue Eintraege. RLS-Policies auf `anon` erweitert.
4. **Start-/Enddatum pro Projekt** — Manuelles Startdatum (`started_at DATE`) und automatisches Enddatum (`ended_at TIMESTAMPTZ`). Enddatum wird gesetzt wenn Fortschritt auf 100% geht, und zurueckgesetzt bei <100%. Datum-Anzeige unterhalb des Projekttitels.

**Warum:** Die Erweiterungen machen das Dashboard praxistauglicher: Bereich-Trennung fuer IT vs. Prozessmanagement, schnellere Filter-UX, vereinfachte Nutzerauswahl ohne Passwort-Huerden, und Zeiterfassung fuer Projektlaufzeiten.
**Datenbank:** `supabase/migration-v2.sql` — 3 neue Spalten (`bereich`, `started_at`, `ended_at`), neue Tabelle `benutzer`, aktualisierte RLS-Policies.
**Neue Dateien:** `src/components/UserPicker.jsx`, `src/hooks/useBenutzer.js`, `supabase/migration-v2.sql`
**Geloeschte Dateien:** `src/components/Login.jsx`
**Geaenderte Dateien:** `src/app/page.jsx`, `src/components/AddProjectModal.jsx`, `src/components/ProjectRow.jsx`, `src/components/ProjectTable.jsx`, `src/hooks/useAuth.js`, `src/hooks/useProjekte.js`, `src/lib/constants.js`, `supabase/schema.sql`
**Status:** Abgeschlossen

---

## Zusammenfassung

| Schritt | Beschreibung | Commits |
|---------|-------------|---------|
| 1 | Next.js Projekt initialisiert | 2 |
| 2 | Supabase Schema + 100 Seed-Projekte | 1 |
| 3 | Supabase Client + Env-Variablen | 1 |
| 4 | CRUD-Hooks mit Realtime | 1 |
| 5 | Auth-System mit Rollen | 1 |
| 6 | 8 React-Komponenten + Constants | 1 |
| 7 | Spalten-Sortierung | 1 |
| 8 | Next.js Seiten + IBM Plex Fonts | 1 |
| 9 | Vercel Deployment | 1 |
| 10 | Architektur + Dokumentation | 1 |
| 11 | 4 neue Features (Filter, Bereiche, UserPicker, Datum) | 2 |

**Gesamt: 11 Schritte, 13 Commits, 2 Sessions mit Claude Code.**
