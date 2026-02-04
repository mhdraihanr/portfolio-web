# Public Pages - Homepage

Homepage portfolio dengan multiple sections.

## 🎯 Current Status

### ✅ Completed

- **Hero Section** - Simple & elegant introduction

### 🎯 Next to Build

- About Section (with integrated skills)
- Certificate Section
- Projects Section
- Work Experience Section
- Contact Section

## 📁 Structure

```
app/(public)/
├── layout.tsx              # Public pages layout (Navbar, Footer, BackToTop)
├── page.tsx                # Main homepage (imports all sections)
├── components/
│   ├── hero.tsx           # ✅ Hero section
│   ├── index.ts           # Component exports
│   └── README.md          # Component documentation
└── README.md              # This file
```

## 🎨 Design System

### Colors

- **Primary**: Red theme (#dc2626)
- **Secondary**: Green theme (#10b981)
- **Backgrounds**: Gradient with animated orbs

### Typography

- **Greeting**: text-lg/xl (gray-600)
- **Main Title**: text-5xl/7xl/8xl (bold, gray-900)
- **Tagline**: text-lg/xl/2xl (gray-600)

### Animations

- **fade-in-up**: Content entrance animation
- **pulse**: Background orbs
- **bounce**: Scroll indicator
- **hover effects**: Social icons scale & color change

## 🚀 Usage

Homepage accessible at:

- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

## 📝 Next Steps

1. Build About section with skills integration
2. Build Certificate section
3. Build Projects section (fetch from Supabase)
4. Build Work Experience section (fetch from Supabase)
5. Build Contact section with form validation
