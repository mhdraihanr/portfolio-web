# 🛠 Tech Stack

Dokumentasi lengkap tentang teknologi yang digunakan dalam project ini.

---

## 🎯 Overview

Project ini menggunakan modern web development stack dengan fokus pada:

- **Performance** - Fast loading dan smooth interactions
- **Developer Experience** - Type-safe, well-documented code
- **Scalability** - Easy to extend dan maintain
- **User Experience** - Responsive, accessible, beautiful UI

---

## 🏗️ Core Technologies

### Frontend Framework

#### Next.js 15 (App Router)

**Why Next.js?**

- ✅ Server-side rendering (SSR) untuk SEO
- ✅ Static site generation (SSG) untuk performance
- ✅ API routes untuk backend logic
- ✅ Image optimization built-in
- ✅ File-based routing
- ✅ Excellent developer experience

**Version:** 16.1.6  
**Documentation:** https://nextjs.org/docs

**Key Features Used:**

- App Router (modern routing system)
- Server Components (default)
- Client Components (interactive parts)
- API Routes (backend endpoints)
- Middleware (route protection)
- Image Optimization

### UI Library

#### React 19

**Why React?**

- ✅ Component-based architecture
- ✅ Large ecosystem
- ✅ Excellent performance
- ✅ Strong community support

**Version:** 19.2.3  
**Documentation:** https://react.dev

**Key Features Used:**

- Functional Components
- Hooks (useState, useEffect, custom hooks)
- Server Components (new in React 19)
- Suspense boundaries

**Performance Strategy:**

- Above-the-fold content is allowed to paint before non-critical WebGL startup work.
- Heavy visual components such as React Bits `LightRays` are dynamically loaded on the client.
- `About` is server-first for skills data: cached visible skills are fetched by the Server Component wrapper, and only the animated UI remains in the Client Component.
- `Certificates` remains IntersectionObserver-gated and client-only because it contains LogoLoop animation work.
- `Work Experience` keeps cached server data fetching, but the client timeline, theme hook, and React Bits `Orb` WebGL background are loaded only when the section is near the viewport.
- Next.js `experimental.optimizePackageImports` is enabled for `lucide-react` to reduce package import overhead from the icon library.
- The homepage avoids broad public-section barrel imports so the hero path does not eagerly pull unrelated section modules.
- Hero text readiness now controls the global loading signal, while `LightRays` initializes after initial paint and fades in when its first WebGL frame is ready.
- WebGL animation runtime caps DPR, uses passive listeners, pauses hidden-tab rendering, and respects `prefers-reduced-motion`.
- Shared `ScrollReveal` animations run only once on phone/mobile widths (`width <= 767px`) to avoid repeated animation work during mobile scrolling, while non-mobile widths keep the existing repeatable behavior.
- The hero title continues using `BlurText`, while surrounding content avoids being hidden behind WebGL readiness.
- Public homepage Supabase data (`Projects`, `Work Experience`, visible skills) is fetched through a server-only cached helper with 5-minute revalidation, avoiding request-cookie reads on the homepage document path and reducing TTFB/document latency.
- Public static assets such as local font files, the current profile image, and root SVGs receive explicit long-lived cache headers from `next.config.ts` to address efficient cache lifetime diagnostics.
- The About profile image is not marked as `priority`, keeping browser resource priority focused on the hero/LCP path while still using `next/image` responsive sizing.

### Language

#### TypeScript 5

**Why TypeScript?**

- ✅ Type safety
- ✅ Better IDE support
- ✅ Catch errors early
- ✅ Self-documenting code
- ✅ Easier refactoring

**Version:** 5.x  
**Documentation:** https://www.typescriptlang.org

**Configuration:**

- Strict mode enabled
- Path aliases (@/\*)
- Type checking on build

---

## 🎨 Styling

### Tailwind CSS 4

**Why Tailwind?**

- ✅ Utility-first approach
- ✅ Fast development
- ✅ Consistent design system
- ✅ Small bundle size (purged)
- ✅ Dark mode support

**Version:** 4.x  
**Documentation:** https://tailwindcss.com

**Features Used:**

- Utility classes
- Custom colors
- Dark mode (class-based)
- Custom animations
- Responsive design
- Custom plugins

**Utilities:**

- `clsx` - Conditional class names
- `tailwind-merge` - Merge Tailwind classes intelligently

