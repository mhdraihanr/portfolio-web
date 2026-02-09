# Project Structure

Dokumentasi lengkap tentang struktur folder dan file dalam project portfolio website.

## 📁 Root Directory

```
portfolio-web/
├── app/                      # Next.js App Router
├── components/               # Reusable React components
├── contexts/                 # React Context providers
├── lib/                      # Utility functions & configurations
├── types/                    # TypeScript type definitions
├── hooks/                    # Custom React hooks
├── public/                   # Static assets
├── docs/                     # Documentation files
│   ├── README.md            # Project overview
│   ├── GETTING_STARTED.md   # Getting started guide
│   ├── QUICK_START.md       # Quick start guide
│   ├── SETUP_GUIDE.md       # Setup instructions
│   ├── DOCUMENTATION.md     # Full documentation
│   ├── PROJECT_STRUCTURE.md # This file
│   ├── PROJECT_SUMMARY.md   # Setup summary
│   ├── TECH_STACK.md        # Technologies used
│   ├── API_REFERENCE.md     # API documentation
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── TODO.md              # Task list
│   ├── CONTRIBUTING.md      # Contribution guidelines
│   └── INDEX.md             # Documentation index
├── .env.local               # Environment variables (not committed)
├── .env.example             # Example environment variables
├── .gitignore               # Git ignore rules
├── middleware.ts            # Next.js middleware
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── supabase-schema.sql      # Database schema
├── README.md                # Project overview
├── DOCUMENTATION.md         # Full documentation
├── SETUP_GUIDE.md           # Setup instructions
├── DEPLOYMENT.md            # Deployment guide
├── API_REFERENCE.md         # API documentation
└── PROJECT_STRUCTURE.md     # This file
```

---

## 📂 Detailed Structure

### `/app` - Next.js App Router

Main application directory menggunakan Next.js 15 App Router.

```
app/
├── (public)/                    # Public routes group
│   ├── layout.tsx              # Public layout with Navbar, Footer
│   ├── page.tsx                # Homepage
│   └── components/             # Public page components
│       ├── hero.tsx            # Hero section ✅
│       ├── about.tsx           # About section (with integrated skills) ✅
│       ├── certificates.tsx    # Certificates section ✅
│       ├── projects.tsx        # Projects showcase ✅
│       ├── WorkExperience.tsx  # Work experience section
│       └── Contact.tsx         # Contact form
│
├── projects/                    # Project pages (outside public group)
│   ├── layout.tsx              # Projects layout (Footer, BackToTop, Loading) ✅
│   ├── page.tsx                # All Projects page ✅ NEW
│   └── [slug]/                 # Dynamic project detail route
│       └── page.tsx            # Project detail page ✅
│
├── [ADMIN_ROUTE]/              # Admin panel (dynamic route)
│   ├── layout.tsx              # Admin layout
│   ├── page.tsx                # Admin dashboard
│   ├── login/                  # Login page
│   │   └── page.tsx
│   ├── projects/               # Projects management
│   │   ├── page.tsx            # List all projects
│   │   ├── new/
│   │   │   └── page.tsx        # Create new project
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx    # Edit project
│   └── experience/             # Experience management
│       ├── page.tsx            # List all experience
│       ├── new/
│       │   └── page.tsx        # Create new experience
│       └── [id]/
│           └── edit/
│               └── page.tsx    # Edit experience
│   └── skills/                 # Skills management ✅ NEW
│       ├── page.tsx            # List all skills (grid/table view)
│       ├── new/
│       │   └── page.tsx        # Create new skill (with Devicon Picker)
│       └── [id]/
│           └── edit/
│               └── page.tsx    # Edit skill
│
├── api/                        # API routes
│   ├── contact/
│   │   └── route.ts           # POST - Send contact email
│   ├── imagekit-auth/
│   │   └── route.ts           # GET - ImageKit authentication ✅ NEW
│   ├── imagekit-delete/
│   │   └── route.ts           # POST - Delete image from ImageKit ✅ NEW
│   ├── projects/
│   │   └── route.ts           # GET, POST - CRUD projects
│   └── experience/
│       └── route.ts           # GET, POST - CRUD experience
│
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
└── favicon.ico                 # Site favicon
```

**Key Files:**

#### `app/layout.tsx`

Root layout untuk seluruh aplikasi. Contains:

- HTML structure
- Font imports (Geist Sans & Mono)
- Theme provider
- Global metadata

