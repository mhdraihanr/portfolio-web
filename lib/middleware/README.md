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
const {
  data: { user },
} = await supabase.auth.getUser();
```

### `isProtectedRoute(pathname: string, adminRoute: string)`

Check apakah route adalah protected admin route.

**Returns:** `{ isAdminRoute, isLoginPage, isApiRoute }`

**Example:**

```typescript
const { isAdminRoute, isLoginPage } = isProtectedRoute(
  "/kingpersib/dashboard",
  "kingpersib",
);
// isAdminRoute: true
// isLoginPage: false
```

### `createAuthRedirect(request, adminRoute, pathname)`

Create redirect response ke login page dengan `redirectTo` parameter.

**Returns:** `NextResponse` (redirect)

**Example:**

```typescript
return createAuthRedirect(request, "admin", "/admin/projects");
// Redirects to: /admin/login?redirectTo=/admin/projects
```

### `createDashboardRedirect(request, adminRoute)`

Create redirect response ke dashboard (untuk authenticated user di login page).

**Returns:** `NextResponse` (redirect)

**Example:**

```typescript
return createDashboardRedirect(request, "admin");
// Redirects to: /admin
```

### `getMiddlewareConfig()`

Get middleware configuration dari environment variables.

**Returns:** `MiddlewareConfig`

**Example:**

```typescript
const { adminRoute, publicRoutes } = getMiddlewareConfig();
// adminRoute: "admin" (from ADMIN_ROUTE_SECRET)
// publicRoutes: ["/", "/about", "/projects", "/contact"]
```

### `getClientIP(request: NextRequest)`

Get client IP address dari request headers.

**Returns:** `string` (IP address or "unknown")

**Example:**

```typescript
const ip = getClientIP(request);
// Returns: "192.168.1.100" or "unknown"
```

### `checkRateLimit(request: NextRequest)`

Check rate limit untuk login page berdasarkan IP address.

**Returns:** `boolean` (true = blocked, false = allowed)

**Configuration:**

- Max 5 requests per IP
- Time window: 15 minutes
- Auto cleanup every 30 minutes

**Example:**

```typescript
if (isLoginPage) {
  const isRateLimited = checkRateLimit(request);
  if (isRateLimited) {
    return createRateLimitResponse(request);
  }
}
```

### `createRateLimitResponse(request: NextRequest)`

Create 429 error response untuk rate limited requests.

**Returns:** `NextResponse` (HTTP 429)

**Example:**

```typescript
return createRateLimitResponse(request);
// HTTP 429: "Too many login attempts. Please try again in X minutes."
```

### `checkIPWhitelist(request: NextRequest)`

Check apakah IP address ada di whitelist.

**Returns:** `boolean` (true = allowed, false = blocked)

**Configuration:** Set `ADMIN_IP_WHITELIST` in `.env.local`

**Example:**

```typescript
const isWhitelisted = checkIPWhitelist(request);
if (!isWhitelisted) {
  return createIPBlockedResponse();
}
```

### `createIPBlockedResponse()`

Create 403 error response untuk non-whitelisted IPs.

**Returns:** `NextResponse` (HTTP 403)

## 🔧 Usage in Middleware

**File:** `middleware.ts` (root level)

```typescript
import {
  createMiddlewareSupabaseClient,
  isProtectedRoute,
  createAuthRedirect,
  createDashboardRedirect,
  getMiddlewareConfig,
  checkRateLimit,
  createRateLimitResponse,
  checkIPWhitelist,
  createIPBlockedResponse,
} from "@/lib/middleware/auth-middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { adminRoute } = getMiddlewareConfig();

  const { isAdminRoute, isLoginPage } = isProtectedRoute(pathname, adminRoute);

  if (!isAdminRoute) return;

  // IP Whitelist check (optional, if ADMIN_IP_WHITELIST is set)
  const isWhitelisted = checkIPWhitelist(request);
  if (!isWhitelisted) {
    return createIPBlockedResponse();
  }

  // Rate limiting for login page
  if (isLoginPage) {
    const isRateLimited = checkRateLimit(request);
    if (isRateLimited) {
      return createRateLimitResponse(request);
    }
  }

  const { supabase, response } = createMiddlewareSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    const result = isProtectedRoute("/admin/dashboard", "admin");
    expect(result.isAdminRoute).toBe(true);
  });

  it("should identify login page", () => {
    const result = isProtectedRoute("/admin/login", "admin");
    expect(result.isLoginPage).toBe(true);
  });
});
```

## �️ Security Features

### Rate Limiting

**Purpose:** Prevent brute force attacks pada login page

**Configuration:**

```typescript
RATE_LIMIT_MAX_ATTEMPTS = 5; // Max requests per window
RATE_LIMIT_WINDOW_MS = 900000; // 15 minutes in ms
```

**How it works:**

- Tracks requests by IP address
- Max 5 requests per 15 minutes per IP
- Returns HTTP 429 when exceeded
- Auto cleanup old entries every 30 minutes

### IP Whitelist (Optional)

**Purpose:** Restrict admin access to specific IP addresses

**Configuration in `.env.local`:**

```env
# Leave empty to disable (allow all IPs)
ADMIN_IP_WHITELIST=

# Single IP
ADMIN_IP_WHITELIST=192.168.1.100

# Multiple IPs (comma-separated)
ADMIN_IP_WHITELIST=192.168.1.100,203.0.113.45,198.51.100.30
```

**How it works:**

- If `ADMIN_IP_WHITELIST` is empty/not set → All IPs allowed
- If set → Only whitelisted IPs can access admin routes
- Returns HTTP 403 for non-whitelisted IPs

**How to get your IP:**

```bash
# Method 1: Using curl
curl ifconfig.me

# Method 2: Using website
# Visit: https://whatismyipaddress.com/

# Method 3: Windows CMD
curl api.ipify.org

# Method 4: PowerShell
(Invoke-WebRequest -Uri "https://api.ipify.org").Content
```

## 📝 Notes

- **Middleware location:** `middleware.ts` HARUS di root level (Next.js convention)
- **Utilities location:** `lib/middleware/` untuk modular functions
- **Single middleware:** Next.js hanya support 1 middleware file per project
- **Performance:** Middleware runs on edge runtime, keep it lightweight
- **Rate limiting:** In-memory store, akan reset jika server restart
- **IP Whitelist:** Optional feature, set via environment variable

## 🔗 Related Files

- `middleware.ts` - Main middleware file (root)
- `lib/auth.ts` - Server-side auth utilities
- `lib/supabase/server.ts` - Supabase server client
- `app/admin/layout.tsx` - Admin layout with auth check
- `app/admin/login/page.tsx` - Login page (public within admin route)

---

**Last Updated:** 2026-01-31
**Status:** ✅ Production Ready
