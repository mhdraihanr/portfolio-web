# 🔐 Admin CRUD Quick Reference

Panduan cepat untuk menggunakan admin panel CRUD functionality.

---

## 🚀 Quick Access

**Studio Panel URL:** `http://localhost:3000/studio`

**Login URL:** `http://localhost:3000/studio/login`

_(Catatan: Path `/studio` dapat disesuaikan melalui environment variable `ADMIN_ROUTE_SECRET`)_

---

## 📋 Projects Management

### List Projects

**URL:** `/studio/projects`

**Features:**

- View all projects in card layout
- See featured badge
- View technologies tags
- Quick links to live project & GitHub
- Edit and Delete buttons
- Empty state if no projects

**Actions:**

- Click "Add Project" to create new
- Click pencil icon to edit
- Click trash icon to delete (with confirmation)

### Create Project

**URL:** `/studio/projects/new`

**Required Fields:**

- Title (3-100 characters)
- Slug (auto-generated, editable)
- Description (10-500 characters)
- Technologies (at least 1, max 20, with Devicon icons)

**Optional Fields:**

- **My Role** (max 200 chars) — peranmu di proyek, tampil di halaman detail
- **What I Did** (max 2000 chars) — **1 baris = 1 bullet**; tampil sebagai bullet list di halaman detail
- Images (via ImageKit upload, max 10)
- Project URL
- GitHub URL
- Featured (checkbox)
- Order Index (default: 0)

**Image Upload (ImageKit):**

- Drag & drop or click to browse
- Multiple images supported (max 10)
- Preview with delete button on hover
- Images uploaded to ImageKit CDN
- Each image stored with URL and fileId for deletion
- Delete removes from both form and ImageKit

**Tips:**

- Slug auto-generates from title
- Use Technology Input for consistent icon styling
- Click X on tag to remove technology
- Lower order index = appears first
- Images display as carousel on public page

### Edit Project

**URL:** `/studio/projects/[id]/edit`

**Features:**

- Form pre-filled with existing data
- All create features available
- Delete button (with confirmation)
- Slug uniqueness check

---

## 💼 Experience Management

### List Experience

**URL:** `/studio/experience`

**Features:**

- View all work experience in card layout
- See "Current" badge for current job
- Date range display (MMM YYYY - Present)
- Company and position info
- Edit and Delete buttons
- Sorted by start date (most recent first)

**Actions:**

- Click "Add Experience" to create new
- Click pencil icon to edit
- Click trash icon to delete (with confirmation)

### Create Experience

**URL:** `/studio/experience/new`

**Required Fields:**

- Company (2-100 characters)
- Position (2-100 characters)
- Description (10-2000 characters)
- Start Date (date picker)
- End Date (required if not current)

**Optional Fields:**

- Company Logo (via ImageKit upload, single image)
- Employment Type (Full-time, Part-time, Contract, Freelance)
- Is Current (checkbox)
- Order Index (default: 0)

**Logo Upload (ImageKit):**

- Single image upload for company logo
- Drag & drop or click to browse
- Preview with delete button on hover
- Logo uploaded to ImageKit CDN
- Delete removes from both form and ImageKit

**Tips:**

- Check "Is Current" for current job (auto-disables end date)
- End date must be after start date
- Lower order index = appears first
- Logo displays on work experience timeline

### Edit Experience

**URL:** `/studio/experience/[id]/edit`

**Features:**

- Form pre-filled with existing data
- All create features available
- Delete button (with confirmation)
- Date validation

---

## 🛠️ Skills Management

### List Skills

**URL:** `/studio/skills`

**Features:**

- Grid view (grouped by category) and Table view toggle
- Search by name
- Category filter (All, Frontend, Backend, Tools, Others)
- Stats cards (Total, Frontend, Backend, Tools, Visible)
- Icon preview (Devicon SVG)
- Visibility indicator
- Edit and Delete buttons
- Empty state if no skills

**Actions:**

- Click "Add Skill" to create new
- Click pencil icon to edit
- Click trash icon to delete (with confirmation)
- Toggle between Grid/Table view

### Create Skill

**URL:** `/studio/skills/new`

**Required Fields:**

- Name (2-50 characters)
- Category (Frontend, Backend, Tools, Others)

**Optional Fields:**

- Icon (Devicon class, e.g., `devicon-react-original colored`)
- Icon SVG URL (auto-filled from Devicon Picker)
- Order Index (default: 0)
- Visible (checkbox, default: true)

**Devicon Picker:**

- Click "Browse Icons" to open icon picker
- Search icons by name (e.g., "react", "python", "docker")
- Click icon to select → auto-fills icon class & SVG URL
- Click "Clear" to remove selected icon
- Link to devicon.dev for reference

