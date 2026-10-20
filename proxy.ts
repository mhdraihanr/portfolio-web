/**
 * Next.js Route Protection
 *
 * Next.js 16 renamed the `middleware` convention to `proxy`: the file must be
 * `proxy.ts` and export a function named `proxy`. A `middleware.ts` file is no
 * longer executed, which silently disables every guard in this file.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */

import { type NextRequest } from "next/server";
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { adminRoute } = getMiddlewareConfig();

  // Check route type
  const { isAdminRoute, isLoginPage } = isProtectedRoute(pathname, adminRoute);

  // If not admin route, continue
  if (!isAdminRoute) {
    return;
  }

  // Expose the pathname to server components (the studio layout needs it to
  // tell the login page apart from protected pages).
  request.headers.set("x-pathname", pathname);

  // IP Whitelist check (optional - only if ADMIN_IP_WHITELIST is set)
  const isWhitelisted = checkIPWhitelist(request);
  if (!isWhitelisted) {
    return createIPBlockedResponse();
  }

  // Rate limiting for login page to prevent brute force and excessive access
  if (isLoginPage) {
    const isRateLimited = checkRateLimit(request);
    if (isRateLimited) {
      return createRateLimitResponse(request);
    }
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

  // Carry the pathname header on the Supabase response so cookie refreshes and
  // the layout's login-page check both work.
  response.headers.set("x-pathname", pathname);
  request.headers.set("x-pathname", pathname);
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
