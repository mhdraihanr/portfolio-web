# Experience Images + Detail Modal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add max 2 images per work experience with clickable timeline cards opening a carousel modal.

**Architecture:** JSONB `images` column (`{url, fileId}[]`, same shape as `projects.images`) flows Studio → Supabase → cached `getWorkExperiences()` → timeline cards (thumbnail) → `Modal` + reused `ImageCarousel` (`objectFit="contain"` so portrait certificates render uncropped). ImageKit `tr:` URL transforms keep downloads small.

**Tech Stack:** Next.js App Router, Supabase, ImageKit, react-hook-form + zod, Tailwind v4, pnpm.

**Antislop (DURING):** No new gradients/glass/shadows — reuse card + modal styles as-is. Thumbnail reuses existing rounded/border palette. Mobile: modal `p-4` + `max-w-xl` unchanged, no horizontal leak. Comments: no AI-slop (`// Step 1`, banners, emoji); keep only why-comments.

---

### Task 1: DB migration

**Files:**
- Create: `migrations/migration-add-experience-images.sql`

**Step 1: Create migration file**

```sql
-- Migration: Add images array to work_experience table
-- Stores max 2 {url, fileId} objects (office photos, certificates).
-- Same shape as projects.images so ImageUploader/ImageCarousel are reused as-is.

ALTER TABLE public.work_experience
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_experience_images ON public.work_experience USING GIN (images);

COMMENT ON COLUMN public.work_experience.images IS 'Array of {url, fileId} objects for experience photos/certificates (max 2)';
```

**Step 2: Run migration in Supabase**

Run: paste file contents into Supabase Dashboard → SQL Editor → Run.
Expected: `Success. No rows returned`.

**Step 3: Commit**

Run: `git add migrations/migration-add-experience-images.sql && git commit -m "feat: add images column to work_experience" --no-verify`
Expected: commit created.

---

### Task 2: Types + validation

**Files:**
- Modify: `types/database.types.ts:195-240` (work_experience Row/Insert/Update)
- Modify: `types/experience.ts:10-19` (ExperienceFormData)
- Modify: `lib/validations/experience.ts:1-10` (schema)

**Step 1: Update `database.types.ts`**

Add `images` to all three work_experience blocks:

```ts
// Row — add after employment_type:
employment_type: string | null;
images: { url: string; fileId: string }[];
// Insert — add after employment_type:
employment_type?: string | null;
images?: { url: string; fileId: string }[];
// Update — add after employment_type:
employment_type?: string | null;
images?: { url: string; fileId: string }[];
```

**Step 2: Update `types/experience.ts`**

```ts
export interface ExperienceImage {
  url: string;
  fileId: string;
}

export interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  order_index: number;
  logo_url?: string;
  employment_type?: string;
  images?: ExperienceImage[];
}
```

**Step 3: Update `lib/validations/experience.ts`**

Add after the `technologySchema`-style pattern (top of file, after imports):

```ts
export const experienceImageSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  fileId: z.string(),
});
```

Add inside `z.object({...})` after `employment_type`:

```ts
images: z
  .array(experienceImageSchema)
  .max(2, "Maximum 2 images allowed")
  .optional()
  .default([]),
```

**Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors (images optional, existing code untouched).

**Step 5: Commit**

Run: `git add types/database.types.ts types/experience.ts lib/validations/experience.ts && git commit -m "feat: add experience images types and validation" --no-verify`

---

### Task 3: Studio new page

**Files:**
- Modify: `app/studio/experience/new/page.tsx`

**Step 1: Add state + import**

Add import (with existing imports ~line 13):

```ts
import { triggerRevalidate } from "@/lib/revalidate";
```

Add state after `uploadedLogo` (~line 32):

```ts
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
```

Add `images: []` to `defaultValues` (~line 50).

**Step 2: Submit images + revalidate**

In `onSubmit`, add to insert object after `logo_url` line:

