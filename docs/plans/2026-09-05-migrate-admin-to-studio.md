# Migrate Admin Route to /studio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Move admin route to `/studio`, disable IP whitelist by default, update hardcoded routes, and harmonize documentation.

**Architecture:**

- Rename `app/admin` folder to `app/studio` (preserving Next.js file-based routing convention).
- Update default `ADMIN_ROUTE_SECRET` in `lib/auth.ts`, `lib/middleware/auth-middleware.ts`, and `.env.example` to `studio`.
- Replace hardcoded `/admin` links across admin pages to use relative or `/studio` paths.
- Update docs to reflect `/studio` as the default secret route and clarify that `ADMIN_IP_WHITELIST` is empty/disabled.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase SSR.

---

### Task 1: Rename app/admin folder to app/studio

**Files:**

- Move: `app/admin` -> `app/studio`

**Step 1: Move folder using git**
Run: `git mv app/admin app/studio`

**Step 2: Verify git status**
Run: `git status`

---

### Task 2: Update default route config & helper in code

**Files:**

- Modify: `lib/auth.ts`
- Modify: `lib/middleware/auth-middleware.ts`
- Modify: `.env.example`

**Step 1: Update fallback in auth utilities**
Ensure fallback value of `ADMIN_ROUTE_SECRET` is `"studio"`.

**Step 2: Update .env.example**
Set default `ADMIN_ROUTE_SECRET=studio` and keep `ADMIN_IP_WHITELIST=` empty with explanatory comments.

---

### Task 3: Replace hardcoded /admin links in app/studio pages

**Files:**

- Modify: `app/studio/page.tsx`
- Modify: `app/studio/login/page.tsx`
- Modify: `app/studio/projects/page.tsx`
- Modify: `app/studio/projects/new/page.tsx`
- Modify: `app/studio/projects/[id]/edit/page.tsx`
- Modify: `app/studio/experience/page.tsx`
- Modify: `app/studio/experience/new/page.tsx`
- Modify: `app/studio/experience/[id]/edit/page.tsx`
- Modify: `app/studio/skills/page.tsx`
- Modify: `app/studio/skills/new/page.tsx`
- Modify: `app/studio/skills/[id]/edit/page.tsx`

**Step 1: Update navigation paths from /admin to /studio**

---

### Task 4: Verify typecheck & build

**Step 1: Run TypeScript / Next.js build check**
Run: `pnpm build` or `npm run build`

---

### Task 5: Harmonize documentation

**Files:**

- Modify: `docs/ADMIN_ROUTE_CONFIG.md`
- Modify: `docs/IP_WHITELIST_GUIDE.md`
- Modify: `docs/SECURITY_ANALYSIS.md`
- Modify: `docs/DOCUMENTATION.md`
- Modify: `docs/QUICK_START.md`
- Modify: `docs/DEPLOYMENT.md`
- Modify: `README.md`
