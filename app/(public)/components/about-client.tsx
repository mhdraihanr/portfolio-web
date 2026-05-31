"use client";

import { Code2, Database, Globe, MapPin } from "lucide-react";
import Image from "next/image";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { useMobileWidth } from "@/lib/use-mobile-width";
import type { HomepageSkillsByCategory } from "./about";

interface AboutClientProps {
  skills: HomepageSkillsByCategory;
}

function getDeviconSvgUrl(icon?: string | null) {
  if (!icon) return null;

  const match = icon.match(/^devicon-([a-z0-9-]+?)-([a-z0-9-]+)(?:\s|$)/i);
  if (!match) return null;

  const [, name, variant] = match;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;
}

function SkillBadge({
  skill,
}: {
  skill: HomepageSkillsByCategory["frontend"][number];
}) {
  const iconSrc = skill.icon_svg || getDeviconSvgUrl(skill.icon);

  return (
    <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2">
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={skill.name}
          width={16}
          height={16}
          unoptimized
          className="w-4 h-4 dark:invert"
        />
      ) : skill.icon ? (
        <i className={`${skill.icon} text-lg`}></i>
      ) : null}
      {skill.name}
    </span>
  );
}

export function AboutClient({ skills }: AboutClientProps) {
  useMobileWidth();

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <ScrollReveal className="lg:col-span-4" delay={0.1}>
              <div className="relative w-full aspect-square max-w-sm mx-auto lg:mx-0">
                <div className="relative bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
                  <Image
                    src="/profile.jpg"
                    alt="Raihan - Fullstack Developer"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 1024px) 384px, 33vw"
                  />
                </div>
              </div>
            </ScrollReveal>

            <div className="lg:col-span-8 space-y-6">
              <div>
                <ScrollReveal delay={0.05} once>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Muhammad Raihan Rafliansyah
                  </h3>
                </ScrollReveal>
                <ScrollReveal delay={0.2} once>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <span className="text-lg font-medium">
                        Fullstack Developer
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
                  <p className="text-gray-700 dark:text-gray-300">
                    Passionate Fullstack Developer dedicated to building
                    beautiful, functional, and user-friendly web applications.
                    By bridging the gap between frontend and backend
                    technologies, I transform complex ideas into reality through
                    clean code and modern design principles.
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.18} once>
                  <p className="text-gray-700 dark:text-gray-300">
                    Focused on optimizing AI coding assistants to streamline
                    workflows and accelerate prototyping. I constantly refine
                    prompt engineering to push the boundaries of AI-driven
                    software development.
                  </p>
                </ScrollReveal>
              </div>

              <ScrollReveal className="pt-4" delay={0.1} once>
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
        </div>
      </div>
    </section>
  );
}