```ts
images: uploadedImages,
```

After `if (error) throw error;` add:

```ts
await triggerRevalidate("homepage-experience", "/");
```

**Step 3: Add uploader JSX**

Insert after the logo URL `Input` block, before the employment_type block (~line 283):

```tsx
<div className="space-y-2">
  <Label>Experience Photos</Label>
  <ImageUploader
    multiple
    maxFiles={2}
    currentImages={uploadedImages}
    onUploadComplete={(images) => {
      const newImages = [...uploadedImages, ...images].slice(0, 2);
      setUploadedImages(newImages);
      setValue("images", newImages);
    }}
    onDelete={(_, index) => {
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      setValue("images", newImages);
    }}
    disabled={isSubmitting}
  />
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Office photos or certificates (max 2)
  </p>
</div>
```

**Step 4: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

**Step 5: Commit**

Run: `git add app/studio/experience/new/page.tsx && git commit -m "feat: studio new experience images upload" --no-verify`

---

### Task 4: Studio edit page

**Files:**
- Modify: `app/studio/experience/[id]/edit/page.tsx`

**Step 1: Add state + import**

Add import:

```ts
import { triggerRevalidate } from "@/lib/revalidate";
```

Add state after `uploadedLogo` (~line 42):

```ts
const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
```

**Step 2: Load existing images**

In `fetchExperience`, after the logo block:

```ts
if (experienceData.logo_url) {
  setUploadedLogo({
    url: experienceData.logo_url,
    fileId: "",
  });
}
```

add:

```ts
const existingImages =
  (experienceData.images as unknown as UploadedImage[]) || [];
setUploadedImages(existingImages);
```

Add `images: existingImages,` to the `reset({...})` call after `employment_type`.

**Step 3: Submit images + revalidate**

In `updateData`, add after `logo_url`:

```ts
images: uploadedImages,
```

After `if (error) throw error;` add:

```ts
await triggerRevalidate("homepage-experience", "/");
```

**Step 4: Add uploader JSX**

Same block as Task 3 Step 3, inserted after logo URL input, before employment_type select.

**Step 5: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.

**Step 6: Commit**

Run: `git add "app/studio/experience/[id]/edit/page.tsx" && git commit -m "feat: studio edit experience images upload" --no-verify`

---

### Task 5: Carousel `objectFit` prop

**Files:**
- Modify: `components/ui/image-carousel.tsx:7-21` (props) + 2 `object-cover` usages on main images (thumbnails stay `cover`)

**Step 1: Add prop**

```tsx
interface ImageCarouselProps {
  images: Array<string | { url: string; fileId: string }>;
  alt: string;
  className?: string;
  objectFit?: "cover" | "contain";
}

export function ImageCarousel({
  images,
  alt,
  className = "",
  objectFit = "cover",
}: ImageCarouselProps) {
```

**Step 2: Use prop on main images only**

Single-image branch: `className="object-cover"` → `className={objectFit === "contain" ? "object-contain" : "object-cover"}`.

