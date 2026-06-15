# Project Structure Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize project structure untuk konsistensi, readability, dan compliance dengan Next.js App Router best practices.

**Architecture:**

- Rename semua file komponen ke **kebab-case** (kecuali `index.ts`)
- Group React Bits/OGL effects ke `components/effects/<effect-name>/`
- Group section components di `app/(public)/_sections/<section>/`
- Pindahkan `use-mobile-width.ts` ke `hooks/`
- Konsolidasi Supabase files ke `supabase/`
- Pertahankan `contexts/` folder

**Tech Stack:** Next.js 16, TypeScript, Bash commands untuk file operations

---

## Phase 1: High Priority (🔴)

### Task 1: Create hooks/ folder and move use-mobile-width

**Files:**

- Create: `hooks/use-mobile-width.ts`
- Delete: `lib/use-mobile-width.ts`
- Modify imports in 7 files

**Step 1: Create hooks folder and move file**

```bash
mkdir -p hooks && mv lib/use-mobile-width.ts hooks/use-mobile-width.ts
```

**Step 2: Update imports in consuming files**

Files to update:

- `app/(public)/layout.tsx:11`
- `components/shared/scroll-reveal.tsx:4`
- `app/(public)/components/hero.tsx:13`
- `components/BlurText.tsx:3`
- `app/(public)/components/about-client.tsx:6`
- `app/(public)/components/certificates.tsx:8`
- `app/(public)/components/experience-client.tsx:11`

Change:

```typescript
// FROM:
import { useMobileWidth } from "@/lib/use-mobile-width";
// TO:
import { useMobileWidth } from "@/hooks/use-mobile-width";
```

**Step 3: Create hooks/index.ts for barrel export**

Create `hooks/index.ts`:

```typescript
export { useMobileWidth } from "./use-mobile-width";
```

**Step 4: Verify with type-check**

Run: `pnpm type-check`
Expected: No errors

**Step 5: Commit**

```bash
git add hooks/ lib/use-mobile-width.ts
git commit -m "refactor: move use-mobile-width to hooks/ folder"
```

---

### Task 2: Rename components/shared files to kebab-case

**Files:**

- Rename: `components/shared/Navbar.tsx` → `navbar.tsx`
- Rename: `components/shared/Footer.tsx` → `footer.tsx`
- Rename: `components/shared/ThemeToggle.tsx` → `theme-toggle.tsx`
- Rename: `components/shared/BackToTop.tsx` → `back-to-top.tsx`
- Keep: `scroll-reveal.tsx` (already kebab-case)

**Step 1: Rename files**

```bash
cd components/shared
mv Navbar.tsx navbar.tsx
mv Footer.tsx footer.tsx
mv ThemeToggle.tsx theme-toggle.tsx
mv BackToTop.tsx back-to-top.tsx
cd ../..
```

**Step 2: Verify imports still work**

