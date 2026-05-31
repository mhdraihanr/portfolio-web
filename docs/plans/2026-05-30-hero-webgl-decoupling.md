# Hero WebGL Decoupling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve homepage LCP, Speed Index, Total Blocking Time, and main-thread work by allowing hero text/BlurText to start before the decorative WebGL background is ready.

**Architecture:** Decouple hero animation readiness from `LightRays` readiness. The hero text becomes the page-readiness signal after initial paint, while `LightRays` still lazy-loads after paint and fades in when its first WebGL frame is ready.

**Tech Stack:** Next.js 16 App Router, React 19 Client Components, local `BlurText`, React Bits/OGL `LightRays`, Tailwind CSS 4.

---

### Task 1: Update Hero Readiness Flow

**Files:**

- Modify: `app/(public)/components/hero.tsx`

**Steps:**

1. Keep `BlurText` usage unchanged.
2. Add a new `lightRaysReady` state for background opacity only.
3. Change initial hero readiness so `animationsReady` and `setPageReady()` happen after the browser has painted the static hero, not after WebGL readiness.
4. Keep delayed `showLightRays` mounting after initial paint.
5. Change `handleBackgroundReady` so it only sets `lightRaysReady` and does not control the loader or text animations.
6. Wrap the LightRays layer with a Tailwind opacity transition so WebGL fades in smoothly.

**Expected behavior:**

- Hero text and `BlurText` start earlier.
- Global loader is released by hero text readiness.
- `LightRays` can appear slightly after text but fades in smoothly.

### Task 2: Update Performance Documentation

**Files:**

- Modify: `docs/REACT_BITS.md`
- Modify: `docs/TECH_STACK.md`
- Modify: `docs/TODO.md`

**Steps:**

1. Update React Bits performance notes to document Priority 3 / Approach A.
2. Update tech stack performance strategy to say `LightRays` no longer blocks page readiness.
3. Update TODO hero checklist to include WebGL/text readiness decoupling.

### Task 3: Verification

**Commands:**

1. Run `pnpm lint`
   - Expected: exit code 0.
2. Run `pnpm type-check`
   - Expected: exit code 0.
3. Run `pnpm run build`
   - Expected: exit code 0, except existing Next.js middleware/proxy deprecation warning.

### Task 4: Optional Lighthouse Follow-up

**Commands:**

1. Start production server with `pnpm start` after a successful build.
2. Run Lighthouse against the production server.
3. Compare LCP, Speed Index, TBT, and main-thread work with `lighthouse-current.json`.

**Note:** Avoid auditing `pnpm dev` because devtools/dev chunks can contaminate JavaScript execution diagnostics.
