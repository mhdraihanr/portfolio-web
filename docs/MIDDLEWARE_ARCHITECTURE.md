# 🛡️ Middleware Architecture

Dokumentasi lengkap tentang arsitektur middleware untuk route protection.

---

## 📋 Table of Contents

- [Overview](#overview)
- [File Locations](#file-locations)
- [Architecture Decision](#architecture-decision)
- [Implementation](#implementation)
- [Benefits](#benefits)
- [Usage Examples](#usage-examples)
- [Testing Strategy](#testing-strategy)
- [Best Practices](#best-practices)

---

## 🎯 Overview

Project ini menggunakan **modular middleware architecture** untuk memisahkan concerns dan meningkatkan maintainability.

### Key Components

1. **`middleware.ts`** (root) - Main middleware file (Next.js convention)
2. **`lib/middleware/auth-middleware.ts`** - Modular utility functions
3. **`lib/auth.ts`** - Server-side auth helpers

---

## 📁 File Locations

### ✅ **CORRECT Structure:**

```
portfolio-web/
├── middleware.ts                      ← Main middleware (MUST be at root)
├── lib/
│   ├── middleware/
│   │   ├── auth-middleware.ts        ← Modular utilities
│   │   └── README.md                 ← Documentation
│   └── auth.ts                        ← Auth helpers
└── app/
    └── admin/                    ← Protected admin routes
```

### ❌ **INCORRECT Locations:**

```
❌ app/middleware.ts                   (Next.js won't recognize)
❌ lib/middleware.ts                   (Next.js won't recognize)
❌ src/middleware.ts                   (Only if using src/ directory)
❌ components/middleware.ts            (Wrong location)
```

---

## 🏗️ Architecture Decision

### Why This Structure?

#### **1. Next.js Convention (Required)**

**Rule:** `middleware.ts` MUST be at project root.

```typescript
// ✅ CORRECT: middleware.ts at root
portfolio-web/
├── middleware.ts          ← Next.js finds this
├── app/
└── lib/
```

**Reason:**

- Next.js only recognizes middleware at root level
- Edge runtime requires specific file location
- Single middleware file per project (Next.js limitation)

**Source:** [Next.js 15 Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)

#### **2. Modular Utilities (Best Practice)**

**Pattern:** Extract logic to `lib/middleware/` for reusability.

```typescript
// ✅ BEST PRACTICE: Modular functions
lib/middleware/
├── auth-middleware.ts     ← Reusable functions
└── README.md              ← Documentation
```

**Benefits:**

- ✅ Testable (unit tests for each function)
- ✅ Maintainable (separate concerns)
- ✅ Reusable (import in multiple places)
- ✅ Type-safe (proper TypeScript types)

---

## 🔧 Implementation

### Main Middleware (`middleware.ts`)

**Location:** Root level (required by Next.js)

**Purpose:** Entry point for all requests

```typescript
/**
 * Next.js Middleware for Route Protection
 *
 * Location: Must be at project root (Next.js convention)
 * Purpose: Protect admin routes with authentication
 */

import { type NextRequest } from "next/server";
import {
  createMiddlewareSupabaseClient,
  isProtectedRoute,
  createAuthRedirect,
  createDashboardRedirect,
  getMiddlewareConfig,
} from "@/lib/middleware/auth-middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { adminRoute } = getMiddlewareConfig();

  // Check route type
  const { isAdminRoute, isLoginPage } = isProtectedRoute(pathname, adminRoute);

  // If not admin route, continue
  if (!isAdminRoute) {
    return;
  }

  // Create Supabase client and get response
  const { supabase, response } = createMiddlewareSupabaseClient(request);

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated and trying to access admin routes (except login)
  if (!user && !isLoginPage) {
    return createAuthRedirect(request, adminRoute, pathname);
  }

  // If user is authenticated and trying to access login page, redirect to dashboard
  if (user && isLoginPage) {
    return createDashboardRedirect(request, adminRoute);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Utility Functions (`lib/middleware/auth-middleware.ts`)

**Location:** `lib/middleware/` (modular utilities)

**Purpose:** Reusable middleware functions

**Available Functions:**

1. **`createMiddlewareSupabaseClient(request)`**

   - Create Supabase client for middleware
   - Handle cookies properly
   - Return client and response

2. **`isProtectedRoute(pathname, adminRoute)`**

   - Check if route is admin route
   - Check if route is login page
   - Check if route is API route

3. **`createAuthRedirect(request, adminRoute, pathname)`**

   - Create redirect to login page
   - Add `redirectTo` query parameter
   - Preserve original destination

4. **`createDashboardRedirect(request, adminRoute)`**

   - Create redirect to dashboard
   - For authenticated users on login page

5. **`getMiddlewareConfig()`**
   - Get configuration from environment
   - Return admin route and public routes

**See:** `lib/middleware/README.md` for detailed API documentation

---

## ✅ Benefits

### Before (Monolithic)

```typescript
// middleware.ts (80 lines)
// ❌ All logic in one file
// ❌ Hard to test
// ❌ Hard to maintain
// ❌ Repeated code
// ❌ No documentation

export async function middleware(request: NextRequest) {
  // ... 80 lines of mixed logic ...
}
```

### After (Modular)

```typescript
// middleware.ts (40 lines)
// ✅ Clean and readable
// ✅ Well documented
// ✅ Single responsibility
// ✅ Easy to understand

import { ... } from "@/lib/middleware/auth-middleware";

export async function middleware(request: NextRequest) {
  // ... clean, high-level logic ...
}

// lib/middleware/auth-middleware.ts (90 lines)
// ✅ Modular functions
// ✅ Type-safe
// ✅ Testable
// ✅ Reusable
// ✅ Well documented
```

### Comparison Table

| Aspect                 | Monolithic | Modular     |
| ---------------------- | ---------- | ----------- |
| **Lines in main file** | 80         | 40          |
| **Testability**        | ❌ Hard    | ✅ Easy     |
| **Maintainability**    | ❌ Hard    | ✅ Easy     |
| **Reusability**        | ❌ No      | ✅ Yes      |
| **Documentation**      | ❌ Minimal | ✅ Complete |
| **Type Safety**        | ⚠️ Mixed   | ✅ Full     |
| **Readability**        | ❌ Complex | ✅ Clear    |

---

## 📚 Usage Examples

### Example 1: Basic Auth Check

```typescript
import { isProtectedRoute } from "@/lib/middleware/auth-middleware";

const { isAdminRoute, isLoginPage } = isProtectedRoute(
  "/admin/dashboard",
  "admin"
);

console.log(isAdminRoute); // true
console.log(isLoginPage); // false
```

### Example 2: Create Supabase Client

```typescript
import { createMiddlewareSupabaseClient } from "@/lib/middleware/auth-middleware";

const { supabase, response } = createMiddlewareSupabaseClient(request);
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  // Handle unauthenticated user
}

return response;
```

### Example 3: Redirect Logic

```typescript
import {
  createAuthRedirect,
  createDashboardRedirect,
} from "@/lib/middleware/auth-middleware";

// Redirect to login
if (!user && !isLoginPage) {
  return createAuthRedirect(request, "admin", pathname);
  // Redirects to: /admin/login?redirectTo=/admin/projects
}

// Redirect to dashboard
if (user && isLoginPage) {
  return createDashboardRedirect(request, "admin");
  // Redirects to: /admin
}
```

---

## 🧪 Testing Strategy

### Unit Tests

Test individual utility functions:

```typescript
// __tests__/lib/middleware/auth-middleware.test.ts
import { isProtectedRoute } from "@/lib/middleware/auth-middleware";

describe("isProtectedRoute", () => {
  it("should identify admin routes", () => {
    const result = isProtectedRoute("/admin/dashboard", "admin");
    expect(result.isAdminRoute).toBe(true);
    expect(result.isLoginPage).toBe(false);
  });

  it("should identify login page", () => {
    const result = isProtectedRoute("/admin/login", "admin");
    expect(result.isAdminRoute).toBe(true);
    expect(result.isLoginPage).toBe(true);
  });

  it("should identify public routes", () => {
    const result = isProtectedRoute("/", "admin");
    expect(result.isAdminRoute).toBe(false);
  });
});
```

### Integration Tests

Test middleware with mock requests:

```typescript
// __tests__/middleware.test.ts
import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

describe("middleware", () => {
  it("should redirect unauthenticated users to login", async () => {
    const request = new NextRequest(
      "http://localhost:3000/admin/dashboard"
    );
    const response = await middleware(request);

    expect(response.status).toBe(307); // Redirect
    expect(response.headers.get("location")).toContain("/admin/login");
  });
});
```

---

## 📖 Best Practices

### 1. Keep Main Middleware Clean

**DO:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // High-level orchestration only
  const { isAdminRoute } = isProtectedRoute(pathname, adminRoute);
  if (!isAdminRoute) return;

  // Delegate to utility functions
  const { supabase, response } = createMiddlewareSupabaseClient(request);
  // ...
}
```

**DON'T:**

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // ❌ Don't put all logic here
  const supabase = createServerClient(/* ... 20 lines ... */);
  const user = await supabase.auth.getUser();
  if (!user) {
    const url = new URL(/* ... */);
    // ... more logic ...
  }
}
```

### 2. Use Type-Safe Functions

**DO:**

```typescript
// lib/middleware/auth-middleware.ts
export interface MiddlewareConfig {
  adminRoute: string;
  publicRoutes: string[];
}

export function getMiddlewareConfig(): MiddlewareConfig {
  return {
    adminRoute: process.env.ADMIN_ROUTE_SECRET || "admin",
    publicRoutes: ["/", "/about"],
  };
}
```

**DON'T:**

```typescript
// ❌ No types
export function getMiddlewareConfig() {
  return {
    adminRoute: process.env.ADMIN_ROUTE_SECRET || "admin",
    publicRoutes: ["/", "/about"],
  };
}
```

### 3. Document Your Functions

**DO:**

```typescript
/**
 * Create Supabase client for middleware
 *
 * @param request - Next.js request object
 * @returns Object with supabase client and response
 */
export function createMiddlewareSupabaseClient(request: NextRequest) {
  // ...
}
```

**DON'T:**

```typescript
// ❌ No documentation
export function createMiddlewareSupabaseClient(request: NextRequest) {
  // ...
}
```

### 4. Keep Middleware Lightweight

**Middleware runs on edge runtime** - keep it fast!

**DO:**

- ✅ Simple auth checks
- ✅ Route protection
- ✅ Redirects
- ✅ Cookie handling

**DON'T:**

- ❌ Heavy database queries
- ❌ Complex business logic
- ❌ External API calls (unless necessary)
- ❌ Large data processing

### 5. Use Proper Matcher Config

**DO:**

```typescript
export const config = {
  matcher: [
    // Exclude static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**DON'T:**

```typescript
// ❌ Too broad - runs on every request including static files
export const config = {
  matcher: "/:path*",
};
```

---

## 🔗 Related Files

- **`middleware.ts`** - Main middleware (root)
- **`lib/middleware/auth-middleware.ts`** - Utility functions
- **`lib/middleware/README.md`** - API documentation
- **`lib/auth.ts`** - Server-side auth helpers
- **`lib/supabase/server.ts`** - Supabase server client
- **`app/admin/layout.tsx`** - Admin layout

---

## 📚 References

- [Next.js 15 Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)

---

**Last Updated:** 2026-01-31
**Status:** ✅ Production Ready
**Architecture:** Modular with utilities in `lib/middleware/`
