# 📜 Plan: Profile Studio Integration (Photo, CV & Section Texts)

> **Type:** Feature (Data-Driven CMS)
> **Date:** 2026-09-07
> **Status:** ✅ Implemented

## 🎯 Goal

Make the CV link, profile photo, and hero/about section texts editable via the `/studio` admin panel instead of being hardcoded in components.

## 📋 Scope (Decided)

| Item                        | Before                                         | After                                                             |
| --------------------------- | ---------------------------------------------- | ----------------------------------------------------------------- |
| CV link                     | Hardcoded Google Drive URL in `hero/index.tsx` | `profile.cv_url` (URL eksternal — Google Drive/Notion)            |
| About photo                 | Hardcoded `/profile.jpg`                       | `profile.photo_url` (ImageKit upload via `ImageUploader`)         |
| Hero greeting/title/tagline | Hardcoded                                      | `profile.full_name`, `profile.hero_title`, `profile.hero_tagline` |
| About name/tagline/text     | Hardcoded                                      | `profile.full_name`, `profile.tagline`, `profile.about_text`      |

**Out of scope (ponytail):**

- PDF upload langsung ke ImageKit (ImageKit default image-only; pakai URL eksternal dulu). Upgrade path: ubah allow-file-types di dashboard ImageKit + `useUniqueFileName` false, tambah field `cv_file_id` untuk delete.
- Social links & location di hero/about tetap hardcoded (belum diminta).
- Key/value settings table — overkill untuk 7 field, kehilangan type-safety.

## 🏗️ Architecture

Single-row `profile` table (`id = 1`, enforced by CHECK constraint), same RLS pattern as other tables:

```
┌─────────────────┐     ┌──────────────┐     ┌───────────────┐
│ Studio /profile  │────>│  Supabase    │────>│ Hero + About  │
│ (react-hook-form)│     │  profile row │     │ (unstable_    │
│ + ImageUploader  │     │  (id = 1)    │     │  cache, 300s) │
└─────────────────┘     └──────────────┘     └───────────────┘
         │                       │
         └── triggerRevalidate("homepage-profile", "/")
```

## 📁 Files Changed

| File                                            | Change                                                                                                 |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `migrations/migration-add-profile-table.sql`    | **New** — table, RLS, trigger, seed dengan data hardcoded lama                                         |
| `types/database.types.ts`                       | Add `profile` Table types                                                                              |
| `types/profile.ts`                              | **New** — `Profile`, `ProfileUpdate`, `ProfileFormData`                                                |
| `lib/validations/profile.ts`                    | **New** — zod schema                                                                                   |
| `lib/supabase/helpers.ts`                       | Add `updateProfile()`                                                                                  |
| `lib/supabase/public-data.ts`                   | Add `fetchProfile()` + `getProfile()` cached (`tag: homepage-profile`)                                 |
| `app/api/revalidate/route.ts`                   | Add `homepage-profile` to default revalidate tags                                                      |
| `app/studio/profile/page.tsx`                   | **New** — form (Identity, Photo & CV, Hero, About sections)                                            |
| `components/admin/sidebar.tsx`                  | Add "Profile" menu item                                                                                |
| `app/(public)/_sections/hero/index.tsx`         | Server wrapper — fetch profile, render `HeroClient`                                                    |
| `app/(public)/_sections/hero/hero-client.tsx`   | **New** — pindahan dari `index.tsx`, terima `profile` prop, fallback ke nilai lama jika `profile` null |
| `app/(public)/_sections/about/index.tsx`        | Fetch profile (parallel dengan skills), pass ke client                                                 |
| `app/(public)/_sections/about/about-client.tsx` | Terima `profile` prop untuk photo, name, tagline, about text                                           |

## 🚀 Deployment Steps

1. Run `migrations/migration-add-profile-table.sql` di Supabase SQL Editor
2. Deploy aplikasi
3. Buka `/studio` → menu **Profile** → ubah data

## 🔄 Follow-up (same day)

1. **About layout restructure** (`about-client.tsx`) — blok Skills & Technologies dipindah keluar dari kolom kanan (`lg:col-span-8`) jadi section full-width di bawah grid. Grid photo+text sekarang `items-center` sehingga photo & paragraf simetris; badge skills tidak lagi wrap bertumpuk di kolom sempit.
2. **ScrollReveal jitter fix** (`components/shared/scroll-reveal.tsx`) — saat elemen berada tepat di batas atas viewport, `isIntersecting` flip true↔false tiap scroll piksel kecil → animasi opacity/transform bolak-balik (jitter). Fix: `setIsVisible(entry.isIntersecting || entry.boundingClientRect.top < 0)` — elemen yang sudah terlewat ke atas dianggap selalu revealed (hysteresis).

## 🔄 Rollback

Aman: drop table `profile` saja. Komponen public punya fallback ke nilai hardcoded lama jika `profile` null / fetch gagal.
