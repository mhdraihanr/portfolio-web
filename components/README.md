# Components Documentation

This directory contains all reusable React components for the portfolio website.

## 📁 Structure

```
components/
├── ui/              # Base UI components
├── shared/          # Shared layout components
└── providers/       # Context providers
```

## 🎨 UI Components (`components/ui/`)

### Button

A versatile button component with multiple variants and sizes.

**Variants:** `primary` | `secondary` | `outline` | `ghost` | `danger`
**Sizes:** `sm` | `md` | `lg` | `icon`

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md">
  Click me
</Button>

<Button loading>Loading...</Button>

<Button leftIcon={<Icon />}>With Icon</Button>
```

### Input

Text input component with label, error handling, and helper text.

```tsx
import { Input } from "@/components/ui";

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  error="Invalid email"
  helperText="Enter your email address"
/>;
```

### Textarea

Multi-line text input with validation support.

```tsx
import { Textarea } from "@/components/ui";

<Textarea
  label="Message"
  placeholder="Enter your message..."
  rows={4}
  error="Message is required"
/>;
```

### Card

Container component with header, content, and footer sections.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>;
```

### Modal

Dialog component with portal rendering and keyboard navigation.

```tsx
import { Modal } from "@/components/ui";

const [isOpen, setIsOpen] = useState(false);

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Modal description"
  size="md"
>
  Modal content here
</Modal>;
```

**Features:**

- Portal rendering (renders outside DOM hierarchy)
- Keyboard navigation (ESC to close)
- Backdrop click to close
- Multiple sizes: `sm` | `md` | `lg` | `xl` | `full`
- Dark mode support

### Spinner / Loading

Loading indicators with different sizes and variants.

```tsx
import { Spinner, Loading } from "@/components/ui";

<Spinner size="md" variant="primary" />

<Loading text="Loading data..." fullScreen />
```

### Toast

Notification system with useToast hook.

```tsx
import { useToast, ToastContainer } from "@/components/ui";

const { toasts, toast } = useToast();

// Show toasts
toast.success("Success!", "Operation completed");
toast.error("Error!", "Something went wrong");
toast.warning("Warning!", "Please check your input");
toast.info("Info", "This is informational");

// Render container
<ToastContainer toasts={toasts} position="top-right" />;
```

**Positions:** `top-left` | `top-center` | `top-right` | `bottom-left` | `bottom-center` | `bottom-right`

## 🔗 Shared Components (`components/shared/`)

### Navbar

Responsive navigation bar with mobile menu and scroll effects.

```tsx
import { Navbar } from "@/components/shared";

<Navbar />;
```

**Features:**

- Responsive mobile menu
- Scroll-based styling
- Theme toggle integration
- Smooth animations

### Footer

Footer with navigation links and social icons.

```tsx
import { Footer } from "@/components/shared";

<Footer />;
```

**Includes:**

- Navigation links
- Social media links (GitHub, LinkedIn, Email, Phone)
- Copyright information

### Theme Toggle

Dark/Light mode switcher using next-themes.

```tsx
import { ThemeToggle } from "@/components/shared";

<ThemeToggle />;
```

## 🎭 Providers (`components/providers/`)

### ThemeProvider

Wrapper for next-themes to enable dark mode.

```tsx
import { ThemeProvider } from "@/components/providers";

<ThemeProvider
  attribute="class"
  defaultTheme="dark" // Default to dark mode
  enableSystem={false} // Manual control
  storageKey="portfolio-theme"
>
  {children}
</ThemeProvider>;
```

**Note:** Default theme is set to **dark mode** for all first-time visitors.

## 🎨 Styling

All components use:

- **Tailwind CSS** for styling
- **class-variance-authority** for variant management
- **Dark mode** support via `next-themes`
- **Responsive design** mobile-first approach

## 📦 Dependencies

- `class-variance-authority` - Variant management
- `next-themes` - Theme switching
- `lucide-react` - Icons
- `framer-motion` - Animations (ready to use)
- `clsx` + `tailwind-merge` - Class name utilities

## 🔧 TypeScript Support

All components are fully typed with:

- Props interfaces
- ForwardRef support
- Generic types where needed
- Exported type definitions

## 🌙 Dark Mode

All components support dark mode automatically:

- Use `dark:` prefix in Tailwind classes
- Components adapt to theme changes
- No additional configuration needed

## 📱 Responsive Design

All components are responsive by default:

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`
- Touch-friendly on mobile devices

## ♿ Accessibility

Components follow accessibility best practices:

- Proper ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## 🚀 Usage Example

```tsx
"use client";

import { Button, Card, Input, useToast } from "@/components/ui";
import { Navbar, Footer } from "@/components/shared";

export default function Page() {
  const { toast } = useToast();

  return (
    <>
      <Navbar />
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Example</CardTitle>
          </CardHeader>
          <CardContent>
            <Input label="Name" placeholder="Enter name" />
          </CardContent>
          <CardFooter>
            <Button onClick={() => toast.success("Saved!")}>Save</Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </>
  );
}
```

## 📝 Notes

- All components use the `cn()` utility from `@/lib/utils` for class merging
- Components are built with React `forwardRef` for ref forwarding
- Most components accept standard HTML attributes via spread props
- Components are "use client" when they use React hooks or browser APIs

## 🎯 Next Steps

1. Add more components as needed (Badge, Label, Select, etc.)
2. Add Storybook for component documentation
3. Add component tests
4. Add more animations with Framer Motion
