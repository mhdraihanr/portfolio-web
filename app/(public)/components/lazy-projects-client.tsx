"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/types/project";

const ProjectsClient = dynamic(
  () => import("./projects-client").then((mod) => mod.ProjectsClient),
  {
    ssr: false,
    loading: () => <ProjectsPlaceholder />,
  },
);

function ProjectsPlaceholder() {
  return (
    <section
      id="projects"
      className="pt-12 pb-20 bg-white dark:bg-gray-950"
      aria-hidden="true"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto min-h-[960px]" />
      </div>
    </section>
  );
}

interface LazyProjectsClientProps {
  projects: Project[];
}

export function LazyProjectsClient({ projects }: LazyProjectsClientProps) {
  const ref = useRef<HTMLElement>(null);
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
    <section ref={ref} aria-label="Featured projects section">
      {shouldRender ? (
        <ProjectsClient projects={projects} />
      ) : (
        <ProjectsPlaceholder />
      )}
    </section>
  );
}
