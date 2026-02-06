"use client";

import type { WorkExperience } from "@/types/experience";
import { Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Orb from "@/components/Orb";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

interface ExperienceClientProps {
  experiences: WorkExperience[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function ExperienceClient({ experiences }: ExperienceClientProps) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Get current theme with fallback
  const currentTheme = mounted ? theme || resolvedTheme : "dark";
  const isDark = currentTheme === "dark";
  const bgClass = isDark ? "bg-gray-950" : "bg-white";

  // Show only 3 experiences initially, all when showAll is true
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 3);
  const hasMore = experiences.length > 3;

  return (
    <section id="experience" className="relative pt-12 pb-20 overflow-hidden">
      {/* Orb Background */}
      <div className={`absolute inset-0 ${bgClass}`}>
        {mounted && (
          <Orb
            hue={206}
            hoverIntensity={0.35}
            rotateOnHover={false}
            forceHoverState
            backgroundColor={isDark ? "#030712" : "#ffffff"}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Career</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Work Experience
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My professional journey and contributions across various roles and
              organizations.
            </p>
          </ScrollReveal>

          {/* Experience Timeline */}
          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No work experience available at the moment.
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Center Line - Hidden on mobile */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 via-primary-500/30 to-transparent" />

              <div className="space-y-12 md:space-y-16">
                {displayedExperiences.map((exp, index) => {
                  const isLeft = index % 2 === 0;

                  return (
                    <ScrollReveal
                      key={exp.id}
                      delay={index * 0.1}
                      duration={0.7}
                      direction={isLeft ? "left" : "right"}
                      distance={30}
                    >
                      <div
                        className={`relative flex flex-col md:flex-row items-center gap-8 ${
                          isLeft ? "md:flex-row-reverse" : ""
                        }`}
                      >
                        {/* Timeline Dot - Hidden on mobile */}
                        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="relative">
                            {/* Outer ring - stroke only in light mode, filled in dark mode */}
                            <div className="w-4 h-4 rounded-full border-2 border-primary-500 dark:bg-primary-500 dark:border-0 animate-pulse" />
                            {/* Inner dot - only visible in dark mode */}
                            <div className="absolute inset-0 w-4 h-4 rounded-full dark:bg-primary-500 dark:scale-50 hidden dark:block" />
                          </div>
                        </div>

                        {/* Spacer for zigzag alignment - Desktop only */}
                        <div className="hidden md:block md:w-[calc(50%-2rem)]" />

                        {/* Experience Card */}
                        <div className="w-full md:w-[calc(50%-2rem)]">
                          <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:scale-[1.02] transition-all duration-300">
                            {/* Decorative Corner Accent */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/5 rounded-bl-full" />

                            <div className="relative space-y-3">
                              {/* Company Logo & Position */}
                              <div className="flex items-start gap-4">
                                {/* Company Logo */}
                                {exp.logo_url ? (
                                  <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <Image
                                      src={exp.logo_url}
                                      alt={`${exp.company} logo`}
                                      width={48}
                                      height={48}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex-shrink-0 w-12 h-12 rounded-lg border-2 border-primary-500/30 dark:border-0 dark:bg-primary-500/10 flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-primary-600 dark:text-primary-500" />
                                  </div>
                                )}

                                {/* Position & Type Badge */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">
                                    {exp.position}
                                  </h3>
                                  {exp.employment_type && (
                                    <Badge
                                      variant="secondary"
                                      className="mt-1 text-xs"
                                    >
                                      {exp.employment_type}
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Company */}
                              <div className="flex items-center gap-2">
                                <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                                  {exp.company}
                                </p>
                              </div>

                              {/* Date Range */}
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 text-primary-600 dark:text-primary-500 flex-shrink-0" />
                                <span className="text-sm font-medium">
                                  {formatDate(exp.start_date)} -{" "}
                                  {exp.is_current ? (
                                    <span className="text-primary-600 dark:text-primary-500 font-semibold">
                                      Present
                                    </span>
                                  ) : (
                                    formatDate(exp.end_date)
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Hover Border Glow */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>

              {/* See More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
                  >
                    {showAll
                      ? "Show Less"
                      : `See More (${experiences.length - 3} more)`}
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
