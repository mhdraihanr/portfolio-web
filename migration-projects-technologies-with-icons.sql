-- Migration: Add icon support to project technologies
-- Created: 2026-02-07
-- Description: Transform technologies from TEXT[] to JSONB with icon support
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Create temporary column
-- ============================================
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS technologies_new JSONB;

-- ============================================
-- STEP 2: Transform existing data
-- ============================================
-- Convert TEXT[] to JSONB array of objects with name, icon, icon_svg
UPDATE public.projects
SET technologies_new = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', tech_name,
      'icon', NULL,
      'icon_svg', NULL
    )
  )
  FROM unnest(technologies) AS tech_name
)
WHERE technologies IS NOT NULL AND array_length(technologies, 1) > 0;

-- Handle empty arrays
UPDATE public.projects
SET technologies_new = '[]'::jsonb
WHERE technologies IS NOT NULL AND array_length(technologies, 1) IS NULL;

-- ============================================
-- STEP 3: Drop old column and rename new one
-- ============================================
ALTER TABLE public.projects
DROP COLUMN technologies;

ALTER TABLE public.projects
RENAME COLUMN technologies_new TO technologies;

-- ============================================
-- STEP 4: Add NOT NULL constraint and default
-- ============================================
ALTER TABLE public.projects
ALTER COLUMN technologies SET DEFAULT '[]'::jsonb;

ALTER TABLE public.projects
ALTER COLUMN technologies SET NOT NULL;

-- ============================================
-- STEP 5: Add index for better query performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_technologies_gin
ON public.projects USING GIN (technologies);

-- ============================================
-- VERIFICATION QUERY (Run separately to check)
-- ============================================
-- SELECT id, title, technologies FROM public.projects LIMIT 5;

-- ============================================
-- ROLLBACK (if needed - backup first!)
-- ============================================
-- This migration is destructive. Make sure to backup your data before running.
-- To rollback, you'll need to restore from backup.

-- ============================================
-- NOTES
-- ============================================
-- After running this migration:
-- 1. Test that existing projects display correctly
-- 2. Old technologies will show without icons (icon=null)
-- 3. New technologies can be added with icons via admin panel
-- 4. Structure: [{"name":"React","icon":"devicon-react-original colored","icon_svg":"https://..."}]