#### `app/(public)/page.tsx`

Homepage dengan semua sections:

- Hero ✅
- About (with integrated skills) ✅
- Certificates ✅
- Projects ✅ (fetch dari database, links to detail pages)
- Work Experience (fetch dari database)
- Contact

#### `app/projects/layout.tsx` ✅

Shared layout untuk semua project pages (All Projects & Detail):

- Tidak menggunakan Navbar (clean, focused view)
- Footer tetap ditampilkan
- BackToTop button
- PageLoadingProvider with Atom spinner
- Shared across `/projects` and `/projects/[slug]`

#### `app/projects/page.tsx` ✅ NEW

All Projects page — menampilkan seluruh project:

- Server component dengan SSR
- Fetch ALL projects dari Supabase (tidak hanya featured)
- Grid layout 2 kolom (responsive)
- Same card style as homepage featured projects
- ScrollReveal animations (staggered)
- Back to Home button
- Technology badges with icons
- Hover overlay with "See Details" button
- Linked from "View All Projects" di homepage
- Metadata for SEO (title, description)

#### `app/projects/[slug]/page.tsx` ✅

Dynamic project detail page:

- Server component dengan SSR
- Fetch project by slug dari Supabase
- Display full project information (title, description, image, technologies, problem, solution, impact)
- Action buttons (GitHub, Live Site)
- Back navigation ke all projects page
- Not found handling (404)
- Light & dark mode support

#### `app/[ADMIN_ROUTE]/layout.tsx`

Admin layout dengan:

- Sidebar navigation
- User info
- Logout button
- Protected route wrapper

#### `app/api/*/route.ts`

API route handlers dengan:

- Request validation (Zod)
- Database operations (Supabase)
- Error handling
- Response formatting

---

### `/components` - Reusable Components

Komponen React yang bisa digunakan di berbagai tempat.

```
components/
├── ui/                         # Base UI components
│   ├── Button.tsx             # Button component
│   ├── Card.tsx               # Card component
│   ├── certificate-card.tsx   # Certificate card component ✅
│   ├── image-carousel.tsx     # Multi-image carousel with swipe ✅ NEW
│   ├── image-uploader.tsx     # ImageKit upload with delete ✅ NEW
│   ├── Input.tsx              # Input field
│   ├── Textarea.tsx           # Textarea field
│   ├── Select.tsx             # Select dropdown
│   ├── Modal.tsx              # Modal dialog
│   ├── Toast.tsx              # Toast notification
│   ├── Spinner.tsx            # Loading spinner
│   ├── Badge.tsx              # Badge component
│   └── animated-shiny-text.tsx # Shimmer text animation (Magic UI) ✅
│
├── admin/                      # Admin panel components
│   ├── sidebar.tsx            # Sidebar navigation
│   ├── header.tsx             # Page header
│   ├── devicon-picker.tsx     # Devicon icon picker (search & select) ✅ NEW
│   ├── technology-input.tsx   # Technology input with icon picker for projects ✅ NEW
│   └── index.ts               # Exports
│
├── BlurText.tsx               # Blur-to-focus text animation (React Bits) ✅
├── SplitText.tsx              # Character/word reveal animation (React Bits) ✅
├── LightRays.tsx              # WebGL light rays background (OGL) ✅
├── LightRays.jsx              # LightRays implementation ✅
├── LogoLoop.tsx               # Infinite scroll carousel (React Bits) ✅
├── LogoLoop.jsx               # LogoLoop implementation ✅
├── Orb.tsx                    # Animated orb background ✅
│
└── shared/                     # Shared components
    ├── Navbar.tsx             # Navigation bar with loading sync ✅
    ├── Footer.tsx             # Footer
    ├── ThemeToggle.tsx        # Dark mode toggle
    ├── BackToTop.tsx          # Back to top button
    └── scroll-reveal.tsx      # Scroll-triggered fade animations ✅
```

**Component Guidelines:**

- Semua components menggunakan TypeScript
- Props interface di-export untuk reusability
- Styling dengan Tailwind CSS
- Support dark mode via `dark:` classes
- Accessible (ARIA labels, keyboard navigation)

**Special Components:**

- **ImageUploader.tsx**: ImageKit.io integration for file uploads. Supports drag & drop, multiple images (max 10), progress indicator, and delete functionality. Tracks both URL and fileId for each image to enable deletion from ImageKit CDN. Used in admin panel for Projects (multiple images) and Experience (logo).

