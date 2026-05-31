# Portfolio Website - Documentation

## 📋 Overview

Portfolio website untuk Raffael Jonathan N.H - Fullstack Web Developer dengan fitur admin panel untuk manage projects, work experience, dan skills secara dinamis.

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion, GSAP (via React Bits), CSS Animations
- **Loading**: Custom fullscreen CSS loader via `GlobalLoader`
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (untuk admin panel)
- **Email**: Nodemailer
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Deployment**: Vercel

## 📁 Project Structure

```
portfolio-web/
├── app/
│   ├── (public)/              # Public routes (homepage, etc)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   └── components/        # Public components
│   │       ├── Hero.tsx
│   │       ├── Services.tsx
│   │       ├── Projects.tsx
│   │       ├── WorkExperience.tsx
│   │       ├── Skills.tsx
│   │       ├── About.tsx
│   │       └── Contact.tsx
│   │
│   ├── admin/                # Admin panel (configurable route)
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Admin dashboard
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx       # List projects
│   │   │   ├── new/
│   │   │   │   └── page.tsx   # Create project
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx # Edit project
│   │   └── experience/
│   │       ├── page.tsx       # List experience
│   │       ├── new/
│   │       │   └── page.tsx   # Create experience
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx # Edit experience
│   │   └── skills/
│   │       ├── page.tsx       # List skills (grid/table view)
│   │       ├── new/
│   │       │   └── page.tsx   # Create skill (Devicon Picker)
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx # Edit skill
│   │
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts       # Send email endpoint
│   │   ├── projects/
│   │   │   └── route.ts       # CRUD projects
│   │   └── experience/
│   │       └── route.ts       # CRUD experience
│   │
│   ├── layout.tsx             # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Modal.tsx
│   └── shared/                # Shared components
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client (browser)
│   │   ├── server.ts          # Supabase server client
│   │   └── admin.ts           # Supabase admin client
│   ├── email.ts               # Email service
│   ├── auth.ts                # Auth helpers
│   └── utils.ts               # Utility functions
│
├── types/
│   ├── database.types.ts      # Supabase generated types
│   ├── project.ts
│   ├── experience.ts
│   └── skill.ts               # Skill types (NEW)
│
├── hooks/
│   ├── useProjects.ts
│   └── useExperience.ts
│
├── public/
│   └── images/                # Static images
│
├── .env.local                 # Environment variables (not committed)
├── .env.example               # Example env file
├── supabase-schema.sql        # Database schema
└── README.md
```

## 🗄 Database Schema

### Tables

#### 1. projects

