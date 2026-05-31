# Admin Profile Image Cache Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow the profile photo to be replaced from the admin area while keeping long-lived static caching safe.

**Architecture:** Do not overwrite a fixed `/profile.jpg` URL once immutable caching is enabled. Store profile image metadata in a versioned site setting, upload new files through the existing image infrastructure, and render the current versioned URL in the public About section.

**Tech Stack:** Next.js App Router, Supabase, ImageKit or versioned public image paths, admin CRUD UI, `next/image`.

---

## Problem

`/profile.jpg` can now be cached for a long time to satisfy efficient cache lifetime audits. That is good for Lighthouse, but it means replacing the file at the same URL can leave users seeing the stale browser-cached image.

## Recommended Solution

Use a versioned URL for every admin profile image update.

Examples:

- ImageKit URL with a unique file path or version query generated on upload.
- `/profile/profile-20260530-142500.jpg` if self-hosting generated static files.
- Database value such as `profile_image_url`, `profile_image_alt`, and `profile_image_updated_at` in a site settings table.

The public About component should read the latest saved URL. Because the URL changes on each replacement, the app can safely use long cache lifetimes without serving stale profile photos.

---

## Implementation Tasks

### Task 1: Add Site Settings Storage

**Files:**

- Create migration in `migrations/`
- Update `types/database.types.ts` after schema generation
- Add helper in `lib/supabase/public-data.ts`

**Steps:**

1. Add a `site_settings` table or equivalent key-value settings model.
2. Store at minimum:
   - `profile_image_url`
   - `profile_image_alt`
   - `profile_image_updated_at`
3. Add a cached public read helper for profile image metadata.

### Task 2: Add Admin Profile Image UI

**Files:**

- Add or modify admin settings route under `app/admin/`
- Reuse existing image upload UI where practical

**Steps:**

1. Add a form to preview the current profile image.
2. Upload replacement image to ImageKit or another versioned destination.
3. Save the new URL and metadata to `site_settings`.
4. Revalidate the relevant homepage cache tag/path after save.

### Task 3: Render Dynamic Profile Image

**Files:**

- Modify `app/(public)/components/about.tsx`
- Modify `app/(public)/components/about-client.tsx`

**Steps:**

1. Fetch profile image metadata in the server About wrapper.
2. Pass the image metadata to `AboutClient`.
3. Fall back to `/profile.jpg` if no setting exists.
4. Keep the About image non-priority unless it becomes above-the-fold in a future layout.

### Task 4: Cache Strategy

**Rules:**

- Long-cache versioned image URLs.
- Do not overwrite fixed URLs when immutable caching is enabled.
- If a fixed URL must be used, reduce cache lifetime and accept the Lighthouse trade-off.

### Task 5: Verification

**Commands:**

- `pnpm lint`
- `pnpm type-check`
- `pnpm run build`

**Manual checks:**

- Admin can upload and save a new profile image.
- Homepage renders the new versioned URL.
- Old cached profile image does not appear after update because the URL changed.
- Lighthouse no longer flags the profile image for inefficient cache lifetime.
