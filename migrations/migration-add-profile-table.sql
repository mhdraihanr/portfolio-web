-- Migration: Add profile table
-- Date: 2026-09-07
-- Description: Single-row table for editable site-wide profile settings (photo, CV link, name, tagline, about text). Seeded with the currently hardcoded values from hero/about sections.

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  full_name TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  hero_title TEXT NOT NULL DEFAULT '',
  hero_tagline TEXT NOT NULL DEFAULT '',
  about_text TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  cv_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT profile_single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Public read access (same pattern as other tables)
CREATE POLICY "Allow public read access on profile"
  ON profile FOR SELECT
  USING (true);

-- Authenticated users can update the profile row
CREATE POLICY "Allow authenticated update on profile"
  ON profile FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update updated_at trigger (reuse existing function if available)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed with existing hardcoded data from hero/about sections
INSERT INTO profile (id, full_name, tagline, hero_title, hero_tagline, about_text, photo_url, cv_url)
VALUES (
  1,
  'Muhammad Raihan Rafliansyah',
  'Fullstack Developer',
  'Fullstack Developer turning ideas into working products.',
  'I''m a Fullstack Developer passionate about building web applications that are fast, responsive and easy to use. From designing interfaces to structuring backend systems, focus on writing clean code and using modern tools to bring ideas to life.',
  'Passionate Fullstack Developer dedicated to building beautiful, functional, and user-friendly web applications. By bridging the gap between frontend and backend technologies, I transform complex ideas into reality through clean code and modern design principles.',
  '/profile.jpg',
  'https://drive.google.com/file/d/1VXDuHuFYlxPYEE_akyG5me4bSjPm9GQS/view?usp=sharing'
)
ON CONFLICT (id) DO NOTHING;