Multi-image main `Image`: `className="object-cover transition-opacity duration-300 select-none"` → `className={`${objectFit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-300 select-none`}`.

Thumbnails keep `object-cover` (crop is intent for 48px squares).

**Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: PASS (default keeps project detail unchanged).

**Step 4: Commit**

Run: `git add components/ui/image-carousel.tsx && git commit -m "feat: image carousel objectFit prop" --no-verify`

---

### Task 6: Timeline cards + modal

**Files:**
- Modify: `app/(public)/_sections/experience/experience-client.tsx`

**Step 1: Imports + state + transform helper**

Update imports (~lines 1-11):

```tsx
import type { WorkExperience } from "@/types/experience";
import { Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ImageCarousel } from "@/components/ui/image-carousel";
import Image from "next/image";
```

Add helper above component (why-comment earns its place — ImageKit URL shape is non-obvious):

```tsx
// ImageKit serves AVIF/WebP automatically; inserting tr: keeps downloads small
// without touching the stored original. Non-ImageKit URLs pass through.
function withImageKitTransform(url: string, transform: string): string {
  if (!url.includes("ik.imagekit.io")) return url;
  if (url.includes("/tr:")) return url;
  return url.replace(
    /(https:\/\/ik\.imagekit\.io\/[^/]+)\//,
    `$1/${transform}/`,
  );
}

function getImageSrc(image: string | { url: string; fileId: string }): string {
  return typeof image === "string" ? image : image.url;
}
```

Add state inside component after `showAll`:

```tsx
const [selectedExp, setSelectedExp] = useState<WorkExperience | null>(null);
```

**Step 2: Clickable card + thumbnail**

Change card div (~line 133):

```tsx
<div className="group relative bg-white ...">
```

to:

```tsx
<button
  type="button"
  onClick={() => setSelectedExp(exp)}
  aria-label={`View details for ${exp.position} at ${exp.company}`}
  className="group relative w-full text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
>
```

and closing `</div>` of that card to `</button>`. Keep inner decorative/hover divs unchanged.

Insert thumbnail after the date-range block, inside `relative space-y-3`:

```tsx
{exp.images && exp.images.length > 0 && (
  <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
    <Image
      src={withImageKitTransform(
        getImageSrc(exp.images[0]),
        "tr:w-400,q-70",
      )}
      alt={`${exp.position} photo`}
      fill
      sizes="(max-width: 768px) 100vw, 400px"
      className="object-cover"
      loading="lazy"
    />
  </div>
)}
```

**Step 3: Modal with carousel**

Render before closing `</section>` (after the timeline `</div>`):

```tsx
<Modal
  isOpen={!!selectedExp}
  onClose={() => setSelectedExp(null)}
  title={
    selectedExp ? `${selectedExp.position} at ${selectedExp.company}` : ""
  }
  description={
    selectedExp
      ? `${formatDate(selectedExp.start_date)} - ${selectedExp.is_current ? "Present" : formatDate(selectedExp.end_date)}`
      : ""
  }
  size="xl"
>
  {selectedExp?.images && selectedExp.images.length > 0 && (
    <ImageCarousel
      key={selectedExp.id}
      images={selectedExp.images.map((img) => ({
        url: withImageKitTransform(getImageSrc(img), "tr:w-1200,q-75"),
        fileId: "",
      }))}
      alt={selectedExp.position}
      objectFit="contain"
      className="mb-6"
    />
  )}
  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
    {selectedExp?.description}
  </p>
</Modal>
```

(`key={selectedExp.id}` resets carousel index when switching experiences.)

**Step 4: Type-check + lint**

Run: `pnpm exec tsc --noEmit`
Expected: PASS.
Run: `pnpm lint`
Expected: exit 0.

**Step 5: Commit**

Run: `git add app/\(public\)/_sections/experience/experience-client.tsx && git commit -m "feat: experience cards open carousel modal" --no-verify`

---

### Task 7: Full verification

**Step 1: Build**

Run: `pnpm build`
Expected: exit 0 (only pre-existing middleware/proxy warning allowed).

**Step 2: Manual — studio**

1. `/studio/experience/new` → upload 2 images (1 portrait cert + 1 landscape photo) → create → homepage card shows thumbnail.
2. Edit page → existing images preload → delete one → save → thumbnail updates.

**Step 3: Manual — public modal**

1. Homepage experience card → click → modal opens, cert portrait uncropped (`contain`), swipe/arrow switches 1/2, description with line breaks.
2. Card without images → modal shows description only.
3. Mobile 390px: no horizontal scroll, modal fits, carousel buttons tappable.
4. `/projects/[slug]` carousel still `cover` (unchanged).

**Step 4: Manual — dark mode**

Toggle theme: thumbnail, modal, carousel controls readable in both modes.
