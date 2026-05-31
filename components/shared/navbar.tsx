"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { usePageLoading } from "@/contexts/PageLoadingContext";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#certificates", label: "Certificates" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const { isLoading } = usePageLoading();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const pendingHashRef = React.useRef<string | null>(null);
  const scrollYRef = React.useRef(0);

  const closeMenu = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const scrollToHashTarget = React.useCallback((targetHash: string) => {
    const targetId = targetHash.replace(/^#/, "");
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return false;
    }

    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    window.history.pushState(null, "", targetHash);
    return true;
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const body = document.body;

    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      scrollYRef.current = window.scrollY;

      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.style.overflow = "hidden";

      const focusTimer = window.setTimeout(() => {
        const focusableElements =
          mobileMenuRef.current?.querySelectorAll<HTMLElement>(
            FOCUSABLE_SELECTOR,
          );
        focusableElements?.[0]?.focus();
      }, 0);

      return () => {
        window.clearTimeout(focusTimer);
        const savedScrollY = scrollYRef.current;
        body.style.position = "";
        body.style.top = "";
        body.style.left = "";
        body.style.right = "";
        body.style.width = "";
        body.style.overflow = "";
        window.scrollTo(0, savedScrollY);
      };
    }

    previousFocusRef.current?.focus();

    if (pendingHashRef.current) {
      const targetHash = pendingHashRef.current;
      pendingHashRef.current = null;

      window.requestAnimationFrame(() => {
        scrollToHashTarget(targetHash);
      });
    }
  }, [isOpen, scrollToHashTarget]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        );

      if (!focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  // Smooth scroll handler for hash links
  const handleHashClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    originalHref: string,
  ) => {
    if (originalHref.startsWith("#") && pathname !== "/contact") {
      const targetId = originalHref.slice(1);
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        closeMenu();
        return;
      }

      e.preventDefault();

      if (isOpen) {
        pendingHashRef.current = originalHref;
        closeMenu();
      } else {
        scrollToHashTarget(originalHref);
      }
      return;
    }

    closeMenu();
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-4 right-4 left-auto z-50 w-auto max-w-fit translate-x-0 transition-all duration-300 md:left-1/2 md:right-auto md:-translate-x-1/2",
          !isLoading && "animate-fade-in-down",
          isLoading && "opacity-0",
          isOpen &&
            "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100",
          scrolled
            ? "bg-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-md saturate-[180%] dark:bg-white/10 border border-white/20 dark:border-white/10"
            : "bg-white/10 backdrop-blur-sm saturate-[150%] dark:bg-white/5 border border-white/10 dark:border-white/5",
          "md:rounded-2xl",
        )}
        style={{
          borderTopColor: scrolled
            ? "rgba(255, 255, 255, 0.35)"
            : "rgba(255, 255, 255, 0.2)",
          boxShadow: scrolled
            ? "0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
            : "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
        }}
      >
        <div className="px-4 md:px-6">
          <div className="flex h-14 items-center justify-end md:h-16 md:justify-center">
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const href =
                  pathname === "/contact" && link.href.startsWith("#")
                    ? `/${link.href}`
                    : link.href;

                return (
                  <Link
                    key={link.href}
                    href={href}
                    onClick={(e) => handleHashClick(e, link.href)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-400"
                    style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Button
                ref={menuButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={
                  isOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-menu"
                className="hover:bg-white/20 dark:hover:bg-white/10"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[60] md:hidden transition-all duration-300",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          tabIndex={isOpen ? 0 : -1}
          aria-label="Close navigation menu"
          className="absolute inset-0 bg-white/70 backdrop-blur-md dark:bg-slate-950/70"
          onClick={closeMenu}
        />

        <div
          ref={mobileMenuRef}
          id="mobile-navigation-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className={cn(
            "absolute inset-0 flex min-h-screen flex-col bg-slate-50/95 px-6 pb-10 pt-6 text-slate-900 transition-transform duration-300 ease-out overscroll-contain dark:bg-slate-950/95 dark:text-white",
            isOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-white/60">
              <span>Navigation</span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="text-slate-900 hover:bg-slate-900/10 hover:text-slate-900 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="flex w-full max-w-sm flex-col items-center gap-3">
              {navLinks.map((link) => {
                const href =
                  pathname === "/contact" && link.href.startsWith("#")
                    ? `/${link.href}`
                    : link.href;

                return (
                  <Link
                    key={link.href}
                    href={href}
                    onClick={(e) => handleHashClick(e, link.href)}
                    className="w-full rounded-2xl border border-slate-900/10 bg-white/70 px-6 py-4 text-center text-2xl font-semibold tracking-tight text-slate-900 shadow-sm transition-all duration-200 hover:border-slate-900/20 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/25 dark:hover:bg-white/10 dark:focus-visible:ring-white/60"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
