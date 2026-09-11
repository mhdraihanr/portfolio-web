-- Migration: Add images array to work_experience table
-- Supports up to 2 images per experience (e.g. office photo + certificate)
-- Same pattern as projects.images (see migration-add-images-to-projects.sql)

ALTER TABLE public.work_experience
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_work_experience_images ON public.work_experience USING GIN (images);

COMMENT ON COLUMN public.work_experience.images IS 'Array of image URLs for the experience (JSONB array of strings, max 2)';
