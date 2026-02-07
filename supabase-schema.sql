-- Portfolio Website Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    impact TEXT NOT NULL,
    technologies JSONB NOT NULL DEFAULT '[]',
    image_url TEXT,
    project_url TEXT,
    github_url TEXT,
    featured BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON public.projects(order_index);

-- ============================================
-- WORK EXPERIENCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.work_experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_experience_order ON public.work_experience(order_index);
CREATE INDEX IF NOT EXISTS idx_experience_current ON public.work_experience(is_current);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for work_experience table
DROP TRIGGER IF EXISTS update_experience_updated_at ON public.work_experience;
CREATE TRIGGER update_experience_updated_at
    BEFORE UPDATE ON public.work_experience
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

-- Projects policies
-- Allow public read access
CREATE POLICY "Allow public read access on projects"
    ON public.projects
    FOR SELECT
    USING (true);

-- Allow authenticated users (admin) to insert
CREATE POLICY "Allow authenticated insert on projects"
    ON public.projects
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update on projects"
    ON public.projects
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated delete on projects"
    ON public.projects
    FOR DELETE
    TO authenticated
    USING (true);

-- Work Experience policies
-- Allow public read access
CREATE POLICY "Allow public read access on work_experience"
    ON public.work_experience
    FOR SELECT
    USING (true);

-- Allow authenticated users (admin) to insert
CREATE POLICY "Allow authenticated insert on work_experience"
    ON public.work_experience
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated update on work_experience"
    ON public.work_experience
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users (admin) to delete
CREATE POLICY "Allow authenticated delete on work_experience"
    ON public.work_experience
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Insert sample project
INSERT INTO public.projects (
    title,
    slug,
    description,
    problem,
    solution,
    impact,
    technologies,
    featured,
    order_index
) VALUES (
    'Employee Management System',
    'employee-management-system',
    'Platform terpusat untuk mengelola data karyawan, pengajuan cuti, lembur, dan approval.',
    'Proses cuti, lembur, dan data karyawan masih tersebar di form kertas dan file terpisah. HR dan leader sering harus bolak-balik chat hanya untuk konfirmasi satu pengajuan.',
    'Membangun platform terpusat berisi data karyawan, pengajuan cuti, lembur, dan riwayat approval yang bisa diakses HR dan leader dari satu dashboard.',
    'Proses approval jadi lebih terstruktur, mudah ditelusuri, dan mengurangi ketergantungan pada form fisik dan chat yang tercecer.',
    ARRAY['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind CSS'],
    true,
    1
) ON CONFLICT (slug) DO NOTHING;

-- Insert sample work experience
INSERT INTO public.work_experience (
    company,
    position,
    description,
    start_date,
    end_date,
    is_current,
    order_index
) VALUES (
    'PT. Manufacturing Company',
    'Fullstack Web Developer',
    'Membangun dan maintain internal tools untuk HR, QC, dan operations. Fokus pada employee management system, QC dashboards, dan automation tools.',
    '2023-01-01',
    NULL,
    true,
    1
) ON CONFLICT DO NOTHING;

-- ============================================
-- STORAGE BUCKET (for project images)
-- ============================================

-- Create storage bucket for project images
-- Note: Run this in Supabase Dashboard > Storage
-- Or use Supabase CLI/API

-- Bucket name: project-images
-- Public: true (for public access to images)

-- Storage policies will be:
-- 1. Allow public read access
-- 2. Allow authenticated users to upload
-- 3. Allow authenticated users to delete their uploads

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- Get all featured projects ordered by order_index
-- SELECT * FROM projects WHERE featured = true ORDER BY order_index ASC;

-- Get all current work experience
-- SELECT * FROM work_experience WHERE is_current = true ORDER BY start_date DESC;

-- Get all work experience ordered by most recent
-- SELECT * FROM work_experience ORDER BY start_date DESC;

-- Count total projects
-- SELECT COUNT(*) FROM projects;

-- Get projects by technology
-- SELECT * FROM projects WHERE 'Next.js' = ANY(technologies);
