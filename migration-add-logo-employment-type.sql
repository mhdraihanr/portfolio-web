-- Migration: Add logo_url and employment_type to work_experience table
-- Date: 2024-02-05
-- Description: Adds company logo URL and employment type fields to work experience

-- Add logo_url column
ALTER TABLE work_experience
ADD COLUMN logo_url TEXT;

-- Add employment_type column
ALTER TABLE work_experience
ADD COLUMN employment_type TEXT;

-- Add check constraint for employment_type (optional but recommended)
ALTER TABLE work_experience
ADD CONSTRAINT employment_type_check 
CHECK (
  employment_type IS NULL OR 
  employment_type IN ('Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Organization')
);

-- Add comment to columns for documentation
COMMENT ON COLUMN work_experience.logo_url IS 'URL to company logo image';
COMMENT ON COLUMN work_experience.employment_type IS 'Type of employment: Full-time, Part-time, Internship, Freelance, Contract, or Organization';
