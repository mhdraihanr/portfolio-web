# Contact Form Implementation

Contact page dengan form yang memiliki animasi ShineBorder dari Magic UI.

## ✨ Features

- ✅ **Complete Form Fields:**
  - Name (min 2 characters)
  - Email (with validation)
  - Subject (min 5 characters)
  - Message (min 10 characters)

- ✅ **Compact Grid Layout:**
  - Name & Email side-by-side on desktop (2 columns)
  - Subject full width below
  - Message textarea full width at bottom
  - Responsive: Stacks vertically on mobile
  - Better space utilization in portrait mode

- ✅ **ShineBorder Animation:**
  - Installed from Magic UI via shadcn CLI (`pnpm dlx shadcn@latest add @magicui/shine-border`)
  - Animated radial gradient border effect
  - Adapts to dark/light theme automatically with gradient colors
  - Smooth background position animation (14s duration)
  - From [Magic UI](https://magicui.design/docs/components/shine-border)
  - Official component, well-maintained

- ✅ **Form Validation:**
  - Client-side validation
  - Server-side validation with Zod
  - Real-time error messages
  - Clear error states

- ✅ **User Experience:**
  - Loading states during submission
  - Success/error messages
  - Form reset after successful submission
  - Clear button to reset form
  - Disabled states during submission

- ✅ **Responsive Design:**
  - Mobile-friendly
  - Dark mode support
  - Smooth transitions

- ✅ **Navigation Improvements:**
  - Navbar routing fixes using `usePathname` hook
  - Hash links (#home, #about, etc) redirect to `/#home` when on contact page
  - Prevents incorrect routing to `/contact#home`
  - Works for both desktop and mobile navigation

- ✅ **Layout Spacing:**
  - Added `mt-8` to heading container
  - Proper spacing between navbar and "Get In Touch" title

## 📁 Files Created/Modified

### 1. ShineBorder Component

**Path:** `components/ui/shine-border.tsx`

Animated radial gradient border effect component installed via shadcn CLI:

```bash
pnpm dlx shadcn@latest add https://magicui.design/r/shine-border
```

**Customizable Properties:**

- borderWidth (default: 1px)
- duration (default: 14s)
- shineColor (single color or array of gradient colors)

**Source:** [Magic UI - Shine Border](https://magicui.design/docs/components/shine-border)  
**Status:** Official component, installed via CLI (recommended over manual implementation)

### 2. Contact Page

**Path:** `app/(public)/contact/page.tsx`

Standalone contact page with compact grid layout:

- **Complete form with 4 fields** (name, email, subject, message)
- **Compact grid layout:** Name & Email side-by-side on desktop (`md:grid-cols-2`)
- **ShineBorder animation** on form container with theme-aware colors
- **Client-side validation** with real-time error messages
- **API integration** for email sending
- **Status messages** (success/error alerts)
- **Loading states** for submit button
- **Clear button** to reset form
- **Additional contact info** (Email, LinkedIn, GitHub links)

### 3. Contact API Route

**Path:** `app/api/contact/route.ts`

Backend API for handling form submissions:

- POST endpoint
- Zod validation with contactSchema
- Email sending via Nodemailer
- Error handling
- Email configuration check

### 4. Updated Files

#### `lib/email.ts`

- Added `subject` field to `ContactFormData` interface
- Updated HTML email template to include subject field
- Email configuration check before sending

#### `app/globals.css`

- Added `@keyframes shine` animation for ShineBorder effect
- Animation keyframes: 0% → 50% (bg-pos 0% to 100%) → 100% (back to 0%)
- Added `.animate-shine` class definition in @theme inline
- Removed unwanted `@layer base` block that shadcn CLI added

#### `components/ui/index.ts`

- Updated exports from `border-beam` to `shine-border`
- Clean export path for ShineBorder component

#### `components/shared/navbar.tsx`

- **Added `usePathname` hook** for route detection
- **Fixed hash link routing:** When on `/contact` page, hash links (#home, #about, etc) redirect to `/#hash` instead of `/contact#hash`
- Conditional href logic:
  ```tsx
  const pathname = usePathname();
  href={
    pathname === "/contact" && link.href.startsWith("#")
      ? `/${link.href}`
      : link.href
  }
  ```
- Applied to both desktop and mobile navigation
- Contact link changed from `#contact` to `/contact` (separate page)

#### `components/shared/footer.tsx`

- Changed Contact link from `#contact` to `/contact` (separate page)

## 🎨 ShineBorder Animation

The ShineBorder component creates a radial gradient shine effect around the form:

```tsx
<ShineBorder
  borderWidth={2}
  duration={14}
  shineColor={
    theme === "dark"
      ? ["#ef4444", "#f87171", "#fca5a5"]
      : ["#dc2626", "#ef4444", "#f87171"]
  }
/>
```

**Animation Details:**

- Uses CSS `radial-gradient` with animated `background-position`
- Gradient colors:
  - Light mode: `["#dc2626", "#ef4444", "#f87171"]` (primary-600, primary-500, primary-400)
  - Dark mode: `["#ef4444", "#f87171", "#fca5a5"]` (primary-500, primary-400, primary-300)
- Duration: 14 seconds per cycle
- Infinite loop with smooth transitions
- Border width: 2px

## 🚀 Usage

### Access Contact Page

Navigate to `/contact` or click "Contact" in navbar/footer.

### Form Submission Flow

1. User fills out form fields
2. Client-side validation on submit
3. POST request to `/api/contact`
4. Server-side validation with Zod
5. Email sent via Nodemailer
6. Success/error message displayed
7. Form reset on success

## ⚙️ Configuration

### Email Service Setup

To enable email sending, configure these environment variables in `.env.local`:

```env
# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=recipient@example.com
```

**Important:**

- Use Gmail App Password (not regular password)
- Enable 2-Step Verification in Google Account
- Generate App Password from Security settings

### Without Email Configuration

If email env variables are not set:

- API returns 503 error
- User sees message: "Email service is not configured"
- Form still validates but won't send

## 🎨 Theme Support

The form automatically adapts to current theme:

- **ShineBorder color changes:**
  - Light mode: Red shades `["#dc2626", "#ef4444", "#f87171"]`
  - Dark mode: Lighter red shades `["#ef4444", "#f87171", "#fca5a5"]`
- Input/textarea styling
- Button colors
- Background colors
- Text colors

## 📝 Validation Rules

| Field   | Rules                        |
| ------- | ---------------------------- |
| Name    | Required, min 2 characters   |
| Email   | Required, valid email format |
| Subject | Required, min 5 characters   |
| Message | Required, min 10 characters  |

## 🔒 Security

- Server-side validation with Zod
- Email service configuration check
- Error messages don't expose sensitive info
- CORS protection via Next.js
- Rate limiting (recommended to add)

## 🐛 Troubleshooting

### Email Not Sending

1. Check `.env.local` for correct credentials
2. Verify Gmail App Password is generated
3. Check server console for error logs
4. Test SMTP connection separately

### ShineBorder Not Showing

1. Check theme is loaded (`useTheme` hook)
2. Verify `globals.css` has `@keyframes shine` animation
3. Check parent container has `overflow-hidden` class
4. Verify browser supports CSS `mask` and `radial-gradient`
5. Try different browser or inspect element for CSS issues

### Form Validation Issues

1. Check Zod schema matches form fields
2. Verify client-side validation logic
3. Check API route validation
4. Review error messages in browser console

## 🎯 Recent Improvements

Completed enhancements:

- [x] **Compact Grid Layout**: Name & Email side-by-side on desktop (`md:grid-cols-2`)
- [x] **ShineBorder from Magic UI**: Installed via shadcn CLI (official, maintained component)
- [x] **Navbar Routing Fixes**: Hash links redirect to `/#hash` when on contact page
- [x] **Proper Spacing**: Added `mt-8` to heading for navbar clearance
- [x] **Theme-Aware Animation**: Dynamic gradient colors based on dark/light mode

## 🎯 Next Steps

Optional improvements:

- [ ] Add reCAPTCHA for spam protection
- [ ] Implement rate limiting
- [ ] Add file upload support
- [ ] Save submissions to database
- [ ] Add automated email responses
- [ ] Analytics tracking
- [ ] A/B testing different form layouts
- [ ] Smooth scroll animations when navigating from navbar
- [ ] Page transition effects

## 📚 References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Zod Validation](https://zod.dev/)
- [Nodemailer](https://nodemailer.com/)
- [Magic UI - Shine Border](https://magicui.design/docs/components/shine-border)
- [Tailwind CSS](https://tailwindcss.com/)
