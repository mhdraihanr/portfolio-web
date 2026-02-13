/**
 * Auth Middleware Utilities
 *
 * Modular functions for authentication middleware
 * to keep main middleware.ts clean and testable
 */

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export interface MiddlewareConfig {
  adminRoute: string;
  publicRoutes: string[];
}

// Rate limiter configuration
const RATE_LIMIT_MAX_ATTEMPTS = 5; // Allow 5 requests per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Cleanup old entries every 30 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  },
  30 * 60 * 1000,
);

/**
 * Create Supabase client for middleware
 */
export function createMiddlewareSupabaseClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  return { supabase, response };
}

/**
 * Check if route is protected admin route
 */
export function isProtectedRoute(pathname: string, adminRoute: string) {
  return {
    isAdminRoute: pathname.startsWith(`/${adminRoute}`),
    isLoginPage: pathname === `/${adminRoute}/login`,
    isApiRoute: pathname.startsWith("/api"),
  };
}

/**
 * Handle authentication redirect
 */
export function createAuthRedirect(
  request: NextRequest,
  adminRoute: string,
  pathname: string,
) {
  const loginUrl = new URL(`/${adminRoute}/login`, request.url);
  loginUrl.searchParams.set("redirectTo", pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * Handle authenticated user on login page
 */
export function createDashboardRedirect(
  request: NextRequest,
  adminRoute: string,
) {
  return NextResponse.redirect(new URL(`/${adminRoute}`, request.url));
}

/**
 * Get middleware configuration from environment
 */
export function getMiddlewareConfig(): MiddlewareConfig {
  return {
    adminRoute: process.env.ADMIN_ROUTE_SECRET || "admin",
    publicRoutes: ["/", "/about", "/projects", "/contact"],
  };
}

/**
 * Get client IP address
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

/**
 * Check rate limit for login attempts
 * Returns true if request should be blocked
 */
export function checkRateLimit(request: NextRequest): boolean {
  const ip = getClientIP(request);
  const key = `login:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // First attempt or expired window - create new record
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  // Increment attempt count
  record.count += 1;
  rateLimitStore.set(key, record);

  // Check if exceeded limit
  return record.count > RATE_LIMIT_MAX_ATTEMPTS;
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(request: NextRequest): NextResponse {
  const ip = getClientIP(request);
  const key = `login:${ip}`;
  const record = rateLimitStore.get(key);

  const resetAt = record ? new Date(record.resetAt).toISOString() : "unknown";
  const remainingMinutes = record
    ? Math.ceil((record.resetAt - Date.now()) / 60000)
    : 15;

  return new NextResponse(
    JSON.stringify({
      error: "Too many login attempts",
      message: `You have exceeded the maximum number of login attempts. Please try again in ${remainingMinutes} minutes.`,
      resetAt,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(
          Math.ceil(
            (record?.resetAt ||
              Date.now() + RATE_LIMIT_WINDOW_MS - Date.now()) / 1000,
          ),
        ),
      },
    },
  );
}

/**
 * Check if IP is whitelisted (optional feature)
 * Returns true if IP is allowed (whitelist disabled or IP in list)
 * Returns false if IP is blocked (whitelist enabled and IP not in list)
 */
export function checkIPWhitelist(request: NextRequest): boolean {
  const whitelist = process.env.ADMIN_IP_WHITELIST;

  // If whitelist is not set or empty, allow all IPs
  if (!whitelist || whitelist.trim() === "") {
    return true;
  }

  const clientIP = getClientIP(request);

  // Parse comma-separated list of IPs
  const allowedIPs = whitelist
    .split(",")
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);

  // Check if client IP is in whitelist
  return allowedIPs.includes(clientIP);
}

/**
 * Create IP blocked error response
 */
export function createIPBlockedResponse(): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: "Access Denied",
      message:
        "Your IP address is not authorized to access this admin panel. Please contact the administrator.",
    }),
    {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
