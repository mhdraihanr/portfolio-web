-- Migration: Add skills table
-- Created: 2026-02-06
-- Description: Create skills table for portfolio skills management
-- Run this in Supabase SQL Editor

-- ============================================
-- SKILLS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'tools', 'others')),
    icon TEXT,            -- Devicon font class (e.g., "devicon-react-original colored")
    icon_svg TEXT,        -- SVG URL for icons not available in Devicon font
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_order ON public.skills(order_index);
CREATE INDEX IF NOT EXISTS idx_skills_visible ON public.skills(is_visible);

-- Add trigger for updated_at (reuses existing function from supabase-schema.sql)
DROP TRIGGER IF EXISTS update_skills_updated_at ON public.skills;
CREATE TRIGGER update_skills_updated_at
    BEFORE UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for displaying on homepage)
CREATE POLICY "Allow public read access on skills"
    ON public.skills
    FOR SELECT
    USING (true);

-- Allow authenticated users (admin) to insert
CREATE POLICY "Allow authenticated insert on skills"
    ON public.skills
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update on skills"
    ON public.skills
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated delete on skills"
    ON public.skills
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- SEED DATA (Optional)
-- ============================================
INSERT INTO public.skills (name, category, icon, icon_svg, order_index, is_visible) VALUES
    ('React', 'frontend', 'devicon-react-original colored', NULL, 1, true),
    ('Next.js', 'frontend', 'devicon-nextjs-plain colored', NULL, 2, true),
    ('TypeScript', 'frontend', 'devicon-typescript-plain colored', NULL, 3, true),
    ('Tailwind CSS', 'frontend', 'devicon-tailwindcss-original colored', NULL, 4, true),
    ('JavaScript', 'frontend', 'devicon-javascript-plain colored', NULL, 5, true),
    ('HTML5', 'frontend', 'devicon-html5-plain colored', NULL, 6, true),
    ('CSS3', 'frontend', 'devicon-css3-plain colored', NULL, 7, true),
    ('Node.js', 'backend', 'devicon-nodejs-plain colored', NULL, 1, true),
    ('Express', 'backend', NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg', 2, true),
    ('PostgreSQL', 'backend', 'devicon-postgresql-plain colored', NULL, 3, true),
    ('Supabase', 'backend', 'devicon-supabase-plain colored', NULL, 4, true),
    ('REST API', 'backend', 'devicon-fastapi-plain colored', NULL, 5, true),
    ('GraphQL', 'backend', 'devicon-graphql-plain colored', NULL, 6, true),
    ('Git', 'tools', 'devicon-git-plain colored', NULL, 1, true),
    ('Docker', 'tools', 'devicon-docker-plain colored', NULL, 2, true),
    ('VS Code', 'tools', 'devicon-vscode-plain colored', NULL, 3, true),
    ('Vercel', 'tools', NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg', 4, true),
    ('GitHub', 'tools', NULL, 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', 5, true),
    ('npm', 'tools', 'devicon-npm-original-wordmark colored', NULL, 6, true)
ON CONFLICT DO NOTHING;