The imports use path-based imports like `@/components/shared/navbar`, so file rename doesn't break imports.

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/shared/
git commit -m "refactor: rename shared components to kebab-case"
```

---

### Task 3: Group React Bits/OGL effects into components/effects/

**Files:**

- Create: `components/effects/light-rays/{index.tsx, light-rays.jsx, light-rays.css}`
- Create: `components/effects/logo-loop/{index.tsx, logo-loop.jsx, logo-loop.css}`
- Create: `components/effects/orb/{index.tsx, orb.jsx, orb.css}`
- Create: `components/effects/blur-text.tsx`
- Create: `components/effects/split-text.tsx`
- Delete: Original files in `components/` root

**Step 1: Create effects folder structure**

```bash
mkdir -p components/effects/light-rays
mkdir -p components/effects/logo-loop
mkdir -p components/effects/orb
```

**Step 2: Move and rename LightRays files**

```bash
mv components/LightRays.tsx components/effects/light-rays/index.tsx
mv components/LightRays.jsx components/effects/light-rays/light-rays.jsx
mv components/LightRays.css components/effects/light-rays/light-rays.css
```

**Step 3: Move and rename LogoLoop files**

```bash
mv components/LogoLoop.tsx components/effects/logo-loop/index.tsx
mv components/LogoLoop.jsx components/effects/logo-loop/logo-loop.jsx
mv components/LogoLoop.css components/effects/logo-loop/logo-loop.css
```

**Step 4: Move and rename Orb files**

```bash
mv components/Orb.tsx components/effects/orb/index.tsx
mv components/Orb.jsx components/effects/orb/orb.jsx
mv components/Orb.css components/effects/orb/orb.css
```

**Step 5: Move BlurText and SplitText**

```bash
mv components/BlurText.tsx components/effects/blur-text.tsx
mv components/SplitText.tsx components/effects/split-text.tsx
```

**Step 6: Update internal imports in effect files**

In `components/effects/light-rays/index.tsx`:

```typescript
// Change:
const LightRaysClient = dynamic(() => import("./LightRays.jsx"), {
// To:
const LightRaysClient = dynamic(() => import("./light-rays.jsx"), {
```

In `components/effects/logo-loop/index.tsx`:

```typescript
// Change:
const LogoLoopClient = dynamic(() => import("./LogoLoop.jsx"), {
// To:
const LogoLoopClient = dynamic(() => import("./logo-loop.jsx"), {
```

In `components/effects/orb/index.tsx`:

```typescript
// Change:
const OrbClient = dynamic(() => import("./Orb.jsx"), {
// To:
const OrbClient = dynamic(() => import("./orb.jsx"), {
```

In `components/effects/blur-text.tsx`:

```typescript
// Change:
import { useMobileWidth } from "@/lib/use-mobile-width";
// To:
import { useMobileWidth } from "@/hooks/use-mobile-width";
```

**Step 7: Update imports in consuming files**

Files to update:

- `app/(public)/components/experience-client.tsx:7` - Orb import
- `app/(public)/components/certificates.tsx:5` - LogoLoop import
- `app/(public)/components/hero.tsx:6` - LightRays import
- `app/(public)/components/hero.tsx:10` - BlurText import

Change:

```typescript
// FROM:
import Orb from "@/components/Orb";
import LogoLoop from "@/components/LogoLoop";
import LightRays from "@/components/LightRays";
import BlurText from "@/components/BlurText";
// TO:
import Orb from "@/components/effects/orb";
import LogoLoop from "@/components/effects/logo-loop";
import LightRays from "@/components/effects/light-rays";
import BlurText from "@/components/effects/blur-text";
```

**Step 8: Create effects barrel export**

Create `components/effects/index.ts`:

```typescript
export { default as BlurText } from "./blur-text";
export { default as SplitText } from "./split-text";
export { default as LightRays } from "./light-rays";
export { default as LogoLoop } from "./logo-loop";
export { default as Orb } from "./orb";
```

**Step 9: Verify with type-check**

Run: `pnpm type-check`
Expected: No errors

**Step 10: Commit**

```bash
git add components/effects/
git add app/(public)/components/experience-client.tsx
git add app/(public)/components/certificates.tsx
git add app/(public)/components/hero.tsx
git commit -m "refactor: group React Bits/OGL effects into components/effects/"
```

---

### Task 4: Rename contexts/PageLoadingContext.tsx to kebab-case

**Files:**

- Rename: `contexts/PageLoadingContext.tsx` → `contexts/page-loading-context.tsx`

**Step 1: Rename file**

```bash
mv contexts/PageLoadingContext.tsx contexts/page-loading-context.tsx
```

**Step 2: Verify imports still work**

The imports use path-based imports like `@/contexts/PageLoadingContext`, but we need to update them to the new path.

Update imports in:

- `app/(public)/layout.tsx:9`
- `app/(public)/contact/page.tsx:10`
- `app/(public)/components/hero.tsx:12`
- `components/shared/navbar.tsx:10`
- `app/projects/layout.tsx:7`

Change:

```typescript
// FROM:
from "@/contexts/PageLoadingContext"
// TO:
from "@/contexts/page-loading-context"
```

**Step 3: Verify with type-check**

Run: `pnpm type-check`
Expected: No errors

**Step 4: Commit**

```bash
git add contexts/
git commit -m "refactor: rename PageLoadingContext to kebab-case"
```

---

## Phase 2: Medium Priority (🟡)

### Task 5: Group section components into \_sections/ subfolders

**Files:**

- Create: `app/(public)/_sections/hero/`
- Create: `app/(public)/_sections/about/`
- Create: `app/(public)/_sections/projects/`
- Create: `app/(public)/_sections/experience/`
- Create: `app/(public)/_sections/certificates/`
- Move: All files from `app/(public)/components/`

**Step 1: Create folder structure**

```bash
mkdir -p app/\(public\)/_sections/hero
mkdir -p app/\(public\)/_sections/about
mkdir -p app/\(public\)/_sections/projects
mkdir -p app/\(public\)/_sections/experience
mkdir -p app/\(public\)/_sections/certificates
```

**Step 2: Move hero files**

```bash
mv app/\(public\)/components/hero.tsx app/\(public\)/_sections/hero/index.tsx
```

**Step 3: Move about files**

```bash
mv app/\(public\)/components/about.tsx app/\(public\)/_sections/about/index.tsx
mv app/\(public\)/components/about-client.tsx app/\(public\)/_sections/about/about-client.tsx
```

**Step 4: Move projects files**

```bash
mv app/\(public\)/components/projects.tsx app/\(public\)/_sections/projects/index.tsx
mv app/\(public\)/components/projects-client.tsx app/\(public\)/_sections/projects/projects-client.tsx
mv app/\(public\)/components/lazy-projects-client.tsx app/\(public\)/_sections/projects/lazy-projects-client.tsx
```

**Step 5: Move experience files**

```bash
mv app/\(public\)/components/experience.tsx app/\(public\)/_sections/experience/index.tsx
mv app/\(public\)/components/experience-client.tsx app/\(public\)/_sections/experience/experience-client.tsx
mv app/\(public\)/components/lazy-experience-client.tsx app/\(public\)/_sections/experience/lazy-experience-client.tsx
```

**Step 6: Move certificates files**

```bash
mv app/\(public\)/components/certificates.tsx app/\(public\)/_sections/certificates/index.tsx
```

**Step 7: Move lazy-home-client-sections**

```bash
mv app/\(public\)/components/lazy-home-client-sections.tsx app/\(public\)/_sections/lazy-home-client-sections.tsx
```

**Step 8: Move README.md and delete old components folder**

```bash
mv app/\(public\)/components/README.md app/\(public\)/_sections/README.md
rm app/\(public\)/components/index.ts
rmdir app/\(public\)/components
```

**Step 9: Update imports in page.tsx**

Update `app/(public)/page.tsx`:

```typescript
// FROM:
import { Hero } from "./components/hero";
import { About } from "./components/about";
import { LazyHomeClientSections } from "./components/lazy-home-client-sections";
import { Projects } from "./components/projects";
import { Experience } from "./components/experience";
// TO:
import { Hero } from "./_sections/hero";
import { About } from "./_sections/about";
import { LazyHomeClientSections } from "./_sections/lazy-home-client-sections";
import { Projects } from "./_sections/projects";
import { Experience } from "./_sections/experience";
```

**Step 10: Update internal imports within sections**

Update relative imports in each section file to use correct relative paths.

**Step 11: Verify with type-check**

Run: `pnpm type-check`
Expected: No errors

**Step 12: Commit**

```bash
git add app/\(public\)/_sections/
git add app/\(public\)/page.tsx
git commit -m "refactor: group section components into _sections/ private folders"
```

---

### Task 6: Add missing Next.js special files

**Files:**

- Create: `app/not-found.tsx`
- Create: `app/error.tsx`
- Create: `app/(public)/loading.tsx`

**Step 1: Create global not-found.tsx**

Create `app/not-found.tsx`:

```typescript
import { Container } from "@/components/shared";

export default function NotFound() {
  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Back to Home
      </a>
    </Container>
  );
}
```

**Step 2: Create global error.tsx**

Create `app/error.tsx`:

```typescript
"use client";

import { useEffect } from "react";
import { Container } from "@/components/shared";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-destructive mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </Container>
  );
}
```

**Step 3: Create loading.tsx for public routes**

Create `app/(public)/loading.tsx`:

```typescript
import { GlobalLoader } from "@/components/shared";

export default function PublicLoading() {
  return <GlobalLoader />;
}
```

**Step 4: Verify with build**

Run: `pnpm build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add app/not-found.tsx app/error.tsx app/\(public\)/loading.tsx
git commit -m "feat: add not-found, error, and loading special files"
```

---

## Phase 3: Low Priority (🟢)

### Task 7: Move documentation files to docs/

**Files:**

- Move: `components/COMPONENTS_LIST.md` → `docs/COMPONENTS.md`
- Move: `components/README.md` → `docs/COMPONENTS_README.md`

**Step 1: Move files**

```bash
mv components/COMPONENTS_LIST.md docs/COMPONENTS.md
```

Note: `components/README.md` already deleted in Task 5, skip if not exists.

**Step 2: Commit**

```bash
git add docs/COMPONENTS.md
git commit -m "docs: move component documentation to docs/"
```

---

### Task 8: Consolidate Supabase files into supabase/

**Files:**

- Create: `supabase/schema.sql`
- Create: `supabase/migrations/`
- Move: `supabase-schema.sql` → `supabase/schema.sql`
- Move: `migrations/*` → `supabase/migrations/`

**Step 1: Create supabase folder structure**

```bash
mkdir -p supabase/migrations
```

**Step 2: Move schema file**

```bash
mv supabase-schema.sql supabase/schema.sql
```

**Step 3: Move migration files**

```bash
mv migrations/*.sql supabase/migrations/
rmdir migrations
```

**Step 4: Update any references in documentation**

Update `docs/PROJECT_STRUCTURE.md` to reflect new paths.

**Step 5: Commit**

```bash
git add supabase/
git add docs/PROJECT_STRUCTURE.md
git commit -m "refactor: consolidate Supabase files into supabase/ folder"
```

---

### Task 9: Rename components/ui files to kebab-case

**Files:**

- Rename all PascalCase files in `components/ui/` to kebab-case

Current files to rename:

- `Button.tsx` → `button.tsx`
- `Card.tsx` → `card.tsx`
- `Input.tsx` → `input.tsx`
- `Label.tsx` → `label.tsx`
- `Modal.tsx` → `modal.tsx`
- `Spinner.tsx` → `spinner.tsx`
- `Badge.tsx` → `badge.tsx`

Files already kebab-case (skip):

- `animated-shiny-text.tsx`
- `certificate-card.tsx`
- `image-carousel.tsx`
- `image-uploader.tsx`
- `textarea.tsx`
- `toast.tsx`
- `shine-border.tsx`

**Step 1: Rename files**

```bash
cd components/ui
mv Button.tsx button.tsx
mv Card.tsx card.tsx
mv Input.tsx input.tsx
mv Label.tsx label.tsx
mv Modal.tsx modal.tsx
mv Spinner.tsx spinner.tsx
mv Badge.tsx badge.tsx
cd ../..
```

**Step 2: Verify imports still work**

The imports use path-based imports like `@/components/ui/button`, so file rename doesn't break imports.

Run: `pnpm type-check`
Expected: No errors

**Step 3: Commit**

```bash
git add components/ui/
git commit -m "refactor: rename UI components to kebab-case"
```

---

### Task 10: Rename components/admin files to kebab-case

**Files:**

- Rename: `components/admin/header.tsx` (already kebab-case, skip)
- Rename: `components/admin/sidebar.tsx` (already kebab-case, skip)
- Rename: `components/admin/devicon-picker.tsx` (already kebab-case, skip)
- Rename: `components/admin/technology-input.tsx` (already kebab-case, skip)

All files already kebab-case. Skip this task.

---

## Verification

After all tasks complete:

1. Run `pnpm lint`
2. Run `pnpm type-check`
3. Run `pnpm build`
4. Test dev server: `pnpm dev`
5. Verify all pages load correctly

---

## Final Structure

```
portfolio-web/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── not-found.tsx           ✨ NEW
│   ├── error.tsx               ✨ NEW
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx         ✨ NEW
│   │   ├── _sections/          ✨ REORGANIZED
│   │   │   ├── hero/
│   │   │   ├── about/
│   │   │   ├── projects/
│   │   │   ├── experience/
│   │   │   ├── certificates/
│   │   │   └── lazy-home-client-sections.tsx
│   │   └── contact/
│   ├── admin/
│   ├── api/
│   └── projects/
├── components/
│   ├── effects/                ✨ NEW
│   │   ├── blur-text.tsx
│   │   ├── split-text.tsx
│   │   ├── light-rays/
│   │   ├── logo-loop/
│   │   └── orb/
│   ├── ui/                     ✨ RENAMED to kebab-case
│   ├── admin/
│   ├── shared/                 ✨ RENAMED to kebab-case
│   └── providers/
├── contexts/
│   └── page-loading-context.tsx ✨ RENAMED
├── hooks/                      ✨ NEW
│   ├── use-mobile-width.ts
│   └── index.ts
├── lib/
├── supabase/                   ✨ NEW
│   ├── schema.sql
│   └── migrations/
├── types/
├── docs/
│   └── COMPONENTS.md           ✨ MOVED
└── public/
```