- **ImageCarousel.tsx**: Responsive image carousel/slider for displaying multiple images. Features touch/swipe support for mobile, keyboard navigation (Arrow keys), thumbnail indicators with active state, image counter badge, and hover-reveal navigation buttons on desktop. Backwards compatible with both `string[]` and `{url, fileId}[]` formats. Single images render without carousel controls. Used in project detail pages.

- **BlurText.tsx**: Framer Motion-based blur-to-focus text animation. Supports word-by-word or letter-by-letter animation from top/bottom. Uses IntersectionObserver for bidirectional viewport detection - animates in when entering and reverses when exiting. Used in Hero section for main title.

- **SplitText.tsx**: GSAP-powered text animation with split reveal. Supports chars/words/lines split types with customizable from/to states. New `repeatable` prop enables bidirectional animations via GSAP ScrollTrigger toggleActions. When `repeatable={true}`, animations reverse on scroll out. Used in About section for name (chars) and bio paragraphs (words) with repeatable enabled.

- **AnimatedShinyText**: Shimmer/shine text effect from Magic UI. Used in Hero section for greeting text. Configurable shimmer width.

- **LightRays**: WebGL-powered animated light rays background using OGL library. Supports mouse following, customizable colors, speed, and spread. Used in Hero section background.

- **Orb**: Animated gradient orb background effect. Used in Experience section.

- **ScrollReveal**: Intersection Observer-based bidirectional scroll animation wrapper. Animates elements IN when entering viewport and OUT when leaving. Supports configurable direction (up/down/left/right), delay, duration, distance, and threshold. Includes prefers-reduced-motion support for accessibility. By default animations repeat on every scroll, but can be set to `once={true}` for one-time animations. Used across all sections for dynamic content reveal.

- **certificate-card.tsx**: Fixed-height (340px) card for displaying certificates with gradient header, icon, title, provider, issue date badge, description, and "View Details" link. Designed for consistent display in infinite scroll carousel.

- **LogoLoop**: Infinite scroll carousel component from React Bits. Used for certificates section with pause-on-hover functionality. Includes TypeScript wrapper (LogoLoop.tsx) with SSR disabled and type definitions.

**Example Component Structure:**

```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-white hover:bg-primary/90": variant === "primary",
            "bg-secondary text-white hover:bg-secondary/90":
              variant === "secondary",
            // ... other variants
          },
          {
            "h-9 px-4 text-sm": size === "sm",
            "h-10 px-6 text-base": size === "md",
            "h-12 px-8 text-lg": size === "lg",
          },
          className,
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  },
);

Button.displayName = "Button";
```

---

### `/contexts` - React Context Providers

Global state management menggunakan React Context.

```
contexts/
└── PageLoadingContext.tsx      # Global loading state management ✅
```

**PageLoadingContext:**

- Manages global page loading state across all routes
- Provides `isLoading` state and `setPageReady()` function
- Used in layouts to show fullscreen Atom spinner during page initialization
- Automatic fallback timeout (3 seconds) if setPageReady() not called
- Syncs with LightRays background rendering in Hero section
- Controls navbar visibility (hidden during loading)

**Usage Example:**

```tsx
import { usePageLoading } from "@/contexts/PageLoadingContext";

function MyComponent() {
  const { isLoading, setPageReady } = usePageLoading();

  useEffect(() => {
    // Signal that component is ready
    setPageReady();
  }, []);

  return <div>{isLoading ? "Loading..." : "Content"}</div>;
}
```

---

### `/lib` - Utilities & Configurations

Library functions dan konfigurasi.

```
lib/
├── supabase/                   # Supabase clients
│   ├── client.ts              # Browser client
│   ├── server.ts              # Server client
│   ├── admin.ts               # Admin client (service role)
│   └── helpers.ts             # CRUD helper functions ✅
│
├── middleware/                 # Middleware utilities
│   ├── auth-middleware.ts     # Auth middleware functions
│   └── README.md              # Middleware docs
│
├── validations/                # Zod validation schemas ✅
│   ├── project.ts             # Project validation
│   ├── experience.ts          # Experience validation
│   └── skill.ts               # Skill validation ✅ NEW
│
├── email.ts                    # Email service (Nodemailer)
├── auth.ts                     # Auth helpers
└── utils.ts                    # General utilities
```

**Key Files:**

#### `lib/supabase/client.ts`

Browser-side Supabase client untuk:

