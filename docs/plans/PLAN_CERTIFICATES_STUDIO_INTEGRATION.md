# 📜 Plan: Certificates Studio Integration (Data-Driven CMS)

> **Date:** 2026-09-06  
> **Status:** ✅ Implemented  
> **Type:** Feature (Data-Driven Architecture)

---

## 🎯 Objective

Transition the Certificates section from **hardcoded static data** to a **data-driven CMS pattern** managed via the `/studio` admin panel with Supabase persistence and ISR caching.

---

## 🏗️ Architecture & Changes

### 1. Database Layer (`migrations/migration-add-certificates-table.sql`)

Created `certificates` table in Supabase:
- `id` (UUID, primary key)
- `title` (TEXT, required)
- `provider` (TEXT, required — issuer name)
- `issue_date` (TEXT, optional — flexible format: "2024", "Jan 2024")
- `credential_id` (TEXT, optional)
- `credential_url` (TEXT, optional)
- `description` (TEXT, optional)
- `image` (TEXT, optional)
- `sort_order` (INTEGER, default 0)
- `created_at` / `updated_at` (TIMESTAMPTZ)
- RLS enabled: public read, authenticated insert/update/delete
- Pre-seeded with 3 existing Dicoding certificates

### 2. Type Layer
- `types/database.types.ts`: Added `certificates` table types (Row, Insert, Update)
- `types/certificate.ts`: Refactored to derive from `Database["public"]["Tables"]["certificates"]`
- `components/ui/certificate-card.tsx`: Updated field accessors (`issue_date`, `credential_url`)

### 3. Validation Layer (`lib/validations/certificate.ts`)
- Zod schema matching form requirements:
  - `title` (min 2, max 200) — required
  - `provider` (min 2, max 100) — required
  - All other fields optional
  - URL validations on `credential_url` and `image`

### 4. Data Access Layer
- `lib/supabase/helpers.ts`:
  - `insertCertificate`
  - `updateCertificate`
  - `deleteCertificate`
- `lib/supabase/public-data.ts`:
  - `getCertificates` (unstable_cache with 300s TTL and `homepage-certificates` tag)

### 5. Studio / Admin Panel
- **List Page** (`app/studio/certificates/page.tsx`):
  - Card grid view with search filter
  - Total and Provider stats
  - Delete with confirmation modal
  - Cache revalidation button
- **Create Page** (`app/studio/certificates/new/page.tsx`):
  - React Hook Form + Zod resolver
  - All fields with proper input types and error messages
- **Edit Page** (`app/studio/certificates/[id]/edit/page.tsx`):
  - Pre-filled form with current data
  - Update and delete capabilities
- **Sidebar** (`components/admin/sidebar.tsx`):
  - Added "Certificates" navigation item with `Award` icon
- **Dashboard** (`app/studio/page.tsx`):
  - Added certificates count to stats grid
  - Added "Add Certificate" quick action

### 6. Public Display Integration
- `app/(public)/_sections/certificates/index.tsx`: Converted to async Server Component fetching via `getCertificates()`
- `app/(public)/_sections/certificates/lazy-certificates-client.tsx`: Passes fetched certificates to client component
- `app/(public)/_sections/certificates/certificates-client.tsx`: Renders dynamic data passed via props

---

## 🔒 Security & RLS

- Row Level Security (RLS) is active on the `certificates` table
- Public users can only execute `SELECT`
- Only authenticated studio users can `INSERT`, `UPDATE`, `DELETE`

---

## 🔄 Cache Strategy

- Cached with Next.js `unstable_cache` (5-minute TTL)
- Tag: `homepage-certificates`
- On create/update/delete in studio: automatically calls `triggerRevalidate("homepage-certificates", "/")`
