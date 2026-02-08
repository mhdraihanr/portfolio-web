# 🎨 Tailwind CSS v4 Configuration

Project ini menggunakan **Tailwind CSS v4** dengan CSS-first configuration approach.

## 📋 Key Changes from v3 to v4

### Configuration Location

**Tailwind v3:**

```javascript
// tailwind.config.ts
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* ... */
      },
    },
  },
};
```

**Tailwind v4:**

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary-600: #4f46e5;
}

@variant dark (.dark &);
```

### Dark Mode Configuration

**Tailwind v3:**

- Config: `darkMode: "class"` in `tailwind.config.ts`
- Usage: `dark:bg-gray-900`

**Tailwind v4:**

- Config: `@variant dark (.dark &);` in CSS
- Usage: `dark:bg-gray-900` (same)

## 🔧 Current Configuration

### File: `app/globals.css`

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: var(--font-geist-sans), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;

  /* Primary Colors - Red Theme */
  --color-primary-50: #fef2f2;
  --color-primary-100: #fee2e2;
  --color-primary-200: #fecaca;
  --color-primary-300: #fca5a5;
  --color-primary-400: #f87171;
  --color-primary-500: #ef4444;
  --color-primary-600: #dc2626;
  --color-primary-700: #b91c1c;
  --color-primary-800: #991b1b;
  --color-primary-900: #7f1d1d;

  /* Secondary Colors */
  --color-secondary-50: #ecfdf5;
  --color-secondary-100: #d1fae5;
  --color-secondary-200: #a7f3d0;
  --color-secondary-300: #6ee7b7;
  --color-secondary-400: #34d399;
  --color-secondary-500: #10b981;
  --color-secondary-600: #059669;
  --color-secondary-700: #047857;
  --color-secondary-800: #065f46;
  --color-secondary-900: #064e3b;
}

/* Enable class-based dark mode */
@variant dark (.dark &);
```

### File: `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### File: `tailwind.config.ts`

**Status:** ❌ Not used (backed up to `tailwind.config.ts.backup`)

Tailwind v4 does NOT use this file. All configuration is in CSS.

## 🌙 Dark Mode Setup

### 1. ThemeProvider Configuration

**File:** `app/layout.tsx`

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false} // Disable system preference
  storageKey="portfolio-theme"
>
  {children}
</ThemeProvider>
```

### 2. CSS Dark Mode Variant

**File:** `app/globals.css`

```css
/* This enables dark: prefix in all components */
@variant dark (.dark &);
```

**How it works:**

- `@variant dark` defines a custom variant named "dark"
- `(.dark &)` means: apply when `.dark` class exists on parent element
- Result: `dark:bg-gray-900` only applies when `<html class="dark">` exists

### 3. Theme Toggle Component

**File:** `components/shared/theme-toggle.tsx`

```typescript
const { resolvedTheme, setTheme } = useTheme();

const handleToggle = () => {
  const newTheme = resolvedTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
};
```

## 🎯 Usage Examples

### Component with Dark Mode

```typescript
// Card component
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-2xl font-bold">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Custom Colors (Red Theme)

```typescript
// Using custom primary colors (red theme)
<button className="bg-primary-600 hover:bg-primary-700 text-white">
  Click me
</button>

// Result: Red button (#dc2626) with darker hover (#b91c1c)
```

## 🔄 Migration Checklist

If you need to migrate from v3 to v4:

- [x] Install Tailwind v4: `npm install tailwindcss@^4 @tailwindcss/postcss@^4`
- [x] Update `postcss.config.mjs` to use `@tailwindcss/postcss`
- [x] Move colors from `tailwind.config.ts` to `@theme` in CSS
- [x] Add `@variant dark (.dark &);` for dark mode
- [x] Backup or remove `tailwind.config.ts`
- [x] Test all components in light and dark mode
- [x] Update documentation

## 📚 Resources

- [Tailwind CSS v4 Alpha Docs](https://tailwindcss.com/docs/v4-alpha)
- [CSS-first Configuration](https://tailwindcss.com/docs/v4-alpha#css-first-configuration)
- [Dark Mode in v4](https://tailwindcss.com/docs/v4-alpha#dark-mode)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

## ⚠️ Important Notes

1. **No `tailwind.config.ts`**: Tailwind v4 ignores this file. Use CSS only.
2. **Color Format**: Use CSS custom properties: `--color-primary-600: #4f46e5`
3. **Dark Mode**: Must explicitly enable with `@variant dark (.dark &)`
4. **System Preference**: Disabled via `enableSystem={false}` for manual control
5. **Persistence**: Theme saved in localStorage as `portfolio-theme`

## 🐛 Troubleshooting

### Dark mode not working

**Problem:** `dark:` classes not applying

**Solution:** Ensure `@variant dark (.dark &);` is in `globals.css`

### Colors not found

**Problem:** Custom colors like `primary-600` not working

**Solution:** Define in `@theme` with `--color-` prefix:

```css
@theme {
  --color-primary-600: #dc2626; /* Red theme */
}
```

### Config file ignored

**Problem:** Changes in `tailwind.config.ts` not applied

**Solution:** Tailwind v4 doesn't use this file. Move config to CSS.

---

**Last Updated:** 2026-01-31
**Tailwind Version:** v4.1.18
**Status:** ✅ Production Ready