- Client components
- User interactions
- Real-time subscriptions

#### `lib/supabase/server.ts`

Server-side Supabase client untuk:

- Server components
- API routes
- SSR data fetching

#### `lib/supabase/admin.ts`

Admin Supabase client dengan service role untuk:

- Bypass RLS policies
- Admin operations
- Background jobs

#### `lib/email.ts`

Email service dengan Nodemailer:

- Send contact form emails
- HTML email templates
- Error handling

#### `lib/auth.ts`

Authentication helpers:

- `getUser()` - Get current user
- `requireAuth()` - Require authentication
- `signIn()` - Sign in user
- `signOut()` - Sign out user

#### `lib/middleware/auth-middleware.ts`

Modular middleware utilities:

- `createMiddlewareSupabaseClient()` - Create Supabase client for middleware
- `isProtectedRoute()` - Check if route is protected
- `createAuthRedirect()` - Create redirect to login
- `createDashboardRedirect()` - Create redirect to dashboard
- `getMiddlewareConfig()` - Get middleware config

**Note:** Main `middleware.ts` must stay at root level (Next.js convention)

#### `lib/supabase/helpers.ts` ✅

CRUD helper functions untuk mengatasi Supabase type inference issues:

- `insertProject()` - Create new project
- `updateProject()` - Update existing project
- `insertWorkExperience()` - Create new work experience
- `updateWorkExperience()` - Update existing work experience
- `insertSkill()` - Create new skill ✅ NEW
- `updateSkill()` - Update existing skill ✅ NEW
- `deleteSkill()` - Delete existing skill ✅ NEW
- Type-safe dengan Database types
- Menggunakan `@ts-expect-error` untuk type workarounds

#### `lib/validations/project.ts` ✅

Zod validation schema untuk projects:

- Title, slug, description validation
- Problem, solution, impact validation
- Technologies array validation (min 1, max 20) with Devicon icon support
  - Each technology: `{name, icon?, icon_svg?}`
- URL validation untuk image, project, GitHub
- Featured boolean dan order_index number
- Auto-generate slug dari title

#### `lib/validations/experience.ts` ✅

Zod validation schema untuk work experience:

- Company dan position validation
- Description validation (min 10, max 2000 chars)
- Date validation dengan refinements
- End date validation (must be after start date)
- Current job logic (end date optional if current)
- Order index validation

#### `lib/validations/skill.ts` ✅ NEW

Zod validation schema untuk skills:

- Name validation (min 2, max 50 chars)
- Category enum validation (frontend, backend, tools, others)
- Icon string (optional, Devicon class)
- Icon SVG URL validation (optional, valid URL)
- Order index validation (int, min 0)
- Visibility boolean

#### `lib/utils.ts`

General utility functions:

- `cn()` - Merge Tailwind classes
- `generateSlug()` - Generate URL slug
- `formatDate()` - Format dates
- `formatDateShort()` - Format dates (short)
- `truncate()` - Truncate text
- `validateEmail()` - Validate email

---

### `/types` - TypeScript Types

Type definitions untuk TypeScript.

```
types/
├── database.types.ts           # Supabase generated types
├── project.ts                  # Project types
├── experience.ts               # Experience types
├── certificate.ts              # Certificate types ✅
└── skill.ts                    # Skill types ✅ NEW
```

**Type Conventions:**

- Database types generated dari Supabase schema
- Custom types untuk form data
- API response types untuk consistency
- Extend database types untuk additional fields

**Example:**

```typescript
// types/project.ts
import type { Database } from "./database.types";

// Database row type
export type Project = Database["public"]["Tables"]["projects"]["Row"];

// Insert type (for creating)
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

// Update type (for updating)
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

// Form data type (with validation)
export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  technologies: string[];
  image_url?: string;
  project_url?: string;
  github_url?: string;
  featured: boolean;
  order_index: number;
}

// With relations (if needed)
export interface ProjectWithRelations extends Project {
  // Add related data here
}
```

**Example Certificate Types:**

```typescript
// types/certificate.ts ✅
export interface Certificate {
  id: string | number;
  title: string;
  provider: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}

export interface CertificateFormData {
  title: string;
  provider: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: string;
}
```

---

### `/hooks` - Custom React Hooks

Custom hooks untuk data fetching dan state management.

```
hooks/
├── useProjects.ts              # Projects data hooks
├── useExperience.ts            # Experience data hooks
├── useAuth.ts                  # Auth state hook
└── useToast.ts                 # Toast notification hook
```

