"use client";

import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";

function SectionPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white dark:bg-gray-950 ${className}`}
      aria-hidden="true"
    />
  );
}

function LazySection({
  children,
  minHeight,
}: {
  children: ReactNode;
  minHeight: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref} style={{ minHeight }}>
      {shouldRender ? (
        children
      ) : (
        <SectionPlaceholder className="h-full min-h-[inherit]" />
      )}
    </div>
  );
}

const Certificates = dynamic(
  () => import("./certificates").then((mod) => mod.Certificates),
  {
    ssr: false,
    loading: () => <SectionPlaceholder className="min-h-[420px]" />,
  },
);

export function LazyHomeClientSections() {
  return (
    <LazySection minHeight="420px">
      <Certificates />
    </LazySection>
  );
}