**Tips:**

- Use Devicon Picker for consistent icon styling
- Icon class and SVG URL auto-generate from picker
- Manual override available for custom icons
- Lower order index = appears first

### Edit Skill

**URL:** `/studio/skills/[id]/edit`

**Features:**

- Form pre-filled with existing data
- All create features available
- Delete button (with confirmation)
- Icon preview with current selection

---

## 📜 Certificates Management

### List Certificates

**URL:** `/studio/certificates`

**Features:**

- Card grid layout with search
- Stats cards (Total, Providers)
- Credential URL link preview
- Sort order display
- Edit and Delete buttons
- Empty state if no certificates

**Actions:**

- Click "Add Certificate" to create new
- Click pencil icon to edit
- Click trash icon to delete (with confirmation)
- Click "Refresh Cache" to revalidate homepage

### Create Certificate

**URL:** `/studio/certificates/new`

**Required Fields:**

- Title (2-200 characters)
- Provider / Issuer (2-100 characters)

**Optional Fields:**

- Issue Date (free text, e.g., "2024", "Jan 2024")
- Credential ID
- Credential URL (valid URL)
- Description (max 500 characters)
- Image URL (valid URL)
- Sort Order (default: 0)

### Edit Certificate

**URL:** `/studio/certificates/[id]/edit`

**Features:**

- Form pre-filled with existing data
- All create features available
- Delete button (with confirmation)

---

## 👤 Profile Settings

### Edit Profile

**URL:** `/studio/profile`

Single-row settings (bukan list — tidak ada create/delete/reorder). Mengatur konten yang sebelumnya hardcoded di Hero & About section:

**Sections:**

1. **Identity** — Full Name (dipakai di hero greeting & about), Tagline (about section)
2. **Photo & CV** — Profile Photo (upload via ImageKit), CV URL (link eksternal: Google Drive, Notion, dll)
3. **Hero Section** — Hero Title (teks animasi BlurText), Hero Tagline (paragraf di samping tombol CV)
4. **About Section** — About Text (paragraf bio)

**Actions:**

- Klik "Save Changes" untuk menyimpan
- Cache homepage otomatis di-revalidate (`homepage-profile` tag)

**Catatan:**

- Jika Photo dihapus dari uploader, About fallback ke `/profile.jpg`
- Jika CV URL kosong, tombol "See My CV" disembunyikan di hero

---

## 🔄 Dedicated Reorder Mode & Drag-and-Drop (Zero-Duplicate Rule)

Semua entitas di studio yang memiliki urutan tampilan kini memiliki tombol **"Reorder"** di header untuk mengaktifkan mode drag and drop khusus secara aman dan real-time:

### Entitas yang Didukung:

1. **Projects** (`order_index`): Drag card pada Grid View atau baris pada Table View.
2. **Work Experience** (`order_index`): Drag card timeline pada Grid View atau baris pada Table View.
3. **Skills** (`order_index`): Drag card pada Grid View (reorder otomatis terisolasi **per kategori**: Frontend, Backend, Tools, Others) atau baris pada Table View.
4. **Certificates** (`sort_order`): Drag card pada Grid View.

### Cara Kerja & Mekanisme Real-Time:

- **Dedicated "Reorder" Button**: Terletak di samping tombol "+ Add [Item]". Klik untuk mengaktifkan mode drag and drop dengan border dashed indikatif dan banner instruksi. Klik "Done" di header untuk kembali ke mode navigasi biasa.
- **Tampilan Real-Time Langsung**: Perpindahan posisi kartu/baris langsung ter-render seketika tanpa perlu reload/refresh halaman.
- **Re-indexing Otomatis**: Setiap kali item digeser dan dilepas, seluruh urutan di-reindex secara berurutan `0, 1, 2, ... N`.
- **Tidak Ada Angka Kembar**: Dijamin 100% unik tanpa duplikasi index.
- **Auto-Assign Form Baru**: Saat membuat item baru (`/new`), form otomatis mengisi urutan berikutnya (`order = total_items`).
- **Optimistic UI & Cache Revalidation**: Tampilan list berpindah secara instan, update Supabase berjalan di background dengan auto revalidation cache homepage.
- **Safety**: Tombol Edit/Delete otomatis disembunyikan saat Reorder Mode aktif dan digantikan dengan badge "Geser Urutan" untuk mencegah klik yang tidak disengaja. Search query otomatis di-reset saat masuk ke Reorder Mode.

---

## �🎨 Form Validation Rules

### Projects

