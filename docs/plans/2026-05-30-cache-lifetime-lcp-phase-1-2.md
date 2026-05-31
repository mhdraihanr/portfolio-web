# Cache Lifetime and LCP Phase 1-2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve Lighthouse cache lifetime and LCP-related resource priority without changing the homepage visual design.

**Architecture:** Phase 1 adds explicit cache headers for safe static assets served from `public`, while keeping Next.js generated hashed assets untouched. Phase 2 lowers the priority of the About profile image so non-hero imagery does not compete with the LCP path. A separate future plan covers admin-managed profile image replacement so long-lived caching stays safe through versioned file URLs.

**Tech Stack:** Next.js App Router, TypeScript, `next/image`, `next.config.ts` headers, project Markdown docs.

---

## Current Findings

- Files served directly from `public` currently use `Cache-Control: public, max-age=0`.
- Next.js hashed assets under `/_next/static/*` already use `Cache-Control: public, max-age=31536000, immutable`.
- `next/font/local` emits hashed font assets under `/_next/static/media/*`, which already receive immutable cache headers.
- The optimized About profile image is generated through `/_next/image`, but its source `/profile.jpg` is also publicly reachable with `max-age=0`.
- The About profile image currently uses `priority`, even though it appears below the hero and is not the LCP target on the homepage.

---

## Task 1: Add Public Static Asset Cache Headers

**Files:**

- Modify: `next.config.ts`

**Steps:**

1. Keep the existing global security header rule unchanged.
2. Add dedicated header rules before or alongside the catch-all security rule for:
   - `/fonts/:path*`
   - `/profile.jpg`
   - `/:path*.svg`
3. Apply `Cache-Control: public, max-age=31536000, immutable` to those static assets.
4. Keep HTML/page responses unchanged so server rendering and Supabase revalidation behavior are unaffected.

**Validation:**

- Run `pnpm lint`.
- Run `pnpm type-check`.
- Run `pnpm run build`.
- Check headers with:
  - `curl -I http://localhost:3000/profile.jpg`
  - `curl -I http://localhost:3000/fonts/fonnts.com-DelargoDTCond-Bold.otf`

**Expected:** public assets return a long-lived immutable `Cache-Control`, while `/_next/static/*` remains unchanged.

---

## Task 2: Lower About Profile Image Priority

**Files:**

- Modify: `app/(public)/components/about-client.tsx`

**Steps:**

1. Remove the `priority` prop from the About profile `Image`.
2. Add an explicit responsive `sizes` prop that matches the rendered layout.
3. Preserve the current dimensions, styling, alt text, and visual output.

**Validation:**

- Run `pnpm lint`.
- Run `pnpm type-check`.
- Run `pnpm run build`.
- Load homepage on mobile and desktop to ensure the About profile still displays correctly.

---

## Task 3: Update Performance Documentation

**Files:**

- Modify: `docs/REACT_BITS.md`
- Modify: `docs/TECH_STACK.md`
- Create or update: `docs/plans/2026-05-30-admin-profile-image-cache-plan.md`

**Steps:**

1. Document that public static assets now receive efficient long-lived cache headers.
2. Document that About profile image priority was lowered to protect the hero/LCP path.
3. Create an admin profile image cache plan that explains future support for replacing the profile photo via admin without stale-browser-cache risk.

---

## Future Plan: Admin-Managed Profile Image Replacement

**Goal:** Let admin replace the public profile photo safely while keeping efficient cache lifetimes.

**Recommended design:**

1. Store profile image metadata in a database-backed site settings table, not as a fixed `/profile.jpg` path.
2. Upload replacement images through the existing ImageKit flow or a dedicated profile image uploader.
3. Save a versioned URL, for example an ImageKit URL or `/profile/profile-v<timestamp>.jpg`.
4. Render the profile image from that versioned URL in About.
5. Keep long-lived immutable caching safe because each image update changes the URL.

**Why not overwrite `/profile.jpg`:** immutable browser caching can keep stale copies until cache expiry. Versioned URLs avoid that issue.

---
