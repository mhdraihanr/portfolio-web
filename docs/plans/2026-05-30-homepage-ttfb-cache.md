# Homepage TTFB Cache Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce homepage document latency / TTFB by caching public Supabase data used by the homepage sections.

**Architecture:** Move public `projects` and `work_experience` Supabase queries into a shared server-only helper that does not read request cookies. Wrap these third-party database queries with Next.js cross-request cache/revalidation and consume the cached helpers from the homepage server components.

**Tech Stack:** Next.js 16 App Router, React Server Components, Supabase JS, `next/cache`, TypeScript.

---

### Task 1: Add cached public data helper

**Files:**

- Create: `lib/supabase/public-data.ts`

**Steps:**

1. Import `unstable_cache` from `next/cache`, `createClient` from `@supabase/supabase-js`, and public types.
2. Create a Supabase anon client without `cookies()` because this data is public.
3. Export `HOMEPAGE_PUBLIC_DATA_REVALIDATE_SECONDS = 300`.
4. Export `getFeaturedProjects()` cached with key `homepage-featured-projects`, tag `homepage-projects`, and `revalidate: 300`.
5. Export `getWorkExperiences()` cached with key `homepage-work-experiences`, tag `homepage-experience`, and `revalidate: 300`.
6. Return an empty array and log errors on Supabase failures, preserving current UI behavior.

### Task 2: Refactor homepage data components

**Files:**

- Modify: `app/(public)/components/projects.tsx`
- Modify: `app/(public)/components/experience.tsx`

**Steps:**

1. Remove inline `createServerClient` and `cookies()` usage from both files.
2. Import cached helpers from `@/lib/supabase/public-data`.
3. Keep existing JSX/UI unchanged.
4. Keep `Projects` and `Experience` as Server Components.

### Task 3: Update performance docs

**Files:**

- Modify: `docs/TECH_STACK.md`
- Modify: `docs/REACT_BITS.md`
- Modify: `docs/TODO.md`

**Steps:**

1. Document Priority 4B homepage TTFB optimization.
2. State that public Supabase homepage data is cached/revalidated and no longer reads cookies on the homepage request path.
3. Keep prior Hero/LightRays notes intact.

### Task 4: Verify

**Commands:**

1. `pnpm lint`
2. `pnpm type-check`
3. `pnpm run build`
4. `pnpm start`
5. `curl -o NUL -s -w "ttfb=%{time_starttransfer}s total=%{time_total}s size=%{size_download} bytes\\n" http://localhost:3000/`
6. Chrome DevTools/Lighthouse recheck if server is stable.

**Expected:**

- Lint, type-check, and build pass.
- Homepage no longer uses `cookies()` for public Projects/Experience queries.
- Warm TTFB improves because public data can be reused from cache.