| Field        | Min | Max  | Format                          |
| ------------ | --- | ---- | ------------------------------- |
| Title        | 3   | 100  | Any text                        |
| Slug         | 3   | 100  | lowercase-with-hyphens          |
| Description  | 10  | 500  | Any text                        |
| Role         | -   | 200  | Any text (optional)             |
| What I Did   | -   | 2000 | Newline = bullet (optional)     |
| Technologies | 1   | 20   | Array of {name, icon, icon_svg} |
| Images       | 0   | 10   | Array of {url, fileId}          |
| Image URL    | -   | -    | Valid URL or empty              |
| Project URL  | -   | -    | Valid URL or empty              |
| GitHub URL   | -   | -    | Valid URL or empty              |
| Featured     | -   | -    | Boolean (checkbox)              |
| Order Index  | 0   | ∞    | Whole number                    |

### Experience

| Field       | Min | Max  | Format             |
| ----------- | --- | ---- | ------------------ |
| Company     | 2   | 100  | Any text           |
| Position    | 2   | 100  | Any text           |
| Description | 10  | 2000 | Any text           |
| Start Date  | -   | -    | Date (YYYY-MM-DD)  |
| End Date    | -   | -    | Date (YYYY-MM-DD)  |
| Is Current  | -   | -    | Boolean (checkbox) |
| Order Index | 0   | ∞    | Whole number       |

### Skills

| Field       | Min | Max | Format                                 |
| ----------- | --- | --- | -------------------------------------- |
| Name        | 2   | 50  | Any text                               |
| Category    | -   | -   | Enum: frontend, backend, tools, others |
| Icon        | -   | -   | Devicon class string or empty          |
| Icon SVG    | -   | -   | Valid URL or empty                     |
| Order Index | 0   | ∞   | Whole number                           |
| Visible     | -   | -   | Boolean (checkbox)                     |

### Certificates

| Field          | Min | Max | Format                        |
| -------------- | --- | --- | ----------------------------- |
| Title          | 2   | 200 | Any text                      |
| Provider       | 2   | 100 | Any text                      |
| Issue Date     | -   | -   | Free text (year, month, etc.) |
| Credential ID  | -   | -   | Any text                      |
| Credential URL | -   | -   | Valid URL or empty            |
| Description    | -   | 500 | Any text                      |
| Image          | -   | -   | Valid URL or empty            |
| Sort Order     | 0   | ∞   | Whole number                  |

### Profile

| Field        | Min | Max  | Format                   |
| ------------ | --- | ---- | ------------------------ |
| Full Name    | 2   | 120  | Any text                 |
| Tagline      | 2   | 120  | Any text                 |
| Hero Title   | 2   | 200  | Any text                 |
| Hero Tagline | 2   | 600  | Any text                 |
| About Text   | 10  | 2000 | Any text                 |
| Photo        | -   | -    | ImageKit upload (1 file) |
| CV URL       | -   | -    | Valid URL or empty       |

---

## 💡 Tips & Tricks

### Projects

1. **Auto-Generate Slug**
   - Type the title first
   - Slug will auto-generate
   - Edit if needed

2. **Add Technologies**
   - Type technology name
   - Press Enter or click Add button
   - Click X on tag to remove

3. **Featured Projects**
   - Check "Featured" for important projects
   - Featured projects can be highlighted on homepage

4. **Order Index**
   - Use 0, 10, 20, 30... for easy reordering
   - Lower numbers appear first

### Skills

1. **Use Devicon Picker**
   - Click "Browse Icons" to open picker
   - Search by technology name
   - Auto-generates both icon class & SVG URL

2. **Categories**
   - Frontend: React, Vue, Angular, CSS, HTML, etc.
   - Backend: Node.js, Python, Go, databases, etc.
   - Tools: Docker, Git, VS Code, etc.
   - Others: Anything that doesn't fit above

3. **Visibility Control**
   - Uncheck "Visible" to hide skill from homepage
   - Useful for skills you want to keep but not display

4. **Order Index**
   - Skills are grouped by category on homepage
   - Within each category, ordered by order_index
   - Use 0, 10, 20... for easy reordering

### Experience

1. **Current Job**
   - Check "Is Current" for current position
   - End date will be disabled automatically
   - Badge "Current" will appear on list

2. **Date Format**
   - Use date picker for consistency
   - Dates displayed as "MMM YYYY"
   - Current jobs show "Present"

3. **Order Index**
   - Usually not needed (sorted by date)
   - Use if you want custom order

---

## 🔔 Notifications

### Success Messages

- ✅ "Project created successfully"
- ✅ "Project updated successfully"
- ✅ "Project deleted successfully"
- ✅ "Work experience created successfully"
- ✅ "Work experience updated successfully"
- ✅ "Work experience deleted successfully"

### Success Messages

- ✅ "Skill created successfully"
- ✅ "Skill updated successfully"
- ✅ "Skill deleted successfully"

