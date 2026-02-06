# Portfolio Website - Raffael Jonathan N.H

Modern portfolio website dengan admin panel untuk manage projects dan work experience secara dinamis.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)

## ✨ Features

### Public Website

- 🎨 Modern, responsive design dengan dark mode
- ⚡ Fast performance dengan Next.js 15 App Router
- 🎭 Smooth animations (Framer Motion + GSAP via React Bits)
- 🔄 Global loading state dengan page transitions
- 📱 Mobile-first responsive design
- 📧 Contact form dengan email integration
- 🔍 SEO optimized

### Admin Panel ✅

- 🔐 Secure authentication dengan Supabase ✅
- 📊 Full Projects CRUD operations ✅
  - Create, edit, delete projects
  - Auto-generate slug from title
  - Technologies tags input
  - Form validation with Zod
  - Delete confirmations
- 💼 Full Experience CRUD operations ✅
  - Create, edit, delete work experience
  - Date pickers with validation
  - Current job checkbox
  - Date range formatting
- 🎯 Featured projects toggle ✅
- 📱 Mobile responsive design ✅
- 🌙 Dark mode support ✅
- 🔔 Toast notifications ✅
- 🖼️ Image URL support ✅
- 📝 Rich text editing (future enhancement)
- 🔢 Drag & drop reordering (future enhancement)

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion, GSAP (React Bits), CSS Animations
- **Loading**: react-loading-indicators
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Nodemailer
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase account
- Gmail account (untuk contact form)

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd portfolio-web
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` dengan credentials Anda:

- Supabase URL dan keys
- Gmail credentials
- Admin route secret
- Admin password hash

4. **Setup Supabase database**

- Buat project baru di [Supabase](https://supabase.com)
- Jalankan SQL dari `supabase-schema.sql` di SQL Editor
- Setup Authentication provider (Email)
- Buat user admin pertama

5. **Run development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

Admin panel: `http://localhost:3000/[ADMIN_ROUTE_SECRET]`

## 📖 Documentation

Dokumentasi lengkap tersedia di [DOCUMENTATION.md](./DOCUMENTATION.md)

Dokumentasi mencakup:

- Project structure detail
- Database schema
- Setup instructions
- Authentication flow
- API endpoints
- Deployment guide
- Troubleshooting

## 🗄 Database Schema

### Tables

**projects**

- Project portfolio dengan detail problem, solution, impact
- Technologies stack
- Featured flag
- Order index untuk sorting

**work_experience**

- Company dan position
- Start/end date
- Current job flag
- Order index untuk sorting

Detail schema: lihat `supabase-schema.sql`

## 🔐 Admin Panel

Admin panel menggunakan route unik (bukan `/admin`) untuk security.

**Access:**

```
http://localhost:3000/[ADMIN_ROUTE_SECRET]
```

**Features:**

- Dashboard overview
- Projects management (Create, Read, Update, Delete)
- Work experience management (CRUD)
- Image upload
- Reorder items
- Preview changes

## 📧 Contact Form

Contact form terintegrasi dengan email menggunakan Nodemailer.

**Setup Gmail:**

1. Enable 2-Step Verification
2. Generate App Password
3. Add ke `.env.local`

Form akan send email ke address yang ditentukan di `EMAIL_TO`.

## 🎨 Customization

### Colors & Theme

Edit `tailwind.config.ts`:

```ts
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  // ...
}
```

### Content

**Static content:**

- Edit components di `app/(public)/components/`
- Update text, images, links

**Dynamic content:**

- Login ke admin panel
- Manage via UI

## 🚢 Deployment

### Deploy to Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

**Post-deployment:**

- Update Supabase redirect URLs
- Update `NEXT_PUBLIC_SITE_URL`
- Test all features

### Environment Variables (Vercel)

Add semua variables dari `.env.local` ke Vercel dashboard:

- Supabase credentials
- Email credentials
- Admin secrets

## 📝 Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

## 🧪 Testing

Checklist sebelum deploy:

- [ ] Homepage loads
- [ ] Projects display correctly
- [ ] Work experience display correctly
- [ ] Contact form sends email
- [ ] Dark mode works
- [ ] Admin login works
- [ ] Can create/edit/delete projects
- [ ] Can create/edit/delete experience
- [ ] Responsive on mobile
- [ ] Images load correctly

## 🤝 Contributing

Ini adalah personal portfolio project. Jika Anda ingin menggunakan sebagai template:

1. Fork repository
2. Update content dengan data Anda
3. Update environment variables
4. Deploy

## 📄 License

MIT License - feel free to use this as template untuk portfolio Anda sendiri.

## 📞 Contact

**Raffael Jonathan N.H**

- Email: jonathanraffael098@gmail.com
- LinkedIn: [linkedin.com/in/raffaeljonathan](https://linkedin.com/in/raffaeljonathan)
- Website: [raffaeljonathan.vercel.app](https://raffaeljonathan.vercel.app)

## 🙏 Acknowledgments

- Design inspired by modern portfolio websites
- Built with Next.js, Supabase, and Tailwind CSS
- Icons by Lucide React

---

**Built with ❤️ by Raffael Jonathan**
