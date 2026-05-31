# Mobile Runtime Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce mobile homepage main-thread work, forced reflow, and below-the-fold animation cost while preserving the animated hero `BlurText` path.

**Architecture:** Keep the hero mobile title animation intact, but simplify or remove non-essential runtime-heavy decorative behavior on phone/mobile widths. Shared mobile behavior is centralized in reusable components so future public sections inherit the lower-cost mobile path automatically.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS, React Bits `LogoLoop`, React Bits `Orb`, shared `ScrollReveal`, Chrome DevTools mobile trace verification.

---

### Task 1: Disable `ScrollReveal` animation styles on mobile

**Files:**

- Modify: `components/shared/scroll-reveal.tsx`

**Steps:**

1. Keep desktop/non-mobile `ScrollReveal` behavior unchanged.
2. Detect phone/mobile width with the existing `useMobileWidth` hook.
3. Treat mobile widths the same as reduced-motion mode for reveal styling.
4. Render children immediately visible on mobile instead of applying `opacity`, `transform`, and transition styles.
5. Keep the observer-based animation path only for non-mobile widths.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 2: Replace mobile certificate loop with static rendering

**Files:**

- Modify: `app/(public)/components/certificates.tsx`

**Steps:**

1. Keep the existing `LogoLoop` experience on non-mobile widths.
2. Detect phone/mobile width with `useMobileWidth`.
3. On mobile, render the certificate cards as a simple responsive grid instead of mounting the animated loop.
4. Update the helper note text so mobile users get tap-oriented wording instead of hover-oriented wording.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 3: Skip decorative `Orb` background on mobile experience section

**Files:**

- Modify: `app/(public)/components/experience-client.tsx`

**Steps:**

1. Keep the current desktop/non-mobile `Orb` background behavior.
2. Detect phone/mobile width with `useMobileWidth`.
3. Prevent `Orb` from mounting on mobile so the section keeps its content and layout without the extra WebGL/runtime overhead.

**Verification:**

- Run `pnpm lint`.
- Run `pnpm type-check`.

### Task 4: Re-measure in Chrome DevTools mobile emulation

**Tools / Workflow:**

- Chrome DevTools performance trace
- Mobile emulation: `390x844`, Fast 4G, 4x CPU slowdown, iPhone Safari-like user agent

**Steps:**

1. Run the homepage locally.
2. Capture a fresh Chrome DevTools mobile trace on the real homepage.
3. Compare forced reflow and remaining bottlenecks against the previous trace.
4. Record the remaining render-blocking and third-party findings.

**Measured result from this implementation pass:**

- `CLS`: `0.00`
- Forced reflow reduced to roughly `162 ms`
- Remaining render-blocking requests narrowed to two internal Next.js CSS assets
- Largest remaining third-party transfer remained Devicon SVG traffic from JSDelivr

### Task 5: Update documentation

**Files:**

- Modify: `docs/REACT_BITS.md`
- Modify: `docs/STATUS.md`

**Steps:**

1. Document the new mobile runtime simplification strategy.
2. Record the Chrome DevTools mobile measurement outcome.
3. Note the remaining recommended targets: internal CSS render-blocking, hero font/CSS cost, and public Devicon CDN traffic.

**Verification:**

- Confirm docs reflect the implemented mobile performance architecture.

### Task 6: Full verification

**Commands:**

- `pnpm lint`
- `pnpm type-check`
- `pnpm build`

**Expected result:**

- All commands pass after the runtime simplification changes.
- Mobile Chrome DevTools trace confirms reduced layout/runtime pressure without removing the hero `BlurText` animation.
