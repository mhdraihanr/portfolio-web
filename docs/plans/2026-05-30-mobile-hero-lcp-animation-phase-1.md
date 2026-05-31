# Mobile Hero LCP Animation Phase 1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve mobile LCP while keeping the mobile `BlurText` animation and avoiding early title rendering.

**Architecture:** Keep `Hero` as the current client component for this phase. Optimize the client scheduling path by making mobile animation readiness faster, making the global loader non-blocking on mobile, and reducing mobile-only `BlurText` animation cost while preserving desktop behavior.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, `motion/react`, local `next/font`.

---

### Task 1: Add responsive animation tuning to `BlurText`

**Files:**

- Modify: `components/BlurText.tsx`

**Steps:**

1. Use the existing mobile width detection already available in `BlurText`.
2. Add mobile-only effective values for `delay`, blur amount, vertical offset, and transition duration.
3. Keep desktop defaults unchanged.
4. Preserve mobile one-shot reveal behavior.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 2: Optimize hero readiness scheduling

**Files:**

- Modify: `app/(public)/components/hero.tsx`

**Steps:**

1. Import `useMobileWidth`.
2. On mobile, reduce the `animationsReady` scheduling delay so `BlurText` starts earlier, but still after client mount/paint.
3. On mobile, defer `LightRays` longer than desktop to reduce main-thread contention.
4. Keep desktop visual behavior as close as possible to the current implementation.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 3: Prevent mobile loader from blocking LCP

**Files:**

- Modify: `app/(public)/layout.tsx`

**Steps:**

1. Use the existing `useMobileWidth` hook.
2. Do not render the full-screen `GlobalLoader` on mobile.
3. Keep desktop loader behavior unchanged.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 4: Update documentation

**Files:**

- Modify: `docs/TODO.md`
- Modify: `docs/REACT_BITS.md`

**Steps:**

1. Document that mobile LCP Phase 1 keeps `BlurText` but reduces mobile animation cost.
2. Document that mobile `GlobalLoader` is non-blocking for LCP.

**Verification:**

- Run `pnpm run build`.
