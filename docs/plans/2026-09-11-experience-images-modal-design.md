# 📐 Design: Experience Images + Detail Modal

> **Type:** Feature (Data-Driven CMS)
> **Date:** 2026-09-11
> **Status:** Approved — ready for implementation plan

## 🎯 Goal

Tambah maksimal 2 gambar per work experience (foto kantor + sertifikat) yang tampil sebagai thumbnail kecil di kartu timeline, dan saat kartu diklik muncul modal berisi gambar (stacked vertikal) + deskripsi lengkap experience.

## 📋 Scope (Decided)

| Item | Before | After |
| --- | --- | --- |
| Storage | `work_experience` tanpa kolom gambar | Kolom `images JSONB DEFAULT '[]'` (array max 2 URL) — pattern sama dengan `projects.images` |
| Studio form | Hanya logo uploader | Tambah `ImageUploader multiple maxFiles={2}` untuk images (logo tetap terpisah) |
| Kartu timeline | Hanya logo + posisi + tanggal, description tidak tampil | Thumbnail kecil (gambar pertama, `tr:w-400,q-70`) + hint "View details" |
| Modal | Tidak ada | Klik kartu → modal `lg`/`xl`: 2 gambar stacked vertikal (`tr:w-1200,q-75`) + full description + meta (company, position, date) |

**Out of scope (ponytail):**

- Client-side image compression saat upload — ImageKit auto-optimization (AVIF/WebP, q-80) sudah cukup. Upgrade path: kompres canvas di `ImageUploader` jika file asli di CDN jadi masalah.
- Layout adaptif modal (stacked di mobile, side-by-side di desktop) — YAGNI, sertifikat portrait butuh stacked.
- Delete image dari ImageKit saat experience dihapus — belum ada pattern untuk ini di codebase (logo juga tidak di-delete).

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────┐     ┌──────────────────────────┐
│ Studio new/edit  │────>│  Supabase    │────>│ Experience section       │
│ (react-hook-form)│     │ work_exper-  │     │ (unstable_cache, 300s,   │
│ + ImageUploader  │     │ ience.images │     │  tag homepage-experience)│
│ (multiple, max 2)│     │  (JSONB)     │     │                          │
└─────────────────┘     └──────────────┘     │  Kartu → thumbnail kecil  │
         │                       │           │  Klik → Modal (stacked)   │
         └── triggerRevalidate("homepage-experience", "/")  └────────────┘
```

- **Display optimization**: ImageKit transform URL — thumbnail `tr:w-400,q-70`, modal `tr:w-1200,q-75`. ImageKit auto-delivers AVIF/WebP + kompresi, jadi ukuran download kecil tanpa client-side compression.
- **Modal**: reuse `components/ui/modal.tsx` (sudah ada escape/overlay close, body scroll lock, size sm–full).
- **Revalidate**: `homepage-experience` tag sudah di-revalidate default di `/api/revalidate` — tidak perlu perubahan.

## 📁 Files Changed

| File | Change |
| --- | --- |
| `migrations/migration-add-experience-images.sql` | **New** — `ALTER TABLE work_experience ADD COLUMN images JSONB DEFAULT '[]'` + comment |
| `types/database.types.ts` | Add `images: string[]` ke Row/Insert/Update `work_experience` |
| `types/experience.ts` | Add `images?: string[]` ke `ExperienceFormData` |
| `lib/validations/experience.ts` | Add `images: z.array(z.string().url()).max(2)` |
| `app/studio/experience/new/page.tsx` | State `uploadedImages: UploadedImage[]`, `ImageUploader multiple maxFiles={2}`, submit `images` |
| `app/studio/experience/[id]/edit/page.tsx` | Sama — load existing `images` ke uploader, submit `images` |
| `app/(public)/_sections/experience/experience-client.tsx` | Kartu jadi clickable (button), thumbnail kecil, state `selectedExp`, render `Modal` dengan gambar stacked + description + meta |

## 🖼️ Modal Layout (stacked vertikal)

```
┌───────────────────────────────┐
│  ✕  Senior Developer @ PT ABC │
├───────────────────────────────┤
│  ┌───────────────────────┐    │
│  │   Foto Kantor         │    │
│  │   (tr:w-1200,q-75)    │    │
│  └───────────────────────┘    │
│  ┌───────────────────────┐    │
│  │   Sertifikat           │    │
│  │   (tr:w-1200,q-75)    │    │
│  └───────────────────────┘    │
│                               │
│  Deskripsi pengalaman...      │
│  (whitespace-pre-line)        │
└───────────────────────────────┘
```

- Gambar: `next/image` dengan `width/height` prop (bukan `fill`) — hindari layout shift, aspect ratio menyesuaikan konten.
- Deskripsi: `whitespace-pre-line` agar newline di DB tampil.
- Kartu tanpa gambar: tetap clickable (modal tampil tanpa gambar, hanya deskripsi + meta) — konsisten.

## ✅ Verification

1. `pnpm exec tsc --noEmit` — no errors
2. `pnpm build` — no errors
3. Manual: studio new/edit upload 2 gambar → homepage kartu tampil thumbnail → klik → modal stacked + deskripsi
4. Manual: experience tanpa gambar → klik → modal tanpa gambar, deskripsi tetap tampil