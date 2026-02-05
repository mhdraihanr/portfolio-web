"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#certificates", label: "Certificates" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-auto max-w-fit",
        scrolled
          ? "bg-white/15 dark:bg-white/10 backdrop-blur-md saturate-[180%] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10"
          : "bg-white/10 dark:bg-white/5 backdrop-blur-sm saturate-[150%] border border-white/10 dark:border-white/5",
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
        <div className="flex h-14 md:h-16 items-center justify-between md:justify-center">
          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              // If on contact page and link is a hash link, redirect to home with hash
              const href =
                pathname === "/contact" && link.href.startsWith("#")
                  ? `/${link.href}`
                  : link.href;

              return (
                <Link
                  key={link.href}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
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

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              aria-expanded={isOpen}
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

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-2 pb-4 px-2 space-y-1">
            {navLinks.map((link) => {
              // If on contact page and link is a hash link, redirect to home with hash
              const href =
                pathname === "/contact" && link.href.startsWith("#")
                  ? `/${link.href}`
                  : link.href;

              return (
                <Link
                  key={link.href}
                  href={href}
                  className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg transition-all duration-200 text-center"
                  style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
