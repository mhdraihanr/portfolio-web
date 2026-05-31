# Mobile Scroll Reveal Once Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `ScrollReveal` animate only once on phone/mobile widths while preserving existing repeatable behavior on non-mobile widths.

**Architecture:** The shared `ScrollReveal` Client Component owns the behavior. It detects mobile with `window.matchMedia("(width <= 767px)")` through `useSyncExternalStore`, computes `shouldAnimateOnce = once || isMobile`, and stops observing after first mobile intersection.

**Tech Stack:** Next.js App Router, React Client Component hooks, TypeScript, `window.matchMedia`, `IntersectionObserver`.

---

### Task 1: Update shared ScrollReveal behavior

**Files:**

- Modify: `components/shared/scroll-reveal.tsx`

**Step 1: Add a mobile media query hook**

Add a small `useIsMobileWidth()` helper in the same file. It should:

- Initialize to `false` for SSR-safe rendering.
- Use `useSyncExternalStore` for the media query subscription.
- Create `window.matchMedia("(width <= 767px)")` inside the subscribe/getSnapshot callbacks.
- Listen to the `change` event with `addEventListener("change", handler)`.
- Remove the listener during cleanup.

**Step 2: Compute effective once behavior**

Inside `ScrollReveal`, call `useIsMobileWidth()` and compute:

```ts
const shouldAnimateOnce = once || isMobileWidth;
```

**Step 3: Preserve reduced-motion behavior**

Keep the existing `prefersReducedMotion` initialization and early return logic unchanged.

**Step 4: Update observer callback**

Change the observer callback so it still sets visibility from `entry.isIntersecting`, but uses `shouldAnimateOnce` when deciding to `unobserve(element)` after first intersection.

**Step 5: Update effect dependencies**

Include `shouldAnimateOnce` in the `useEffect` dependency list.

### Task 2: Update docs

**Files:**

- Modify: `docs/REACT_BITS.md`
- Modify: `docs/TECH_STACK.md`

**Step 1: Document mobile once behavior**

Add a short note that phone/mobile widths use one-shot `ScrollReveal` animations to reduce repeated observer-triggered animation work during scrolling.

**Step 2: Document desktop preservation**

Mention that desktop/non-mobile widths keep the existing repeatable behavior.

### Task 3: Verify

**Commands:**

- `pnpm lint`
- `pnpm type-check`
- `pnpm run build`

**Expected:**

- All commands pass.
- Existing middleware/proxy deprecation warning may still appear during build and is unrelated.
