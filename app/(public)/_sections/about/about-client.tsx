"use client";

import { Code2, Database, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { useMobileWidth } from "@/hooks/use-mobile-width";
import { getDeviconSvgUrl, localizeIconSvgUrl } from "@/lib/devicon";
import type { HomepageSkillsByCategory } from ".";
import type { Profile } from "@/types/profile";

interface AboutClientProps {
  skills: HomepageSkillsByCategory;
  profile: Profile | null;
}

// Known monochrome black icons that need inverting in dark mode
const MONOCHROME_ICONS = ["nextjs", "github", "express", "socketio"];

function shouldInvertInDarkMode(
  iconSrc?: string | null,
  skillName?: string,
): boolean {
  if (!iconSrc && !skillName) return false;
  const target = `${iconSrc || ""} ${skillName || ""}`.toLowerCase();
  return MONOCHROME_ICONS.some((name) => target.includes(name));
}

function SkillBadge({
  skill,
}: {
  skill: HomepageSkillsByCategory["frontend"][number];
}) {
  const iconSrc =
    localizeIconSvgUrl(skill.icon_svg) || getDeviconSvgUrl(skill.icon);
  const invert = shouldInvertInDarkMode(iconSrc, skill.name);

  return (
    <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2">
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={skill.name}
          width={16}
          height={16}
          unoptimized
          className={`w-4 h-4 ${invert ? "dark:invert" : ""}`}
        />
      ) : skill.icon ? (
        <i className={`${skill.icon} text-lg`}></i>
      ) : null}
      {skill.name}
    </span>
  );
}

export function AboutClient({ skills, profile }: AboutClientProps) {
  useMobileWidth();

  return (
    <section id="about" className="py-15 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ScrollReveal className="lg:col-span-4" delay={0.1}>
              <div className="relative w-full aspect-square max-w-sm mx-auto lg:mx-0">
                {/* Decorative gradient blobs behind the cutout photo */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  aria-hidden="true"
                >
                  <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary-300/80 via-primary-200/50 to-transparent dark:from-primary-600/60 dark:via-primary-700/30 blur-2xl" />
                  <div className="absolute w-[58%] h-[58%] rounded-full bg-gradient-to-bl from-secondary-300/70 via-secondary-200/40 to-transparent dark:from-secondary-500/40 dark:via-secondary-600/20 blur-3xl translate-x-10 translate-y-10" />
                </div>

                {/* Cutout photo (PNG transparent) with soft body shadow */}
                <Image
                  src={profile?.photo_url || ""}
                  alt={`${profile?.full_name ?? "Raihan"} - Fullstack Developer`}
                  width={384}
                  height={384}
                  className="relative w-full h-full object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.30)] drop-shadow-[0_45px_45px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_25px_rgba(0,0,0,0.65)] dark:drop-shadow-[0_45px_45px_rgba(0,0,0,0.40)]"
                  sizes="(max-width: 1024px) 384px, 33vw"
                />
              </div>
            </ScrollReveal>

            <div className="lg:col-span-8 space-y-6">
              <div>
                <ScrollReveal delay={0.05} once>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {profile?.full_name ?? "Muhammad Raihan Rafliansyah"}
                  </h3>
                </ScrollReveal>
                <ScrollReveal delay={0.2} once>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <span className="text-lg font-medium">
                        {profile?.tagline ?? "Fullstack Developer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <span>Indonesia</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <div className="space-y-4 leading-relaxed">
                <ScrollReveal delay={0.1} once>
                  <p className="whitespace-pre-line text-gray-700 dark:text-gray-300">
                    {profile?.about_text ??
                      "Passionate Fullstack Developer dedicated to building beautiful, functional, and user-friendly web applications. By bridging the gap between frontend and backend technologies, I transform complex ideas into reality through clean code and modern design principles."}
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </div>

          <ScrollReveal className="pt-8" delay={0.1} once>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Skills & Technologies
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Frontend Development
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.frontend.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Backend Development
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.backend.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                  <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                    Tools & Others
                  </h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
