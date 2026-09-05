-- ==============================================================================
-- Migration: Drop problem, solution, and impact columns from projects table
-- Purpose: Simplify project model and admin form by removing unused case study fields
-- ==============================================================================

ALTER TABLE public.projects 
DROP COLUMN IF EXISTS problem,
DROP COLUMN IF EXISTS solution,
DROP COLUMN IF EXISTS impact;

-- Optional verification query:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'projects';
