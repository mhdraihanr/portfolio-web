/**
 * Next.js Middleware for Route Protection
 * 
 * Location: Must be at project root (Next.js convention)
 * Purpose: Protect admin routes with authentication
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
