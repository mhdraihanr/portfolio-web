# 🎯 Skills Management - Specification Document (v2)

**Created:** February 6, 2026  
**Updated:** February 6, 2026  
**Status:** Planning Phase - Ready for Implementation  
**Purpose:** Add Skills CRUD management to admin panel with database integration + Devicon Icon Picker

---

## 📋 Overview

Menambahkan fitur manajemen skills ke admin panel yang memungkinkan:

- CRUD operations untuk skills (Create, Read, Update, Delete)
- Kategori skills (Frontend, Backend, Tools, Others)
- Display order management
- **Devicon Icon Picker** - auto-fetch & search icons dari devicon.dev
- Icon support (Devicon classes & custom SVG URLs)
- Visibility control (show/hide di homepage)
- Integration dengan About section di homepage (fetch dari database)

### Changes dari v1:

- ~~Proficiency level~~ → **Dihapus** (tidak diperlukan)
- **Icon Picker baru** → Fetch otomatis dari `devicon.json`, bisa search & preview

---

## 🗄️ 1. Database Schema

### Table: `public.skills`

```sql
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('frontend', 'backend', 'tools', 'others')),
    icon TEXT,           -- Devicon class (e.g., "devicon-react-original colored")
    icon_svg TEXT,        -- SVG URL for icons not available in Devicon font
    order_index INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Migration SQL File: `migration-add-skills-table.sql`

Full migration includes: table creation, indexes, trigger, RLS policies, sample data.

---

## 📁 2. Type Definitions

### File: `types/skill.ts`

```typescript
export interface SkillFormData {
  name: string;
  category: SkillCategory;
  icon?: string;
  icon_svg?: string;
  order_index: number;
  is_visible: boolean;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "others";

export const SKILL_CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "tools", label: "Tools & Others" },
  { value: "others", label: "Others" },
];
```

### Update: `types/database.types.ts`

Add `skills` table types (Row, Insert, Update) - tanpa field proficiency.

---

## ✅ 3. Validation Schema

### File: `lib/validations/skill.ts`

Menggunakan **Zod** (konsisten dengan experience & project validation):

```typescript
import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.enum(["frontend", "backend", "tools", "others"]),
  icon: z.string().optional().or(z.literal("")),
  icon_svg: z.string().url().optional().or(z.literal("")),
  order_index: z.number().int().min(0),
  is_visible: z.boolean(),
});
```

---

## 🎨 4. Devicon Icon Picker Component (NEW)

### File: `components/admin/devicon-picker.tsx`

**Fitur:**

- Fetch semua icon dari `https://raw.githubusercontent.com/devicons/devicon/master/devicon.json`
- Search icon by name (fuzzy search)
- Grid display icons yang bisa diklik
- Preview icon yang dipilih (font class + SVG)
- Auto-generate devicon class name & SVG URL
- Debounced search input
- Loading state saat fetch data
- Dark mode support

**Data Flow:**

1. Komponen fetch `devicon.json` saat mount (cached di state)
2. User ketik nama icon → filter list
3. User klik icon → callback return `{ icon: "devicon-react-original colored", icon_svg: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" }`
4. Nilai auto-fill ke form fields

**Icon URL Pattern:**

```
Font: devicon-{name}-{version} colored
SVG:  https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/{name}/{name}-{version}.svg
```

**Contoh:**

```
Name: react
Versions: original, original-wordmark, plain, plain-wordmark
→ Font class: "devicon-react-original colored"
→ SVG URL: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
```

---

## 🔧 5. Helper Functions

### Update: `lib/supabase/helpers.ts`

Tambah fungsi CRUD skills:

- `insertSkill()` - Create
- `updateSkill()` - Update by ID
- `deleteSkill()` - Delete by ID

---

## 📄 6. Admin Pages

### 6.1. Skills List Page: `app/kingpersib/skills/page.tsx`

- Server component dengan SSR
- Grouped by category
- Stats cards (total, frontend, backend, tools)
- Skill cards with icon preview, visibility indicator, edit/delete buttons
- Empty state

### 6.2. Create Skill Page: `app/kingpersib/skills/new/page.tsx`

- Client component dengan react-hook-form + Zod
- Form fields: name, category, **Devicon Picker**, order_index, is_visible
- Icon preview saat dipilih
- Toast notifications
- Consistent styling dengan Experience/Project forms

### 6.3. Edit Skill Page: `app/kingpersib/skills/[id]/edit/page.tsx`

- Fetch skill by ID, pre-fill form
- Update & Delete functionality
- Delete confirmation modal
- Toast notifications

---

## 📝 7. Update Admin Sidebar

### File: `components/admin/sidebar.tsx`

Add Skills link with `Code2` icon dari lucide-react.

---

## 🏠 8. Update About Section (Homepage)

### File: `app/(public)/components/about.tsx`

- Convert dari client component ke server component (untuk SSR fetch)
- Fetch skills dari Supabase (`is_visible = true`, order by `order_index`)
- Group by category
- Hapus hardcoded skills data
- Keep current design (skill tag pills) tetap sama

---

## ✅ 9. Implementation Checklist

### Database (User Action)

- [x] Run `migration-add-skills-table.sql` di Supabase SQL Editor

### Code Implementation

- [x] Create `types/skill.ts`
- [x] Update `types/database.types.ts`
- [x] Create `lib/validations/skill.ts` (Zod schema)
- [x] Update `lib/supabase/helpers.ts` (CRUD functions)
- [x] Create `components/admin/devicon-picker.tsx` (Icon Picker)
- [x] Create `app/kingpersib/skills/page.tsx` (List)
- [x] Create `app/kingpersib/skills/new/page.tsx` (Create)
- [x] Create `app/kingpersib/skills/[id]/edit/page.tsx` (Edit)
- [x] Update `components/admin/sidebar.tsx` (add Skills nav)
- [x] Update `app/kingpersib/page.tsx` (Dashboard stats + quick actions)
- [x] Update `app/(public)/components/about.tsx` (fetch from DB)

### Files Created/Modified Summary

| Action | File                                       |
| ------ | ------------------------------------------ |
| CREATE | `migration-add-skills-table.sql`           |
| CREATE | `types/skill.ts`                           |
| CREATE | `lib/validations/skill.ts`                 |
| CREATE | `components/admin/devicon-picker.tsx`      |
| CREATE | `app/kingpersib/skills/page.tsx`           |
| CREATE | `app/kingpersib/skills/new/page.tsx`       |
| CREATE | `app/kingpersib/skills/[id]/edit/page.tsx` |
| MODIFY | `types/database.types.ts`                  |
| MODIFY | `lib/supabase/helpers.ts`                  |
| MODIFY | `components/admin/sidebar.tsx`             |
| MODIFY | `app/kingpersib/page.tsx`                  |
| MODIFY | `app/(public)/components/about.tsx`        |

---

## 📊 10. Estimated Time

| Task                          | Time       |
| ----------------------------- | ---------- |
| Migration SQL file            | 10 min     |
| Type definitions + validation | 15 min     |
| Helper functions              | 10 min     |
| **Devicon Picker component**  | **30 min** |
| Skills List page              | 25 min     |
| Skills Create page            | 25 min     |
| Skills Edit page              | 25 min     |
| Sidebar + Dashboard update    | 10 min     |
| About section update          | 15 min     |

**Total: ~2.5 hours**

---
