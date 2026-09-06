-- Migration: Add certificates table
-- Date: 2026-09-06
-- Description: Create certificates table for managing professional certificates via studio

CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  provider TEXT NOT NULL,
  issue_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  description TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public read access (same pattern as other tables)
CREATE POLICY "Allow public read access on certificates"
  ON certificates FOR SELECT
  USING (true);

-- Authenticated users can manage certificates
CREATE POLICY "Allow authenticated insert on certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at trigger (reuse existing function if available)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed with existing hardcoded data
INSERT INTO certificates (title, provider, issue_date, credential_url, description, sort_order) VALUES
  ('Belajar Dasar Structured Query Language (SQL)', 'Dicoding Academy', '2024', 'https://www.dicoding.com/certificates/QLZ9VY6OMX5D', 'Pembelajaran terkait dasar-dasar SQL untuk manajemen basis data', 0),
  ('Belajar Dasar Pemrograman JavaScript', 'Dicoding Academy', '2024', 'https://www.dicoding.com/certificates/53XEYO66RPRN', 'Pembelajaran terkait dasar-dasar menggunakan JavaScript', 1),
  ('Cloud Practitioner Essentials', 'Dicoding Academy', '2023', 'https://www.dicoding.com/certificates/QLZ9QW792Z5D', 'Pembelajaran terkait dasar komputasi awan dan layanan AWS', 2);
