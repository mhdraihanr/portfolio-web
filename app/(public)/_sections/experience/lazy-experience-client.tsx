"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { WorkExperience } from "@/types/experience";

const ExperienceClient = dynamic(
  () => import("./experience-client").then((mod) => mod.ExperienceClient),
  {
    ssr: false,
    loading: () => <ExperiencePlaceholder />,
  },
);

function ExperiencePlaceholder() {
  return (
    <section
      id="experience"
      className="relative min-h-[760px] pt-12 pb-20 bg-white dark:bg-gray-950"
      aria-hidden="true"
    />
  );
}

interface LazyExperienceClientProps {
  experiences: WorkExperience[];
}

export function LazyExperienceClient({
  experiences,
}: LazyExperienceClientProps) {
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
      { rootMargin: "700px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref}>
      {shouldRender ? (
        <ExperienceClient experiences={experiences} />
      ) : (
        <ExperiencePlaceholder />
      )}
    </div>
  );
}
