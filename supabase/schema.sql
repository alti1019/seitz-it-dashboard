-- ============================================
-- IT-Dashboard Autohaus Seitz – Datenbankschema
-- Im Supabase SQL Editor ausfuehren
-- ============================================

-- Projekte-Tabelle
CREATE TABLE projekte (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prio TEXT,
  titel TEXT NOT NULL,
  projektnr TEXT,
  fertig INTEGER DEFAULT 0 CHECK (fertig >= 0 AND fertig <= 100),
  cluster TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit-Log Tabelle
CREATE TABLE audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ts TIMESTAMPTZ DEFAULT NOW(),
  username TEXT,
  action TEXT,
  projekt_titel TEXT,
  details TEXT
);

-- Row Level Security aktivieren
ALTER TABLE projekte ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Alle eingeloggten User duerfen lesen
CREATE POLICY "Eingeloggte User koennen lesen"
  ON projekte FOR SELECT TO authenticated USING (true);

-- Alle eingeloggten User duerfen schreiben
CREATE POLICY "Eingeloggte User koennen schreiben"
  ON projekte FOR ALL TO authenticated USING (true);

CREATE POLICY "Audit Log lesbar"
  ON audit_log FOR SELECT TO authenticated USING (true);

CREATE POLICY "Audit Log schreibbar"
  ON audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Trigger fuer updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON projekte
FOR EACH ROW EXECUTE FUNCTION update_updated_at();