**Hook Examples:**

```typescript
// hooks/useProjects.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/project";

export function useProjects(featured?: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supabase = createClient();
        let query = supabase
          .from("projects")
          .select("*")
          .order("order_index", { ascending: true });

        if (featured !== undefined) {
          query = query.eq("featured", featured);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [featured]);

  return { projects, loading, error };
}
```

---

### `/public` - Static Assets

Static files yang di-serve langsung.

```
public/
├── images/                     # Images
│   ├── logo.svg               # Site logo
│   ├── hero-bg.jpg            # Hero background
│   └── projects/              # Project screenshots
│       ├── project-1.jpg
│       └── project-2.jpg
│
├── fonts/                      # Custom fonts (if any)
├── favicon.ico                 # Favicon
├── robots.txt                  # SEO robots file
└── sitemap.xml                 # SEO sitemap
```

**Asset Guidelines:**

- Optimize images before adding (use WebP when possible)
- Use Next.js Image component for automatic optimization
- Keep file sizes small
- Use descriptive filenames
- Organize by type/feature

---

### Configuration Files

#### `middleware.ts`

Next.js middleware untuk:

- Protect admin routes
- Check authentication
- Redirect unauthorized users
- Refresh Supabase session

#### `next.config.ts`

Next.js configuration:

- Image domains
- Environment variables
- Redirects/rewrites
- Headers

#### `tailwind.config.ts`

Tailwind CSS configuration:

- Custom colors
- Custom fonts
- Custom animations
- Dark mode settings

#### `tsconfig.json`

TypeScript configuration:

- Compiler options
- Path aliases (@/\*)
- Strict mode enabled

#### `supabase-schema.sql`

Database schema:

- Table definitions
- RLS policies
- Functions & triggers
- Seed data

---

## 🔄 Data Flow

### Public Pages (Server Components)

```
User Request
    ↓
Next.js Server Component
    ↓
Supabase Server Client
    ↓
Database (with RLS)
    ↓
Render HTML
    ↓
Send to Browser
```

### Admin Panel (Client Components)

```
User Action
    ↓
React Component
    ↓
Custom Hook (useProjects, etc)
    ↓
Supabase Client
    ↓
Database (authenticated)
    ↓
Update State
    ↓
Re-render UI
```

### API Routes

```
Client Request
    ↓
API Route Handler
    ↓
Validate Input (Zod)
    ↓
Check Authentication
    ↓
Database Operation
    ↓
Return JSON Response
```

---

## 🎨 Styling Architecture

### Tailwind CSS Approach

1. **Utility-first**: Use Tailwind utilities directly in JSX
2. **Component classes**: Extract common patterns to components
3. **Custom utilities**: Add custom utilities in `globals.css`
4. **Dark mode**: Use `dark:` prefix for dark mode styles

### File Organization

```
app/
├── globals.css                 # Global styles
│   ├── @tailwind directives
│   ├── Custom CSS variables
│   ├── Base styles
│   └── Utility classes
│
└── [component].tsx             # Component with inline Tailwind
```

### Dark Mode Strategy

```tsx
// Use class-based dark mode
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">Title</h1>
</div>
```

---

## 📦 State Management

### Server State (Database)

- Supabase for data persistence
- Server components for initial data
- Client hooks for mutations

### Client State

- React useState for local state
- React Context for global state (theme, auth)
- No external state library needed (keep it simple)

### Form State

- React Hook Form for form management
- Zod for validation
- Optimistic updates for better UX

---

## 🔐 Security Layers

1. **Middleware**: Route protection
2. **RLS Policies**: Database-level security
3. **API Validation**: Input validation with Zod
4. **Environment Variables**: Sensitive data protection
5. **HTTPS**: Encrypted communication (production)

---

## 📈 Performance Optimizations

1. **Server Components**: Default to server components
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Automatic with App Router
4. **Caching**: Next.js cache for static data
5. **Lazy Loading**: Dynamic imports for heavy components

---

## 🧪 Testing Strategy (Future)

```
tests/
├── unit/                       # Unit tests
│   ├── components/
│   ├── lib/
│   └── hooks/
│
├── integration/                # Integration tests
│   ├── api/
│   └── pages/
│
└── e2e/                        # End-to-end tests
    ├── public/
    └── admin/
```

---

**Last Updated:** February 7, 2026
