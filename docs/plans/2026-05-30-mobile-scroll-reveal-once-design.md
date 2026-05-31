# Mobile Scroll Reveal Once Design

## Goal

On phone/mobile widths, `ScrollReveal` should animate only once when it first enters the viewport. On non-mobile widths, existing repeatable scroll reveal behavior must remain unchanged.

## Current State

`components/shared/scroll-reveal.tsx` defaults `once` to `false`, so elements hide again when they leave the viewport and replay when they re-enter. This behavior applies across homepage sections and the projects page because most usages do not pass `once`.

## Chosen Approach

Update the shared `ScrollReveal` component only:

- Detect mobile with `window.matchMedia("(width <= 767px)")`, matching the Tailwind `md` breakpoint boundary.
- Subscribe to that media query with `useSyncExternalStore` so React lint rules are satisfied and the value stays current when the viewport changes.
- Compute effective once behavior as `once || isMobile`.
- Keep existing prop behavior on desktop/tablet widths above 767px.
- On mobile, stop observing after first intersection so animations do not replay during normal phone scrolling.
- Preserve `prefers-reduced-motion` behavior.

## Trade-offs

- This is the smallest consistent change because all current and future `ScrollReveal` usage inherits the mobile behavior.
- It avoids editing each homepage section individually.
- It introduces one media-query subscription inside the shared client component, but avoids layout-specific coupling in section components.

## Verification

- Run lint, type-check, and production build.
- Optionally test browser behavior at mobile width and desktop width:
  - Mobile: reveal once, then stay visible after scrolling away/back.
  - Desktop: reveal repeats as before unless `once` is explicitly true.
