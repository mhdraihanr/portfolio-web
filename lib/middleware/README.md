# 🛡️ Middleware Utilities

Modular middleware utilities untuk menjaga `middleware.ts` tetap clean dan testable.

## 📁 Structure

```
lib/middleware/
├── auth-middleware.ts    # Auth middleware utilities
└── README.md            # This file
```

## 🎯 Purpose

Memisahkan logic middleware ke dalam fungsi-fungsi modular yang:
- ✅ Reusable
- ✅ Testable
- ✅ Maintainable
- ✅ Type-safe

## 📚 Available Functions

### `createMiddlewareSupabaseClient(request: NextRequest)`

Create Supabase client untuk middleware dengan proper cookie handling.

**Returns:** `{ supabase, response }`

**Example:**
```typescript
const { supabase, response } = createMiddlewareSupabaseClient(request);
const { data: { user } } = await supabase.auth.getUser();
```

### `isProtectedRoute(pathname: string, adminRoute: string)`

Check apakah route adalah protected admin route.

**Returns:** `{ isAdminRoute, isLoginPage, isApiRoute }`

**Example:**
```typescript
const { isAdminRoute, isLoginPage } = isProtectedRoute("/kingpersib/dashboard", "kingpersib");
// isAdminRoute: true
// isLoginPage: false
```

### `createAuthRedirect(request, adminRoute, pathname)`

Create redirect response ke login page dengan `redirectTo` parameter.

**Returns:** `NextResponse` (redirect)

**Example:**
```typescript
return createAuthRedirect(request, "kingpersib", "/kingpersib/projects");
// Redirects to: /kingpersib/login?redirectTo=/kingpersib/projects
```

### `createDashboardRedirect(request, adminRoute)`

Create redirect response ke dashboard (untuk authenticated user di login page).

**Returns:** `NextResponse` (redirect)

**Example:**
```typescript
return createDashboardRedirect(request, "kingpersib");
// Redirects to: /kingpersib
```

### `getMiddlewareConfig()`

Get middleware configuration dari environment variables.

**Returns:** `MiddlewareConfig`

**Example:**
```typescript
const { adminRoute, publicRoutes } = getMiddlewareConfig();
// adminRoute: "kingpersib" (from ADMIN_ROUTE_SECRET)
// publicRoutes: ["/", "/about", "/projects", "/contact"]
```

## 🔧 Usage in Middleware

**File:** `middleware.ts` (root level)

```typescript
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

  const { isAdminRoute, isLoginPage } = isProtectedRoute(pathname, adminRoute);

  if (!isAdminRoute) return;

  const { supabase, response } = createMiddlewareSupabaseClient(request);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isLoginPage) {
    return createAuthRedirect(request, adminRoute, pathname);
  }

  if (user && isLoginPage) {
    return createDashboardRedirect(request, adminRoute);
  }

  return response;
}
```

## ✅ Benefits

### Before (Monolithic)
```typescript
// middleware.ts (80 lines)
// - All logic in one file
// - Hard to test
// - Hard to maintain
// - Repeated code
```

### After (Modular)
```typescript
// middleware.ts (40 lines)
// - Clean and readable
// - Easy to test each function
// - Easy to maintain
// - Reusable utilities

// lib/middleware/auth-middleware.ts (90 lines)
// - Modular functions
// - Well documented
// - Type-safe
// - Testable
```

## 🧪 Testing

Functions dapat di-test secara individual:

```typescript
// __tests__/middleware/auth-middleware.test.ts
import { isProtectedRoute } from "@/lib/middleware/auth-middleware";

describe("isProtectedRoute", () => {
  it("should identify admin routes", () => {
    const result = isProtectedRoute("/kingpersib/dashboard", "kingpersib");
    expect(result.isAdminRoute).toBe(true);
  });

  it("should identify login page", () => {
    const result = isProtectedRoute("/kingpersib/login", "kingpersib");
    expect(result.isLoginPage).toBe(true);
  });
});
```

## 📝 Notes

- **Middleware location:** `middleware.ts` HARUS di root level (Next.js convention)
- **Utilities location:** `lib/middleware/` untuk modular functions
- **Single middleware:** Next.js hanya support 1 middleware file per project
- **Performance:** Middleware runs on edge runtime, keep it lightweight

## 🔗 Related Files

- `middleware.ts` - Main middleware file (root)
- `lib/auth.ts` - Server-side auth utilities
- `lib/supabase/server.ts` - Supabase server client
- `app/kingpersib/layout.tsx` - Admin layout with auth check

---

**Last Updated:** 2026-01-31
**Status:** ✅ Production Ready
