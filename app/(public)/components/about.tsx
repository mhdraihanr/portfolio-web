"use client";

import { useEffect, useState } from "react";
import { MapPin, Code2, Database, Globe } from "lucide-react";
import Image from "next/image";
import SplitText from "@/components/SplitText";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { createClient } from "@/lib/supabase/client";

interface Skill {
  name: string;
  icon?: string | null;
  icon_svg?: string | null;
}

export function About() {
  const [skills, setSkills] = useState<{
    frontend: Skill[];
    backend: Skill[];
    tools: Skill[];
  }>({
    frontend: [],
    backend: [],
    tools: [],
  });

  useEffect(() => {
    async function fetchSkills() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("skills")
          .select("name, icon, icon_svg, category")
          .eq("is_visible", true)
          .order("order_index", { ascending: true });

        if (error) throw error;

        if (data) {
          const typedData = data as {
            name: string;
            icon: string | null;
            icon_svg: string | null;
            category: string;
          }[];
          const grouped = {
            frontend: typedData.filter((s) => s.category === "frontend"),
            backend: typedData.filter((s) => s.category === "backend"),
            tools: typedData.filter(
              (s) => s.category === "tools" || s.category === "others",
            ),
          };
          setSkills(grouped);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Fallback to empty - skills section will just be empty
      }
    }

    fetchSkills();
  }, []);

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Profile Photo */}
            <ScrollReveal className="lg:col-span-4" delay={0.1}>
              <div className="relative w-full aspect-square max-w-sm mx-auto lg:mx-0">
                <div className="relative bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-xl">
                  <Image
                    src="/profile.jpg"
                    alt="Raihan - Fullstack Developer"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Right Column - Information */}
            <div className="lg:col-span-8 space-y-6">
              {/* Name and Title */}
              <div>
                <SplitText
                  text="Muhammad Raihan Rafliansyah"
                  className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  delay={50}
                  duration={0.8}
                  splitType="chars"
                  tag="h3"
                  textAlign="left"
                  from={{ opacity: 0, y: 20 }}
                  to={{ opacity: 1, y: 0 }}
                  repeatable={true}
                />
                <ScrollReveal delay={0.2}>
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

              {/* Bio Text */}
              <div className="space-y-4 leading-relaxed">
                <SplitText
                  text="I'm a passionate Fullstack Developer with a love for creating beautiful, functional, and user-friendly web applications. With expertise in both frontend and backend technologies, I bring ideas to life through clean code and modern design."
                  className="text-gray-700 dark:text-gray-300"
                  delay={20}
                  duration={0.6}
                  splitType="words"
                  tag="p"
                  textAlign="left"
                  from={{ opacity: 0, y: 15 }}
                  to={{ opacity: 1, y: 0 }}
                  repeatable={true}
                />

                <SplitText
                  text="When I'm not coding, you'll find me exploring new frameworks, contributing to open-source projects, or sharing knowledge with the developer community."
                  className="text-gray-700 dark:text-gray-300"
                  delay={20}
                  duration={0.6}
                  splitType="words"
                  tag="p"
                  textAlign="left"
                  from={{ opacity: 0, y: 15 }}
                  to={{ opacity: 1, y: 0 }}
                  repeatable={true}
                />
              </div>

              {/* Skills Section */}
              <ScrollReveal className="pt-4" delay={0.1}>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Skills & Technologies
                </h4>

                <div className="space-y-4">
                  {/* Frontend Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                        Frontend Development
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.frontend.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.icon_svg ? (
                            <img
                              src={skill.icon_svg}
                              alt={skill.name}
                              className="w-4 h-4 dark:invert"
                            />
                          ) : skill.icon ? (
                            <i className={`${skill.icon} text-lg`}></i>
                          ) : null}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Backend Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                        Backend Development
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.backend.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.icon_svg ? (
                            <img
                              src={skill.icon_svg}
                              alt={skill.name}
                              className="w-4 h-4 dark:invert"
                            />
                          ) : skill.icon ? (
                            <i className={`${skill.icon} text-lg`}></i>
                          ) : null}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Others */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 className="h-4 w-4 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white text-sm">
                        Tools & Others
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.icon_svg ? (
                            <img
                              src={skill.icon_svg}
                              alt={skill.name}
                              className="w-4 h-4 dark:invert"
                            />
                          ) : skill.icon ? (
                            <i className={`${skill.icon} text-lg`}></i>
                          ) : null}
                          {skill.name}
                        </span>
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
