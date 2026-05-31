"use client";

import { Navbar, Footer, BackToTop, GlobalLoader } from "@/components/shared";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  PageLoadingProvider,
  usePageLoading,
} from "@/contexts/PageLoadingContext";
import { useTheme } from "next-themes";
import { useMobileWidth } from "@/lib/use-mobile-width";

function PublicLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isLoading } = usePageLoading();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobileWidth = useMobileWidth();

  // Track mounting
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Get current theme
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";

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
      {isLoading && !isMobileWidth && (
        <div className="hidden md:block">
          <GlobalLoader isDark={isDark} />
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