### Error Messages

- ❌ "Failed to load projects"
- ❌ "Failed to create project"
- ❌ "Failed to update project"
- ❌ "Failed to delete project"
- ❌ "A project with this slug already exists"
- ❌ "Project not found"
- ❌ "Failed to load work experience"
- ❌ "Failed to create work experience"
- ❌ "Failed to update work experience"
- ❌ "Failed to delete work experience"
- ❌ "Work experience not found"
- ❌ "Failed to load skills"
- ❌ "Failed to create skill"
- ❌ "Failed to update skill"
- ❌ "Failed to delete skill"
- ❌ "Skill not found"

---

## 🐛 Troubleshooting

### Issue: "Failed to load projects"

**Possible causes:**

- Supabase connection issue
- Database not accessible
- RLS policies blocking access

**Solution:**

1. Check `.env.local` has correct Supabase credentials
2. Verify you're logged in
3. Check browser console for errors
4. Verify database schema is executed

### Issue: "A project with this slug already exists"

**Cause:** Slug must be unique

**Solution:**

1. Change the slug to something unique
2. Add numbers or dates (e.g., `my-project-2024`)

### Issue: "End date is required when position is not current"

**Cause:** End date validation

**Solution:**

1. Either check "Is Current" checkbox
2. Or provide an end date

### Issue: Form validation errors

**Cause:** Field requirements not met

**Solution:**

1. Check minimum character requirements
2. Ensure all required fields are filled
3. Verify URL format is correct
4. Check date order (end after start)

---

## 📱 Mobile Usage

### Navigation

- Tap hamburger menu (☰) to open sidebar
- Tap outside or X to close
- All features work on mobile

### Forms

- Forms are responsive
- Date pickers work on mobile
- Technologies tags scrollable
- All buttons accessible

---

## ⌨️ Keyboard Shortcuts

### Technologies Input

- **Enter** - Add technology tag
- **Backspace** (when empty) - Focus last tag

### Forms

- **Tab** - Navigate between fields
- **Shift + Tab** - Navigate backwards
- **Enter** - Submit form (when on submit button)
- **Escape** - Close modal

---

## 🎯 Best Practices

### Projects

1. **Write Clear Descriptions**
   - Keep description concise (under 200 chars)
   - Use problem-solution-impact format
   - Highlight key achievements

2. **Choose Technologies Wisely**
   - List main technologies only
   - Use consistent naming (e.g., "React" not "ReactJS")
   - Order by importance

3. **Use Good Images**
   - Use high-quality screenshots
   - Aspect ratio 16:9 recommended
   - Host on reliable CDN

4. **Set Order Thoughtfully**
   - Put best projects first (lower order)
   - Use gaps (0, 10, 20) for easy reordering

### Experience

1. **Write Detailed Descriptions**
   - List key responsibilities
   - Highlight achievements
   - Include technologies used
   - Mention team size if relevant

2. **Date Accuracy**
   - Use actual start/end dates
   - Check "Is Current" for current job
   - Keep dates up to date

3. **Professional Tone**
   - Use action verbs
   - Quantify achievements
   - Be specific

---

## 📊 Data Examples

### Good Project Example

```
Title: E-Commerce Platform
Slug: ecommerce-platform
Description: Full-stack e-commerce solution with payment integration
Problem: Small businesses need affordable online store solutions
Solution: Built scalable platform with Stripe integration and admin panel
Impact: Helped 50+ businesses increase online sales by 200%
Technologies: Next.js, TypeScript, Supabase, Stripe, Tailwind CSS
Featured: Yes
Order: 0
```

### Good Skill Example

```
Name: React
Category: Frontend Development
Icon: devicon-react-original colored
Icon SVG: https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg
Order Index: 0
Visible: Yes
```

### Good Experience Example

```
Company: Tech Startup Inc
Position: Senior Full Stack Developer
Description: Led development of SaaS platform serving 10,000+ users.
Built microservices architecture with Node.js and React. Mentored
junior developers and established coding standards.
Start Date: 2023-01-01
End Date: -
Is Current: Yes
Order: 0
```

---

## 🔗 Related Documentation

- [TODO.md](../TODO.md) - Full task list
- [QUICK_START.md](../QUICK_START.md) - Quick start guide
- [PROJECT_STRUCTURE.md](../PROJECT_STRUCTURE.md) - Code structure
- [phase/PHASE_4_COMPLETE.md](./phase/PHASE_4_COMPLETE.md) - Phase 4 details
- [SKILLS_MANAGEMENT_SPEC.md](./SKILLS_MANAGEMENT_SPEC.md) - Skills management specification

---

**Last Updated:** February 7, 2026
