import { getUser, getAdminRoute, requireAuth } from "@/lib/auth";
import { headers } from "next/headers";
import { Sidebar } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  const adminRoute = getAdminRoute();

  // Defence in depth: proxy.ts only protects at the network boundary. If the
  // proxy is misconfigured or not executed, every studio page would render for
  // anonymous visitors. The login page is the one route that must stay public.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLoginPage = pathname === `/${adminRoute}/login`;

  if (!user && !isLoginPage) {
    await requireAuth();
  }

  return (
    <>
      <link
        rel="stylesheet"
        type="text/css"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
      />

      {/* If no user, just render children (for login page)
      Proxy handles redirect for protected routes */}
      {!user ? (
        <>{children}</>
      ) : (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Sidebar */}
          <Sidebar adminRoute={adminRoute} userEmail={user?.email} />

          {/* Main Content */}
          <main className="flex-1 md:ml-64 overflow-y-auto">{children}</main>
        </div>
      )}
    </>
  );
}
