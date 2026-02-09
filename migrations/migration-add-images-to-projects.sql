-- Migration: Add images array to projects table
-- This adds support for multiple images per project (stored as JSONB array)
-- The old image_url field is kept for backward compatibility

-- Add images column as JSONB array
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Create index for better query performance on images
CREATE INDEX IF NOT EXISTS idx_projects_images ON public.projects USING GIN (images);

-- Optional: Migrate existing image_url to images array
-- Uncomment if you want to move existing image_url into images array
-- UPDATE public.projects 
-- SET images = jsonb_build_array(image_url)
-- WHERE image_url IS NOT NULL AND image_url != '' AND images = '[]'::jsonb;

-- Comments
COMMENT ON COLUMN public.projects.images IS 'Array of image URLs for the project (JSONB array of strings)';
COMMENT ON COLUMN public.projects.image_url IS 'Legacy single image URL field (kept for backward compatibility)';