```sql
- id (uuid, primary key)
- title (text)
- slug (text, unique)
- description (text)
- problem (text)
- solution (text)
- impact (text)
- technologies (text[])
- image_url (text)
- project_url (text, nullable)
- github_url (text, nullable)
- featured (boolean, default: false)
- order_index (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 2. work_experience

```sql
- id (uuid, primary key)
- company (text)
- position (text)
- description (text)
- logo_url (text, nullable)      -- Company logo URL
- employment_type (text, nullable) -- Full-time, Part-time, Internship, etc.
- start_date (date)
- end_date (date, nullable)
- is_current (boolean, default: false)
- order_index (integer)
- created_at (timestamp)
- updated_at (timestamp)
```

#### 3. skills

```sql
- id (uuid, primary key)
- name (text)
- category (text, check: frontend/backend/tools/others)
- icon (text, nullable)         -- Devicon class
- icon_svg (text, nullable)      -- SVG URL
- order_index (integer, default: 0)
- is_visible (boolean, default: true)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🚀 Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd portfolio-web
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase](https://supabase.com)
2. Copy URL dan Anon Key dari Project Settings > API
3. Jalankan SQL schema dari file `supabase-schema.sql` di SQL Editor
4. Setup Authentication:
   - Enable Email provider di Authentication > Providers
   - Buat user admin pertama di Authentication > Users

### 3. Setup Environment Variables

Copy `.env.example` ke `.env.local` dan isi dengan nilai yang sesuai:

```bash
cp .env.example .env.local
```

**Isi variabel berikut:**

- `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key dari Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (untuk admin operations)
- `EMAIL_USER`: Email Gmail Anda
- `EMAIL_PASSWORD`: App password Gmail (bukan password biasa)
- `EMAIL_TO`: Email tujuan untuk menerima contact form
- `ADMIN_ROUTE_SECRET`: Nama route untuk admin panel (default: `admin`, HARUS sama dengan nama folder di `app/`)
- `ADMIN_PASSWORD_HASH`: Bcrypt hash dari password admin

**Important:** Nilai `ADMIN_ROUTE_SECRET` HARUS sama dengan nama folder. Default adalah `admin`. Untuk keamanan lebih baik, rename folder `app/admin/` ke nama unik dan update env variable ini.

**Generate password hash:**

```bash
node -e "console.log(require('bcrypt').hashSync('your_password', 10))"
```

### 4. Setup Gmail App Password

1. Buka Google Account Settings
2. Security > 2-Step Verification (harus aktif)
3. App passwords > Generate new
4. Copy password dan masukkan ke `EMAIL_PASSWORD`

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Admin panel: `http://localhost:3000/admin` (atau route yang Anda konfigurasi)

## 🔐 Authentication Flow

### Admin Panel Access

1. User mengakses route admin (default: `/admin`, dikonfigurasi via `ADMIN_ROUTE_SECRET`)
2. Jika belum login, redirect ke `/admin/login` (atau route yang dikonfigurasi)
3. Login menggunakan Supabase Auth (email + password)
4. Setelah login, dapat manage projects dan experience
5. Session disimpan di Supabase (auto refresh)

**Note:** Folder fisik di `app/admin/` HARUS sama dengan nilai `ADMIN_ROUTE_SECRET`.

### Middleware Protection

Middleware akan:

- Check apakah route adalah admin route
- Verify Supabase session
- Redirect ke login jika tidak authenticated
- Allow access jika authenticated

## 📧 Contact Form Flow

1. User mengisi form di homepage
2. Form submit ke `/api/contact`
3. API route validate data dengan Zod
4. Kirim email menggunakan Nodemailer
5. Return success/error response
6. Show toast notification ke user

## 🎨 Styling Guidelines

### Tailwind Configuration

Menggunakan custom theme yang match dengan referensi website:

```js
// tailwind.config.ts
colors: {
  primary: '#...',    // Main brand color
  secondary: '#...',
  accent: '#...',
}
```

### Dark Mode

- Menggunakan `next-themes` untuk dark mode toggle
- Class-based dark mode (`dark:`)
- **Default theme: Dark mode** untuk semua pengguna baru
- Persist preference di localStorage (`portfolio-theme` key)
- Manual control (tidak mengikuti system preference)

## 🔄 Data Fetching Strategy

### Public Pages (Server Components)

- Fetch data di server component
- Use Supabase server client
- Cache dengan Next.js cache
- Revalidate on-demand atau time-based

### Admin Panel (Client Components)

- Use React hooks untuk CRUD operations
- Optimistic updates untuk better UX
- Loading states dan error handling

## 📝 Content Management

### Adding New Project

1. Login ke admin panel
2. Navigate ke Projects
3. Click "Add New Project"
4. Fill form:
   - Title, description
   - Problem, solution, impact
   - Technologies (multiple select with Devicon icons)
   - Upload images via ImageKit (drag & drop, max 10)
   - Set featured status
   - Set order
5. Save

**Image Management:**

- Images uploaded to ImageKit.io CDN
- Each image stored with URL and fileId
- Delete button removes from both form and CDN
- Public display uses ImageCarousel for multiple images

### Adding Work Experience

1. Login ke admin panel
2. Navigate ke Experience
3. Click "Add New Experience"
4. Fill form:
   - Company, position
   - Description
   - Upload company logo via ImageKit
   - Start date, end date
   - Check "Current" if still working
   - Set order
5. Save

## 🚢 Deployment

### Deploy to Vercel

1. Push code ke GitHub
2. Import project di Vercel
3. Add environment variables di Vercel dashboard
4. Deploy

**Environment Variables di Vercel:**

- Semua variable dari `.env.local`
- Set `NEXT_PUBLIC_SITE_URL` ke production URL

### Post-Deployment

1. Update Supabase redirect URLs:
   - Authentication > URL Configuration
   - Add production URL
2. Test contact form
3. Test admin login
4. Verify all features

## 🧪 Testing Checklist

### Public Website

- [ ] Homepage loads correctly
- [ ] All sections visible
- [ ] Projects display from database
- [ ] Work experience display from database
- [ ] Contact form sends email
- [ ] Dark mode toggle works
- [ ] Responsive on mobile
- [ ] Smooth animations

### Admin Panel

- [ ] Login works
- [ ] Can create project
- [ ] Can edit project
- [ ] Can delete project
- [ ] Can reorder projects
- [ ] Can create experience
- [ ] Can edit experience
- [ ] Can delete experience
- [ ] Logout works
- [ ] Protected routes work

## 🔧 Common Issues & Solutions

### Issue: Email not sending

**Solution:**

- Check Gmail app password
- Enable "Less secure app access" if needed
- Verify SMTP settings

### Issue: Supabase connection error

**Solution:**

- Verify URL and keys in `.env.local`
- Check Supabase project status
- Verify RLS policies

### Issue: Admin route not working

**Solution:**

- Check `ADMIN_ROUTE_SECRET` matches folder name in `app/`
- Clear browser cache
- Verify middleware configuration

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Support

Jika ada pertanyaan atau issue, silakan hubungi:

- Email: jonathanraffael098@gmail.com
- LinkedIn: [Connect on LinkedIn](https://linkedin.com/in/raffaeljonathan)

---

**Last Updated:** January 2026
**Version:** 1.0.0
