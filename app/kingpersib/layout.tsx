import { getUser, getAdminRoute } from "@/lib/auth";
import { Sidebar } from "@/components/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user but don't require auth (middleware handles redirects)
  const user = await getUser();
  const adminRoute = getAdminRoute();

  // If no user, just render children (for login page)
  // Middleware will handle redirect for protected routes
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar adminRoute={adminRoute} userEmail={user?.email} />

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
