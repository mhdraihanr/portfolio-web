# ⚡ Quick Start Guide

Panduan cepat untuk mulai development dalam 10 menit.

## 🎯 Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ Text editor (VS Code recommended)

## 🚀 Setup Environment (20-30 Minutes)

**Important:** Admin panel belum dibuat! Setup ini hanya untuk environment saja.

### 1. Install Dependencies (1 min)

```bash
cd portfolio-web
pnpm install
```

### 2. Setup Supabase (15 min)

#### 2.1 Create Supabase Project

1. Buka [https://supabase.com](https://supabase.com)
2. Sign up atau login
3. Click **"New Project"**
4. Isi form:
   - **Name**: `portfolio-web` (atau nama lain)
   - **Database Password**: Buat password kuat (SIMPAN!)
   - **Region**: Singapore (terdekat untuk Indonesia)
5. Click **"Create new project"**
6. Tunggu ~2 menit sampai ready

#### 2.2 Get API Keys

1. Di Supabase dashboard, buka **Settings** (icon gear)
2. Click **API** di sidebar
3. Copy dan simpan:
   - ✅ **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - ✅ **anon public** key (key panjang)
   - ✅ **service_role** key (RAHASIA!)

#### 2.3 Run Database Schema

1. Di Supabase dashboard, buka **SQL Editor**
2. Click **"New query"**
3. Buka file `supabase-schema.sql` dari project ini
4. Copy SEMUA isi file
5. Paste ke SQL Editor
6. Click **"Run"** (atau Ctrl/Cmd + Enter)
7. Pastikan muncul "Success. No rows returned"

#### 2.4 Create Admin User

1. Di Supabase dashboard, buka **Authentication** > **Users**
2. Click **"Add user"** > **"Create new user"**
3. Isi:
   - **Email**: Email Anda (contoh: `admin@example.com`)
   - **Password**: Password kuat (SIMPAN!)
   - **Auto Confirm User**: ✅ Check ini
4. Click **"Create user"**

### 3. Configure Environment Variables (5 min)

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` dan isi:

```env
# Supabase (dari step 2.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Route (nama route unik untuk admin panel)
ADMIN_ROUTE_SECRET=my-secret-dashboard-2024

# Email (skip dulu untuk testing)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=
# EMAIL_PASSWORD=
# EMAIL_TO=

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Test Development Server (2 min)

```bash
pnpm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

**Expected:** Homepage default Next.js muncul (belum ada content)

### 5. ✅ Admin Panel Sudah Lengkap!

**EXCELLENT NEWS:** Admin panel dengan full CRUD sudah selesai! 🎉

Yang sudah ada:

- ✅ Project structure
- ✅ Supabase connection
- ✅ Database schema
- ✅ Environment configured
- ✅ **UI Components** ⭐
- ✅ **Admin login page** ⭐
- ✅ **Admin dashboard** ⭐
- ✅ **Admin layout with sidebar** ⭐
- ✅ **Authentication flow** ⭐
- ✅ **Projects CRUD (List, Create, Edit, Delete)** 🆕
- ✅ **Experience CRUD (List, Create, Edit, Delete)** 🆕
- ✅ **Form validation with Zod** 🆕
- ✅ **Toast notifications** 🆕
- ✅ **Delete confirmations** 🆕

Yang belum ada:

- ❌ Homepage sections (Hero, Projects showcase, etc)
- ❌ Contact form

**Access admin:** Navigate to `/kingpersib/login` dan login dengan credentials Supabase Anda!

**What you can do now:**

- Create, edit, and delete projects
- Create, edit, and delete work experience
- Manage your portfolio content

**Next step:** Build Public Homepage (lihat TODO.md Phase 3)

---

## 📝 Next Steps - Start Building!

### ✅ Priority 1: UI Components (COMPLETE!)

**Location:** `components/ui/` dan `components/shared/`

Semua komponen sudah dibuat! ✅

1. **Base Components** (`components/ui/`)
   - ✅ Button (primary, secondary, outline variants)
   - ✅ Input & Textarea
   - ✅ Card
   - ✅ Modal
   - ✅ Spinner/Loading
   - ✅ Toast notification
   - ✅ Badge, Label
   - ✅ CertificateCard (for certificates section)

2. **Shared Components** (`components/shared/`)
   - ✅ Navbar (glassmorphism, centered floating)
   - ✅ Footer
   - ✅ Theme Toggle (dark mode)
   - ✅ Back to top, Container

3. **Admin Components** (`components/admin/`)
   - ✅ Sidebar with navigation
   - ✅ Header with theme toggle

**Guide:** Lihat `docs/TODO.md` Phase 2 ✅

### ✅ Priority 2: Admin Panel Complete! (100%)

**Location:** `app/kingpersib/`

Admin panel dengan full CRUD sudah selesai! ✅

**Yang sudah dibuat:**

1. **✅ Admin Login** (`app/kingpersib/login/page.tsx`)
   - Login form dengan Supabase Auth
   - Error handling dengan toast
   - Loading states
   - Redirect after login

2. **✅ Admin Layout** (`app/kingpersib/layout.tsx`)
   - Sidebar navigation (Dashboard, Projects, Experience)
   - Protected routes via middleware
   - Logout button
   - Mobile responsive dengan hamburger menu

3. **✅ Dashboard** (`app/kingpersib/page.tsx`)
   - Statistics cards (Projects, Experience, Featured, Last Updated)
   - Quick action buttons
   - Fetch data dari Supabase

4. **✅ Projects CRUD**
   - **List** (`app/kingpersib/projects/page.tsx`)
     - Card view dengan full information
     - Featured badge & technologies tags
     - Edit & Delete buttons
     - Delete confirmation modal
   - **Create** (`app/kingpersib/projects/new/page.tsx`)
     - Complete form dengan validation
     - Auto-generate slug
     - Technologies tags input
     - Toast notifications
   - **Edit** (`app/kingpersib/projects/[id]/edit/page.tsx`)
     - Pre-filled form
     - Update & Delete functionality
     - Confirmation modals

5. **✅ Experience CRUD**
   - **List** (`app/kingpersib/experience/page.tsx`)
     - Card view dengan full information
     - Current job badge
     - Date range formatting
     - Edit & Delete buttons
   - **Create** (`app/kingpersib/experience/new/page.tsx`)
     - Complete form dengan validation
     - Date pickers
     - "Is Current" checkbox
     - Toast notifications
   - **Edit** (`app/kingpersib/experience/[id]/edit/page.tsx`)
     - Pre-filled form
     - Update & Delete functionality
     - Date validation

6. **✅ Supporting Files**
   - `lib/validations/project.ts` - Zod schemas
   - `lib/validations/experience.ts` - Zod schemas
   - `lib/supabase/helpers.ts` - CRUD helpers

7. **✅ API Routes** (`app/api/auth/`)
   - `/api/auth/login` - Login endpoint
   - `/api/auth/logout` - Logout endpoint

**🎯 Access:** Navigate to `/kingpersib/login`

**What you can do:**

- ✅ Manage projects (Create, Edit, Delete)
- ✅ Manage work experience (Create, Edit, Delete)
- ✅ View dashboard statistics
- ✅ All with form validation and toast notifications

**Guide:** Lihat `docs/TODO.md` Phase 4 ✅

### 🎯 Priority 3: Public Homepage (In Progress - 67%)

**Location:** `app/(public)/`

Yang sudah dan perlu dibangun:

1. **Homepage Sections**
   - [x] Hero section ✅
   - [x] About section (with integrated skills) ✅
   - [x] Certificate section ✅
   - [x] Projects section ✅ (fetch from database)
   - [x] Work Experience section ✅ (fetch from database with modern zigzag timeline)
   - [ ] Contact form

**Guide:** Lihat `docs/TODO.md` Phase 3

### Priority 4: Build Homepage (Week 3-4) - In Progress

**Location:** `app/(public)/components/`

Build homepage sections:

1. ✅ Hero section (COMPLETE)
2. ✅ About section (with integrated skills) (COMPLETE)
3. ✅ Certificate section (COMPLETE)
4. ✅ Projects section (COMPLETE) - fetch from database with SSR
5. ✅ Work Experience section (COMPLETE) - fetch from database with modern zigzag timeline
6. ❌ Contact form

**Guide:** Lihat `docs/TODO.md` Phase 3

### Setup Email (Optional)

Untuk contact form:

1. **Enable Gmail App Password**
   - Google Account > Security > 2-Step Verification
   - App passwords > Generate
   - Copy 16-digit password

2. **Update .env.local**

   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop
   EMAIL_TO=your-email@gmail.com
   ```

3. **Test Contact Form**
   - Buka homepage
   - Scroll ke Contact section
   - Isi form dan send
   - Check email inbox

---

## 🎨 Customize Styling

### Colors

**Lokasi:** `app/globals.css` (dalam section `@theme`)

Untuk mengubah warna brand utama:

1. Buka file `app/globals.css`
2. Cari section `/* Primary Colors - Red Theme */`
3. Ganti nilai hex color sesuai brand Anda
4. Save file (auto-reload, tidak perlu restart)

**Current theme:** Red (#dc2626)

### Fonts

**Lokasi:** `app/layout.tsx`

Untuk mengubah font:

1. Import font dari Google Fonts atau custom font
2. Update variable `geistSans` atau `geistMono`
3. Font akan otomatis apply ke seluruh aplikasi

**Current fonts:** Geist Sans & Geist Mono

### Dark Mode

**Status:** ✅ Fully functional dengan Tailwind v4

Project menggunakan **class-based dark mode** yang dikontrol manual (tidak mengikuti system preference browser).

**Cara kerja:**

- Toggle button di navbar/header untuk switch theme
- Theme disimpan di localStorage (`portfolio-theme`)
- Semua komponen support dark mode via `dark:` prefix
- Konfigurasi ada di `app/globals.css` menggunakan `@variant dark`

**Untuk detail lengkap:** Lihat `docs/TAILWIND_V4.md`

**Key features:**

- ✅ Manual control (tidak auto-follow system)
- ✅ Persistent (tersimpan di localStorage)
- ✅ Smooth transitions
- ✅ All components themed
- ✅ Tailwind v4 CSS-first configuration

---

## 📚 Documentation

Dokumentasi lengkap tersedia di:

- **README.md** - Project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **DOCUMENTATION.md** - Full documentation
- **API_REFERENCE.md** - API endpoints
- **PROJECT_STRUCTURE.md** - Code organization
- **DEPLOYMENT.md** - Deploy to production

---

## 🐛 Common Issues

### Issue: "Module not found"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Supabase connection error"

- Check URL dan keys di `.env.local`
- Verify Supabase project is running
- Check RLS policies enabled

### Issue: "Admin login not working"

- Check user created in Supabase Auth
- Verify ADMIN_ROUTE_SECRET correct in `.env.local`
- Clear browser cookies and try again
- Check middleware.ts is protecting routes correctly
- Verify email/password credentials are correct
- Check browser console for API errors

---

## ✅ Development Checklist

### Phase 1: Environment Setup (Day 1) ✅ COMPLETE

- [x] Install dependencies (`npm install`)
- [x] Create Supabase account & project
- [x] Run database schema in SQL Editor
- [x] Create admin user in Supabase Auth
- [x] Copy Supabase URL & keys
- [x] Configure `.env.local`
- [x] Test `npm run dev` - homepage loads

### Phase 2: UI Components (Week 1) ✅ COMPLETE

- [x] Build base components (Button, Input, Card, etc)
- [x] Build shared components (Navbar, Footer, Theme Toggle)
- [x] Test components in isolation
- [x] Setup dark mode

### Phase 3: Admin Layout & Auth (Week 2) ✅ COMPLETE

- [x] Build admin login page
- [x] Build admin layout with sidebar
- [x] Build admin dashboard
- [x] Test admin authentication
- [x] API routes for auth (login/logout)

### Phase 4: Admin CRUD (Week 2-3) ✅ COMPLETE

- [x] Build projects CRUD pages
- [x] Build experience CRUD pages
- [x] Test CRUD operations
- [x] Form validation with Zod
- [x] Toast notifications
- [x] Delete confirmations

### Phase 5: Homepage (Week 3-4) 🎯 CURRENT

- [x] Build Hero section ✅
- [x] Build About section (with integrated skills) ✅
- [x] Build Certificate section ✅
- [x] Build Projects section (fetch from DB) ✅
- [x] Build Work Experience section (fetch from DB) ✅
- [ ] Build Contact form
- [ ] Test all sections

### Phase 5: Polish & Testing (Week 4)

- [ ] Responsive design (mobile, tablet)
- [ ] Animations (Framer Motion)
- [ ] Dark mode polish
- [ ] Test contact form email
- [ ] Test on different browsers
- [ ] Fix any bugs

### Phase 6: Deploy (Day 1)

- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Test production site
- [ ] Setup custom domain (optional)
- [ ] Monitor errors

---

## 🎯 Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types

# Database
# Run SQL in Supabase Dashboard > SQL Editor
```

---

## 📞 Need Help?

1. Check documentation files
2. Check browser console for errors
3. Check Supabase logs
4. Check Vercel deployment logs (if deployed)

---

## 🎉 Admin Panel Fully Functional!

Sekarang Anda sudah:

- ✅ Install semua dependencies
- ✅ Setup Supabase project & database
- ✅ Configure environment variables
- ✅ Run development server
- ✅ **Build UI components** ⭐
- ✅ **Build admin layout & authentication** ⭐
- ✅ **Build admin dashboard** ⭐
- ✅ **Build Projects CRUD** 🆕
- ✅ **Build Experience CRUD** 🆕

**Yang sudah bisa digunakan:**

- ✅ Admin login page (`/kingpersib/login`)
- ✅ Admin dashboard (`/kingpersib`)
- ✅ Projects management (`/kingpersib/projects`)
  - Create, Edit, Delete projects
  - Form validation
  - Technologies tags
  - Auto-generate slug
- ✅ Experience management (`/kingpersib/experience`)
  - Create, Edit, Delete work experience
  - Date pickers
  - Current job checkbox
- ✅ Sidebar navigation
- ✅ Dark mode toggle
- ✅ Mobile responsive
- ✅ Toast notifications
- ✅ Delete confirmations

**Yang belum ada (perlu dibangun):**

- ❌ Homepage sections (Projects showcase, Work Experience, Contact form)
- ✅ Hero, About, Certificate sections (COMPLETE)

**Next Step:** Build Public Homepage! (lihat TODO.md Phase 3)

**Timeline:**

- ✅ Week 1: UI Components (DONE)
- ✅ Week 2: Admin Layout & Auth (DONE)
- ✅ Week 2-3: Projects & Experience CRUD (DONE)
- 🎯 Week 3-4: Build Homepage (CURRENT)
- Week 4: Polish & Deploy

---

**Happy Coding! 🚀**
