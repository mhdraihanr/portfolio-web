-- Migration: Add role and what_i_did columns to projects table
-- Date: 2026-09-08
-- Description: Adds optional role and what_i_did columns so the project detail
--              page can show "My Role" and a "What I Did" bullet list.
--              what_i_did stores one bullet point per line (newline-separated);
--              the detail page renders each non-empty line as a bullet.
--              Both columns are optional; projects without them render as before.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS what_i_did TEXT;

-- Optional verification query:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position;
