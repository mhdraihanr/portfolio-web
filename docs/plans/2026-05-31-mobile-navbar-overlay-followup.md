# Mobile Navbar Overlay Follow-up Summary

## Issue

After the initial mobile navbar overlay update, three regressions remained on mobile:

1. The base navbar shell still appeared centered instead of sitting on the right edge.
2. The original navbar remained visible when the full-screen overlay opened.
3. Tapping same-page section links in the mobile overlay did not reliably scroll to the target section.

A later visual inconsistency was also addressed:

4. In light mode, the full-screen mobile overlay still used a dark-only visual treatment instead of following the active theme.

## Root Cause

### 1. Mobile navbar position

The navbar shell in `components/shared/navbar.tsx` still used centered positioning utilities (`left-1/2` and `-translate-x-1/2`) as its default layout, so the mobile bar itself remained centered even though the inner mobile controls were right-aligned.

### 2. Overlay layering

The full-screen mobile overlay rendered below the base navbar layer, so the original mobile navbar stayed visible above the overlay instead of being visually replaced.

### 3. Hash scrolling while closing the drawer

The mobile menu used fixed-body scroll locking. On same-page hash clicks, the code closed the drawer and immediately called `scrollIntoView()`, but the drawer cleanup then restored the previous scroll position with `window.scrollTo(0, savedScrollY)`. That restoration could override the target section scroll.

This matches common mobile drawer behavior documented in external references: scroll lock cleanup must complete before same-page hash scrolling runs.

### 4. Overlay theme styling

The mobile overlay panel and backdrop in `components/shared/navbar.tsx` were hardcoded to dark-only classes such as `bg-slate-950/70`, `bg-slate-950/95`, and `text-white`, so the overlay did not visually adapt when the active theme was light.

## Fix

- Move the mobile navbar shell to the right with mobile-first positioning, while preserving the centered desktop layout.
- Hide the base mobile navbar while the full-screen overlay is open.
- Raise the overlay layer so it fully replaces the mobile navbar visually.
- Queue same-page hash navigation during overlay close and execute the smooth scroll only after the drawer scroll lock has been released.
- Replace hardcoded dark-only overlay classes with theme-aware Tailwind classes so backdrop, panel, labels, close button, and menu cards all follow light/dark mode.

## Files Changed

- `components/shared/navbar.tsx`
- `docs/plans/2026-05-31-mobile-navbar-overlay-followup.md`

## Verification

Executed after the change:

- `pnpm type-check`
- `pnpm lint`
- `pnpm build`

## Expected Result

- On mobile, the default navbar shell sits on the right side.
- When the menu opens, the full-screen overlay fully replaces the base mobile navbar.
- Tapping a same-page mobile nav item closes the overlay and then scrolls to the requested section correctly.
- In light mode, the mobile overlay uses a light surface and dark text instead of a dark-only presentation.
- Desktop navbar behavior remains centered and unchanged.
