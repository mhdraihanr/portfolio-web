# Public Homepage Components

Components untuk homepage public portfolio website.

## 📁 Structure

```
components/
├── hero.tsx          # Hero section with animated background
├── about.tsx         # About section with skills
├── certificates.tsx  # Certificates infinite scroll
├── projects.tsx      # Featured projects showcase
├── experience.tsx    # Work experience timeline
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

### Experience Section

**Files:**

- `experience.tsx` - Server component (data fetching)
- `experience-client.tsx` - Client component (rendering with Orb)

Work experience timeline dengan modern zigzag layout, animated Orb background, dan data dari Supabase database.

#### Features:

- ✅ **Split Architecture** - Server component untuk data, Client component untuk interactivity
- ✅ **Supabase SSR** - Server-side data fetching untuk SEO optimization
- ✅ **React Bits Orb Background** - Animated WebGL background dengan OGL library
  - Blue orb (hue=206) dengan hover intensity 0.35
  - Theme-aware: White background (light mode), Dark background (dark mode)
  - Hollow center effect in light mode untuk stroke-only appearance
  - Always animated dengan forceHoverState
  - Dynamic import dengan no SSR untuk avoid hydration issues
  - Mounted state check untuk prevent hydration mismatch
- ✅ **Modern Zigzag Timeline** - Alternating left-right card placement
- ✅ **Company Logo Display** - 48x48 rounded logo images
  - Light mode: Border outline only (border-2)
  - Dark mode: Filled background (bg-primary-500/10)
- ✅ **Employment Type Badges** - Full-time, Part-time, Internship, etc
- ✅ **Timeline Aesthetics**:
  - Center vertical gradient line (desktop)
  - Timeline dots dengan theme-aware styling:
    - Light mode: Stroke-only (border-2)
    - Dark mode: Filled dengan inner dot
  - Staggered card positioning (50% width each side)
  - Mobile-responsive (stacks vertically)
- ✅ **Experience Cards** dengan:
  - Company logo or Briefcase icon
  - Position sebagai title (large, bold)
  - Employment type badge (secondary color)
  - Company name (medium font)
  - Date range dengan "Present" indicator untuk current role
  - Decorative corner accent
  - Hover glow effect dan scale animation
- ✅ **See More Button** - UX enhancement untuk many entries:
  - Initially displays only 3 most recent experiences
  - Text link styled like "View All Projects" (primary color, hover effect)
  - Toggles between "See More (X more)" dan "Show Less"
  - Animated chevron icon rotates 180deg on toggle
  - Only appears when experiences.length > 3
- ✅ **Staggered Animations** - Cards muncul dengan delay
- ✅ **Dark Mode Support** - Proper color contrast dan theme switching
- ✅ **Empty State** - Message jika tidak ada experience

#### Database Query:

```typescript
const { data } = await supabase
  .from("work_experience")
  .select("*")
  .order("start_date", { ascending: false });
```

#### Data Structure:

```typescript
interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  order_index: number;
  logo_url?: string;
  employment_type?: string;
}

type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Internship"
  | "Freelance"
  | "Contract"
  | "Organization";
```

#### Design Highlights:

- **Animated Orb Background**: WebGL-powered animated blue orb (React Bits)
- **Theme-aware Visuals**: Light mode = hollow center, Dark mode = filled orb
- **Modern Timeline**: Zigzag alternating layout with center line
- **Visual Elements**: Timeline dots (stroke in light, filled in dark), decorative accents, gradient effects
- **Color Consistency**: Uses same primary red theme (#dc2626) with blue orb background
- **Hover Effects**: Scale (1.02x), shadow enhancement, glow overlay
- **Date Format**: "Jan 2024 - Present" atau "Jan 2024 - Dec 2024"
- **Responsive**: Desktop zigzag, mobile stack with hidden timeline
- **Logo Support**: Company logos dengan border styling berdasarkan theme
- **Type Badges**: Professional employment type indicators
- **Hydration Safe**: Mounted state prevents hydration mismatch

#### Usage:

```tsx
// experience.tsx (Server Component)
import { ExperienceClient } from "./experience-client";

async function getExperiences() {
  // Fetch from Supabase
}

export async function Experience() {
  const experiences = await getExperiences();
  return <ExperienceClient experiences={experiences} />;
}

// experience-client.tsx (Client Component)
("use client");
import Orb from "@/components/Orb";
import { useTheme } from "next-themes";

export function ExperienceClient({ experiences }) {
  // Orb background + Timeline rendering
}

// In page.tsx
import { Experience } from "./components";

export default function HomePage() {
  return <Experience />;
}
```

## 🎯 Completed Sections

- [x] **Hero section** - Animated hero with LightRays background (React Bits)
- [x] **About section** - Profile info with integrated skills showcase
- [x] **Certificate section** - Infinite scroll carousel with LogoLoop (React Bits)
- [x] **Projects section** - Featured projects grid with Supabase integration
- [x] **Experience section** - Work experience timeline with Orb background (React Bits) & Supabase integration

## 🎯 Next Sections to Build

- [ ] Contact section (with form)

## 📝 Notes

- All animations defined in `app/globals.css`
- Uses existing UI components from `components/ui/`
- Social links are placeholders - update with actual URLs
- Email placeholder - update with actual email
- All sections should follow same animation pattern
- Projects section uses server component for SEO optimization
