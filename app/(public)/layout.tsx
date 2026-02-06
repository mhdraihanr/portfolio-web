"use client";

import { Navbar, Footer, BackToTop } from "@/components/shared";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PageLoadingProvider,
  usePageLoading,
} from "@/contexts/PageLoadingContext";
import { Atom } from "react-loading-indicators";
import { useTheme } from "next-themes";

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = usePageLoading();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Track mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current theme
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  const spinnerColor = isDark ? "#ffffff" : "#1f2937";
  const spinnerBg = isDark ? "bg-gray-950" : "bg-white";

  // Handle hash navigation on page load (from contact page to home with hash)
  useEffect(() => {
    // Only run on home page
    if (pathname === "/" && window.location.hash) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        const hash = window.location.hash;
        const targetId = hash.slice(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [pathname]);

  return (
    <>
      {/* Global Loading Indicator */}
      {isLoading && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${spinnerBg}`}
        >
          <Atom color={spinnerColor} size="medium" text="" textColor="" />
        </div>
      )}

      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLoadingProvider>
      <PublicLayoutContent>{children}</PublicLayoutContent>
    </PageLoadingProvider>
  );
}
