# Homepage JS Main-Thread Optimization Implementation Plan

> **Required sub-skill:** executing-plans

## Goal

Reduce initial route JavaScript and main-thread work on the public homepage by applying only the approved Phase 1 change (`optimizePackageImports`), then implementing Phase 2 (lazy/defer Work Experience client/WebGL code) and Phase 3 (server-first About skills data).

## Architecture

- Keep public data fetching on the server through cached Supabase helpers in `lib/supabase/public-data.ts`.
- Keep visual UI and animations intact, but move heavy client code behind viewport-gated Client Component boundaries.
- Convert `About` from browser Supabase fetching to server data fetching while keeping interactive animation code in a dedicated client component.
- Do not change the Devicon CDN/font-display path or `ScrollReveal` behavior in this pass because the approved Phase 1 scope is only `optimizePackageImports`.

## Tech Stack

- Next.js 16 App Router and React 19
- TypeScript
- Supabase public anon client for cached homepage reads
- `next/dynamic` for client-only lazy loading
- `IntersectionObserver` for near-viewport gating
- `pnpm` for verification

## Tasks

### 1. Add approved Phase 1 package import optimization

**Files:**

- `next.config.ts`

**Steps:**

- Add `experimental.optimizePackageImports`.
- Include `lucide-react` as the conservative approved package target.

**Verification:**

- Next.js config type-checks during `pnpm run build`.

### 2. Lazy-load Work Experience client boundary near viewport

**Files:**

- `app/(public)/components/experience.tsx`
- `app/(public)/components/lazy-experience-client.tsx` (new)
- `app/(public)/components/experience-client.tsx` (only if type export is needed)

**Steps:**

- Keep `Experience` as a Server Component that calls `getWorkExperiences()`.
- Create a client wrapper that waits until the section is near viewport, then dynamically imports `ExperienceClient` with `ssr: false`.
- Render a height-reserving placeholder before loading to limit layout shift.

**Verification:**

- Homepage still renders Work Experience and its See More/Show Less behavior after lazy load.
- `pnpm run build` passes.

### 3. Convert About to server-first skills data

**Files:**

- `lib/supabase/public-data.ts`
- `app/(public)/components/about.tsx`
- `app/(public)/components/about-client.tsx` (new)
- `app/(public)/components/lazy-home-client-sections.tsx`
- `app/(public)/page.tsx`

**Steps:**

- Add a cached `getVisibleSkills()` helper to `lib/supabase/public-data.ts`.
- Change `About` to a Server Component that fetches visible skills and groups them.
- Move the existing animated About UI into `AboutClient`, receiving grouped skills as props.
- Remove `About` from the client-only `LazyHomeClientSections` wrapper.
- Render `<About />` directly from the homepage after `<Hero />`, then keep lazy Certificates below it.

**Verification:**

- No browser-side Supabase client import remains in public `About`.
- Skills still display by frontend/backend/tools group.
- `pnpm run build` passes.

### 4. Update project documentation

**Files:**

- `docs/REACT_BITS.md`
- `docs/TECH_STACK.md`
- `docs/TODO.md`

**Steps:**

- Document `optimizePackageImports` for `lucide-react`.
- Document lazy Work Experience client/WebGL boundary.
- Document About server-first skills data and that Certificates remain lazy-loaded.

**Verification:**

- Documentation reflects the implemented architecture.

### 5. Full verification

**Commands:**

- `pnpm lint`
- `pnpm type-check`
- `pnpm run build`

**Expected result:**

- All commands pass, or any unrelated pre-existing warnings are clearly identified.
