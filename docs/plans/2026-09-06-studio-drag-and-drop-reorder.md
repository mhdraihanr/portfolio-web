# 📜 Plan: Studio Drag-and-Drop Reordering (Zero-Duplicate Rule)

> **Date:** 2026-09-06  
> **Status:** ✅ Implemented  
> **Type:** Feature (Admin Studio UX & Data Integrity)

---

## 🎯 Objective

Enable intuitive, native drag-and-drop reordering across all studio entities that feature display ordering (`projects`, `work_experience`, `skills`, `certificates`), guaranteeing strictly unique, consecutive order indices with zero duplicates.

---

## 🏗️ Architecture & Implementation

### 1. Zero-Duplicate Reindexing Strategy

- When an item is dragged from `startIndex` to `endIndex`, an immutable array splice moves the element.
- All sibling items in the affected scope are immediately re-indexed to consecutive integers: `0, 1, 2, ... N`.
- For **Skills**, reordering is scoped strictly per `category` (`frontend`, `backend`, `tools`, `others`), ensuring each category maintains clean `0..N` indices without cross-category collisions.

### 2. Native HTML5 Drag and Drop with Dedicated Reorder Mode

- **Dedicated "Reorder" Mode**:
  - Activated via the "Reorder" / "Done" button next to "Add New" in each entity header.
  - Active banner explains how to drag and drop items with a quick "Selesai" exit button.
  - Prevents accidental drag operations during regular administrative workflows (viewing, editing, deleting, selecting text).
  - Automatically resets search filter on activation to ensure complete lists are reordered without accidental exclusions.
  - While active:
    - Card and table action buttons are replaced with a clear "Geser Urutan" / "Geser" badge.
    - Cards display dashed primary borders and grabbing cursors.
- **Real-time Live In-Memory Sorting**:
  - When dropped, state updates `order_index` / `sort_order` and immediately re-sorts the array in memory so the visual order changes instantly without requiring a page refresh.
- Visual affordances:
  - `GripVertical` icon indicator with `cursor-grab active:cursor-grabbing`.
  - Dragged item: `opacity-30 scale-[0.98]`.
  - Drop target: `ring-2 ring-primary border-primary bg-primary/5` highlight.

### 3. Auto-Next Order in Creation Forms (`new/page.tsx`)

- On form mount, `useEffect` queries the table count (scoped by category for skills).
- Sets initial `order_index` / `sort_order` to the end of the list (`order = count`) instead of a static `0`, preventing duplicate first-position collisions.

### 4. Persistence & Cache Revalidation

- **Optimistic UI**: Local React state updates immediately on drop.
- **Supabase Sync**: `Promise.all` executes atomic updates for each changed item's ID and new order.
- **Cache Invalidation**: Triggers `triggerRevalidate(tag, "/")` for the corresponding entity tag (`homepage-projects`, `homepage-experience`, `homepage-skills`, `homepage-certificates`).

### 5. Public Query Alignment

- `lib/supabase/public-data.ts`: Updated `fetchWorkExperiences` to sort by `order_index ASC, start_date DESC` matching the other public queries.

---

## 📁 Files Modified

| File                                   | Changes                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `app/studio/projects/page.tsx`         | Drag-and-drop on Grid cards & Table rows; zero-duplicate reindex; Supabase batch update |
| `app/studio/projects/new/page.tsx`     | Auto-assign `order_index` to current count on mount                                     |
| `app/studio/experience/page.tsx`       | Drag-and-drop on Grid cards & Table rows; `order_index` sorting                         |
| `app/studio/experience/new/page.tsx`   | Auto-assign `order_index` to current count on mount                                     |
| `app/studio/skills/page.tsx`           | Category-scoped drag-and-drop on Grid cards & Table rows; zero-duplicate reindex        |
| `app/studio/skills/new/page.tsx`       | Auto-assign `order_index` scoped to selected `category` count                           |
| `app/studio/certificates/page.tsx`     | Drag-and-drop on Grid cards; `sort_order` zero-duplicate reindex                        |
| `app/studio/certificates/new/page.tsx` | Auto-assign `sort_order` to current count on mount                                      |
| `lib/supabase/public-data.ts`          | Updated `fetchWorkExperiences` to prioritize `order_index ASC`                          |
| `docs/ADMIN_CRUD_GUIDE.md`             | Documented Drag & Drop Reordering and Zero-Duplicate Rule                               |
