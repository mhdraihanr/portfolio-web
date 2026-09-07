"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useMobileWidth } from "@/hooks/use-mobile-width";

const subscribeReducedMotion = (callback: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

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
  const isMobileWidth = useMobileWidth();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [isVisible, setIsVisible] = useState(false);
  const disableAnimation = prefersReducedMotion || isMobileWidth;
  const shouldAnimateOnce = once || isMobileWidth;

  useEffect(() => {
    const element = ref.current;
    if (!element || disableAnimation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // ponytail: hysteresis — element scrolled past the top edge stays revealed,
        // so isIntersecting can't flicker when it straddles the viewport top.
        setIsVisible(entry.isIntersecting || entry.boundingClientRect.top < 0);

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
