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
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
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
  pathname: string
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
  adminRoute: string
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
