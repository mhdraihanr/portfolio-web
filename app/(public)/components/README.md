# Public Homepage Components

Components untuk homepage public portfolio website.

## 📁 Structure

```
components/
├── hero.tsx          # Hero section with animated background
├── about.tsx         # About section with skills
├── certificates.tsx  # Certificates infinite scroll
├── projects.tsx      # Featured projects showcase
├── index.ts          # Component exports
└── README.md         # This file
```

## 🎨 Components

### Hero Section

**File:** `hero.tsx`

Simple dan elegant hero section dengan:

- **Greeting**: "Hello, I'm Raihan" (small text)
- **Main Title**: "Fullstack Developer" (large, bold)
- **Tagline**: Simple description tentang fullstack development
- **CTA Buttons**:
  - "View My Work" (primary) - scroll to projects
  - "Get In Touch" (outline) - scroll to contact
- **Social Links**: GitHub, LinkedIn, Email (hover effects)
- **Scroll Indicator**: Animated scroll down indicator

#### Features:

- ✅ Animated gradient background with floating orbs
- ✅ Fade-in-up animations with staggered delays
- ✅ Responsive design (mobile-first)
- ✅ Dark mode support
- ✅ Smooth hover effects on social icons
- ✅ Accessible (ARIA labels)

#### Animations:

- **fade-in-up**: Content appears with upward motion
- **pulse**: Gradient orbs pulsing effect
- **bounce**: Scroll indicator bounce
- **scroll**: Mouse scroll animation inside indicator

#### Usage:

```tsx
import { Hero } from "./components";

export default function HomePage() {
  return <Hero />;
}
```

### Projects Section

**File:** `projects.tsx`

Featured projects showcase dengan data dari Supabase database.

#### Features:

- ✅ **Server Component** - SSR untuk SEO optimization
- ✅ **Supabase Integration** - Fetch projects dari database
- ✅ **Featured Filter** - Hanya tampilkan featured projects
- ✅ **Responsive Grid** - 1 kolom (mobile), 2 kolom (desktop)
- ✅ **Project Cards** dengan:
  - Project image dengan hover scale effect
  - Title dengan GitHub & live site links
  - Description (3 lines max)
  - Technology badges (max 5 visible)
  - Problem preview section
- ✅ **Staggered Animations** - Cards muncul dengan delay
- ✅ **Dark Mode Support**
- ✅ **Empty State** - Message jika tidak ada projects

#### Database Query:

```typescript
const { data } = await supabase
  .from("projects")
  .select("*")
  .eq("featured", true)
  .order("order_index", { ascending: true });
```

#### Data Structure:

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  impact?: string;
  technologies: string[];
  image_url?: string;
  project_url?: string;
  github_url?: string;
  featured: boolean;
  order_index: number;
}
```

#### Usage:

```tsx
import { Projects } from "./components";

export default function HomePage() {
  return <Projects />;
}
```

## 🎯 Completed Sections

- [x] **Hero section** - Animated hero with LightRays background
- [x] **About section** - Profile info with integrated skills showcase
- [x] **Certificate section** - Infinite scroll carousel with certificates
- [x] **Projects section** - Featured projects grid with Supabase integration

## 🎯 Next Sections to Build

- [ ] Work Experience section (fetch from database)
- [ ] Contact section (with form)

## 📝 Notes

- All animations defined in `app/globals.css`
- Uses existing UI components from `components/ui/`
- Social links are placeholders - update with actual URLs
- Email placeholder - update with actual email
- All sections should follow same animation pattern
- Projects section uses server component for SEO optimization
