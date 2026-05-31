"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMobileWidth } from "@/lib/use-mobile-width";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  threshold?: number;
  once?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 40,
  threshold = 0.1,
  once = false, // Changed to false for repeatable animations
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Check if user prefers reduced motion (computed once during initialization)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileWidth = useMobileWidth();
  const disableAnimation = prefersReducedMotion || isMobileWidth;
  const [isVisible, setIsVisible] = useState(disableAnimation);
  const shouldAnimateOnce = once || isMobileWidth;

  useEffect(() => {
    setIsVisible(disableAnimation);
  }, [disableAnimation]);

  useEffect(() => {
    const element = ref.current;
    if (!element || disableAnimation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state on both entry and exit
        setIsVisible(entry.isIntersecting);

        // Stop observing after first intersection when explicitly once or on mobile widths.
        if (entry.isIntersecting && shouldAnimateOnce) {
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disableAnimation, threshold, shouldAnimateOnce]);

  const getTransform = () => {
    switch (direction) {
      case "up":
        return `translateY(${distance}px)`;
      case "down":
        return `translateY(-${distance}px)`;
      case "left":
        return `translateX(${distance}px)`;
      case "right":
        return `translateX(-${distance}px)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={
        disableAnimation
          ? undefined
          : {
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translate(0)" : getTransform(),
              transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
              willChange: "opacity, transform",
            }
      }
    >
      {children}
    </div>
  );
}