### next-themes

**Why next-themes?**

- ✅ Theme persistence with localStorage
- ✅ No flash on page load
- ✅ System theme detection (optional)
- ✅ TypeScript support
- ✅ Works with any framework

**Version:** 0.4.6  
**Documentation:** https://github.com/pacocoursey/next-themes

**Configuration:**

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="dark"           // 🌙 Default to dark mode for all users
  enableSystem={false}          // Manual theme control
  storageKey="portfolio-theme"  // localStorage key
>
  {children}
</ThemeProvider>
```

**Features Used:**

- Dark/Light theme toggle
- Persists user preference in localStorage
- Default theme: **Dark mode** for first-time visitors
- Manual control (no automatic system preference)
- Theme-aware components with `useTheme` hook

---

## 🗄️ Database & Backend

### Supabase (PostgreSQL)

**Why Supabase?**

- ✅ PostgreSQL database (reliable, powerful)
- ✅ Built-in authentication
- ✅ Row Level Security (RLS)
- ✅ Real-time subscriptions
- ✅ Storage for files
- ✅ Auto-generated REST API
- ✅ Generous free tier

**Version:** Latest  
**Documentation:** https://supabase.com/docs

**Features Used:**

- PostgreSQL database
- Authentication (Email/Password)
- Row Level Security (RLS)
- Storage (for images)
- Auto-generated types

**Packages:**

- `@supabase/supabase-js` - Main client
- `@supabase/ssr` - SSR helpers for Next.js

---

## 🔐 Authentication

### Supabase Auth

**Features:**

- Email/Password authentication
- Session management
- JWT tokens
- Refresh tokens
- Protected routes via middleware

**Security:**

- Secure cookie-based sessions
- CSRF protection
- XSS protection
- Rate limiting (built-in)

---

## 📧 Email Service

### Nodemailer

**Why Nodemailer?**

- ✅ Simple to use
- ✅ Works with Gmail
- ✅ HTML email support
- ✅ Reliable

**Version:** 7.0.13  
**Documentation:** https://nodemailer.com

**Features Used:**

- SMTP transport (Gmail)
- HTML email templates
- Reply-to support
- Error handling

---

## 🖼️ Image Management

### ImageKit.io

**Why ImageKit?**

- ✅ CDN delivery (fast global loading)
- ✅ Automatic image optimization
- ✅ On-the-fly transformations
- ✅ Direct upload from browser
- ✅ Delete API for cleanup
- ✅ Generous free tier (20GB bandwidth/month)

**Version:** `@imagekit/nodejs` ^7.3.0  
**Documentation:** https://docs.imagekit.io

**Features Used:**

- Server-side authentication (secure token generation)
- Client-side upload (direct to CDN)
- File deletion via API
- URL endpoint for optimized delivery
- Folder organization (`/portfolio`)

**API Routes:**

- `GET /api/imagekit-auth` - Generate upload authentication
- `POST /api/imagekit-delete` - Delete image by fileId

**Components:**

- `ImageUploader` - Drag & drop upload with preview and delete
- `ImageCarousel` - Responsive slider with swipe and keyboard navigation

**Usage:**

- Project images (multiple, with carousel display)
- Experience logos (single image)

---

## 🎭 Animations

### Framer Motion (motion/react)

**Why Framer Motion?**

- ✅ Declarative animations
- ✅ Gesture support
- ✅ Layout animations
- ✅ Server-side rendering support
- ✅ Great performance

**Version:** 12.29.2  
**Documentation:** https://www.framer.com/motion

**Features Used:**

- Fade in/out (BlurText component)
- Page transitions
- Blur-to-focus text reveal

### React Bits (GSAP)

**Why React Bits?**

- ✅ Pre-built animation components
- ✅ GSAP-powered (industry-standard animation library)
- ✅ TypeScript support
- ✅ Optimized performance

**Components Used:**

- **SplitText**: Character & word-by-word text reveal with GSAP ScrollTrigger (About section)
- **Orb**: Animated WebGL background sphere (Experience section)
- **LogoLoop**: Infinite auto-scrolling carousel (Certificates section)
- **LightRays**: WebGL animated light rays background (Hero section)

### Custom Components

- **ScrollReveal**: IntersectionObserver-based scroll-triggered fade-up animations (all sections)
- **AnimatedShinyText**: Shimmer text effect (Hero section)
- **GlobalLoader**: Lightweight fullscreen CSS loader for WebGL preparation states

### Global Loader

**Why custom GlobalLoader?**

- ✅ No external loading dependency
- ✅ Lightweight CSS-only animation
- ✅ Theme-adaptive colors
- ✅ Keeps accessible status label without visible text

**Usage:** Fullscreen global page loading overlay while initial visual effects such as WebGL backgrounds are prepared

---

## 🎨 Icons

### Lucide React

**Why Lucide?**

- ✅ Beautiful, consistent icons
- ✅ Tree-shakeable (small bundle)
- ✅ TypeScript support
- ✅ Customizable

**Version:** 0.563.0  
**Documentation:** https://lucide.dev

**Usage:**

```tsx
import { Mail, Github, Linkedin } from "lucide-react";

