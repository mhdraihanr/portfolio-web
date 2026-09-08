-- Migration: Add hero_greeting to profile table
-- Date: 2026-09-08
-- Description: Adds an optional hero_greeting column to the profile table so the
--              full "Hello, I'm Muhammad" hero greeting line (including the
--              "Hello" word) is editable from /studio. When empty, the hero
--              falls back to the legacy "Hello, I'm {first name of full_name}".

-- Step 1: Add the column (nullable, optional)
ALTER TABLE profile
  ADD COLUMN IF NOT EXISTS hero_greeting TEXT;

-- Step 2: Seed current value so existing deploy keeps showing the same greeting.
--         (id = 1 guaranteed single row by CHECK constraint)
UPDATE profile
SET hero_greeting = 'Hello, I''m Muhammad'
WHERE id = 1 AND (hero_greeting IS NULL OR hero_greeting = '');
