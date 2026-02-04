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

## 🎭 Animations

### Framer Motion

**Why Framer Motion?**

- ✅ Declarative animations
- ✅ Gesture support
- ✅ Layout animations
- ✅ Server-side rendering support
- ✅ Great performance

**Version:** 12.29.2  
**Documentation:** https://www.framer.com/motion

**Features Used:**

- Fade in/out
- Slide animations
- Scroll-triggered animations
- Page transitions
- Gesture animations

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

**Total:** 24 packages  
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
