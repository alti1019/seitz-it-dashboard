-- ============================================
-- Migration v2: Bereich, Datum, Benutzer-Tabelle
-- Im Supabase SQL Editor ausfuehren
-- ============================================

-- 1. Neue Spalte "bereich" fuer Projekte (IT vs. Prozessmanagement)
ALTER TABLE projekte ADD COLUMN IF NOT EXISTS bereich TEXT DEFAULT 'IT';

-- 2. Start-/Enddatum fuer Projekte
ALTER TABLE projekte ADD COLUMN IF NOT EXISTS started_at DATE;
ALTER TABLE projekte ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

-- 3. Benutzer-Tabelle (ersetzt Supabase Auth)
CREATE TABLE IF NOT EXISTS benutzer (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Seed-Daten: Initiale Benutzernamen
INSERT INTO benutzer (name) VALUES
  ('Tim'),
  ('Sven'),
  ('Ronny'),
  ('Micha'),
  ('Dogukan'),
  ('Azad'),
  ('Benni'),
  ('Christopher Z.'),
  ('Chris G.'),
  ('Max'),
  ('Manu')
ON CONFLICT (name) DO NOTHING;

-- 5. RLS fuer Benutzer-Tabelle
ALTER TABLE benutzer ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Benutzer lesbar"
  ON benutzer FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Benutzer hinzufuegbar"
  ON benutzer FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 6. Bestehende RLS-Policies anpassen: anon + authenticated
-- Alte Policies entfernen und neu erstellen
DROP POLICY IF EXISTS "Eingeloggte User koennen lesen" ON projekte;
DROP POLICY IF EXISTS "Eingeloggte User koennen schreiben" ON projekte;
DROP POLICY IF EXISTS "Audit Log lesbar" ON audit_log;
DROP POLICY IF EXISTS "Audit Log schreibbar" ON audit_log;

CREATE POLICY "Alle User koennen lesen"
  ON projekte FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Alle User koennen schreiben"
  ON projekte FOR ALL TO anon, authenticated USING (true);

CREATE POLICY "Audit Log lesbar"
  ON audit_log FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Audit Log schreibbar"
  ON audit_log FOR INSERT TO anon, authenticated WITH CHECK (true);
