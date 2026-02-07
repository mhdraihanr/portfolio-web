"use client";

import { Footer, BackToTop } from "@/components/shared";
import {
  PageLoadingProvider,
  usePageLoading,
} from "@/contexts/PageLoadingContext";
import { Atom } from "react-loading-indicators";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ProjectsLayoutContent({ children }: { children: React.ReactNode }) {
  const { isLoading, setPageReady } = usePageLoading();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState in effect
    requestAnimationFrame(() => setMounted(true));
    const timer = setTimeout(() => {
      setPageReady();
    }, 100);
    return () => clearTimeout(timer);
  }, [setPageReady]);

  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  const spinnerColor = isDark ? "#ffffff" : "#1f2937";
  const spinnerBg = isDark ? "bg-gray-950" : "bg-white";

  return (
    <>
      {isLoading && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center ${spinnerBg}`}
        >
          <Atom color={spinnerColor} size="medium" text="" textColor="" />
        </div>
      )}

      <main className="min-h-screen">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLoadingProvider>
      <ProjectsLayoutContent>{children}</ProjectsLayoutContent>
    </PageLoadingProvider>
  );
}