<Mail className="w-5 h-5" />;
```

---

## 📝 Forms & Validation

### React Hook Form

**Why React Hook Form?**

- ✅ Performant (minimal re-renders)
- ✅ Easy to use
- ✅ TypeScript support
- ✅ Built-in validation
- ✅ Small bundle size

**Version:** 7.71.1  
**Documentation:** https://react-hook-form.com

### Zod

**Why Zod?**

- ✅ TypeScript-first schema validation
- ✅ Type inference
- ✅ Composable schemas
- ✅ Great error messages

**Version:** 4.3.6  
**Documentation:** https://zod.dev

**Usage:**

```typescript
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
```

---

## 🚀 Deployment

### Vercel (Recommended)

**Why Vercel?**

- ✅ Made by Next.js creators
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Edge network (fast globally)
- ✅ Preview deployments
- ✅ Generous free tier

**Documentation:** https://vercel.com/docs

**Features:**

- Git integration
- Environment variables
- Analytics
- Automatic scaling
- Edge functions

### Alternative: Netlify

**Documentation:** https://docs.netlify.com

### Alternative: VPS (Self-hosted)

**Requirements:**

- Node.js 18+
- PM2 (process manager)
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

---

## 🛠️ Development Tools

### Package Manager

#### npm

**Version:** Latest  
**Why npm?** Comes with Node.js, widely used, reliable

**Commands:**

```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

### Linting & Formatting

#### ESLint

**Why ESLint?**

- ✅ Catch errors early
- ✅ Enforce code style
- ✅ Customizable rules

**Version:** 9.x  
**Configuration:** `eslint.config.mjs`

#### Prettier (Recommended)

**Why Prettier?**

- ✅ Consistent code formatting
- ✅ No configuration needed
- ✅ Integrates with ESLint

**Install:**

```bash
npm install -D prettier
```

### Git

**Version Control:** Git + GitHub  
**Branching Strategy:** Feature branches  
**Commit Convention:** Conventional Commits

---

## 📦 Dependencies Summary

### Production Dependencies

| Package               | Version | Purpose         |
| --------------------- | ------- | --------------- |
| next                  | 16.1.6  | Framework       |
| react                 | 19.2.3  | UI library      |
| react-dom             | 19.2.3  | React DOM       |
| @supabase/supabase-js | 2.93.3  | Database client |
| @supabase/ssr         | 0.8.0   | SSR helpers     |
| framer-motion         | 12.29.2 | Animations      |
| lucide-react          | 0.563.0 | Icons           |
| react-hook-form       | 7.71.1  | Form management |
| zod                   | 4.3.6   | Validation      |
| @hookform/resolvers   | 5.2.2   | Form resolvers  |
| nodemailer            | 7.0.13  | Email           |
| next-themes           | 0.4.6   | Theme system    |
| clsx                  | 2.1.1   | Class utility   |
| tailwind-merge        | 3.4.0   | Class merger    |

### Development Dependencies

| Package              | Version | Purpose          |
| -------------------- | ------- | ---------------- |
| typescript           | 5.x     | Language         |
| @types/node          | 20.x    | Node types       |
| @types/react         | 19.x    | React types      |
| @types/react-dom     | 19.x    | React DOM types  |
| @types/nodemailer    | 7.0.9   | Nodemailer types |
| tailwindcss          | 4.x     | CSS framework    |
| @tailwindcss/postcss | 4.x     | PostCSS plugin   |
| eslint               | 9.x     | Linter           |
| eslint-config-next   | 16.1.6  | Next.js ESLint   |

