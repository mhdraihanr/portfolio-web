# Public Homepage Components

Components untuk homepage public portfolio website.

## 📁 Structure

```
components/
├── hero.tsx          # Hero section with animated background
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

## 🎯 Next Sections to Build

- [ ] About section (with integrated skills)
- [ ] Certificate section
- [ ] Projects section (fetch from database)
- [ ] Work Experience section (fetch from database)
- [ ] Contact section (with form)

## 📝 Notes

- All animations defined in `app/globals.css`
- Uses existing UI components from `components/ui/`
- Social links are placeholders - update with actual URLs
- Email placeholder - update with actual email
- All sections should follow same animation pattern