**Total:** 26 packages  
**Bundle Size:** ~500KB (gzipped, estimated)

---

## 🔄 Data Flow Architecture

### Client-Side Rendering (CSR)

```
User Action → React Component → Supabase Client → Database → Update State → Re-render
```

### Server-Side Rendering (SSR)

```
Request → Next.js Server → Supabase Server Client → Database → Render HTML → Response
```

### API Routes

```
Client Request → API Route → Validate (Zod) → Supabase → Database → JSON Response
```

---

## 🎯 Performance Optimizations

### Next.js Features

- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization (Geist Sans & Mono)
- ✅ Static generation where possible
- ✅ Incremental static regeneration

### React Optimizations

- ✅ Server Components (default)
- ✅ Client Components only when needed
- ✅ Lazy loading with dynamic imports
- ✅ Memoization (useMemo, useCallback)

### Tailwind Optimizations

- ✅ Purge unused CSS
- ✅ JIT mode
- ✅ Minimal runtime

### Database Optimizations

- ✅ Indexes on frequently queried columns
- ✅ RLS policies for security
- ✅ Connection pooling (Supabase)

---

## 🔐 Security Features

### Next.js Security

- ✅ CSRF protection
- ✅ XSS protection
- ✅ Content Security Policy (CSP)
- ✅ Secure headers

### Supabase Security

- ✅ Row Level Security (RLS)
- ✅ JWT authentication
- ✅ Encrypted connections
- ✅ Automatic SQL injection prevention

### Application Security

- ✅ Environment variables for secrets
- ✅ Input validation (Zod)
- ✅ Middleware route protection
- ✅ HTTPS in production

---

## 📊 Browser Support

### Supported Browsers

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

### Polyfills

Next.js includes necessary polyfills automatically.

---

## 🌐 Hosting & Infrastructure

### Recommended Stack

**Frontend & API:**

- Vercel (Next.js hosting)
- Edge Network (global CDN)
- Automatic HTTPS

**Database & Auth:**

- Supabase (PostgreSQL)
- Global distribution
- Automatic backups

**Email:**

- Gmail SMTP (free for low volume)
- Alternative: SendGrid, Mailgun

**Images:**

- Supabase Storage
- Next.js Image Optimization
- Vercel CDN

---

## 📈 Scalability

### Current Limits (Free Tier)

**Vercel:**

- 100GB bandwidth/month
- 100 deployments/day
- Unlimited projects

**Supabase:**

- 500MB database
- 1GB storage
- 50,000 monthly active users
- 2GB bandwidth

### Scaling Strategy

**When to upgrade:**

- > 10,000 visitors/month → Vercel Pro
- > 100,000 visitors/month → Enterprise
- Database > 500MB → Supabase Pro
- Need more features → Paid plans

---

## 🔮 Future Considerations

### Potential Additions

**Analytics:**

- Vercel Analytics (built-in)
- Google Analytics 4
- Plausible (privacy-focused)

**Error Tracking:**

- Sentry
- LogRocket

**Testing:**

- Jest (unit tests)
- React Testing Library
- Playwright (E2E tests)

**CMS (Optional):**

- Sanity
- Contentful
- Strapi

---

## 📚 Learning Resources

### Official Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Tutorials

- [Next.js Learn](https://nextjs.org/learn)
- [React Tutorial](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook)
- [Tailwind Play](https://play.tailwindcss.com)

### Community

- [Next.js Discord](https://nextjs.org/discord)
- [React Discord](https://discord.gg/react)
- [Supabase Discord](https://discord.supabase.com)

---

## 🎓 Best Practices

### Code Organization

- ✅ Feature-based folder structure
- ✅ Separate concerns (UI, logic, data)
- ✅ Reusable components
- ✅ Type-safe code

### Performance

- ✅ Server Components by default
- ✅ Optimize images
- ✅ Minimize client-side JavaScript
- ✅ Code splitting

### Security

- ✅ Never commit secrets
- ✅ Validate all inputs
- ✅ Use environment variables
- ✅ Keep dependencies updated

### Accessibility

- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Color contrast

---

**Last Updated:** January 31, 2026  
**Stack Version:** 1.0.0
