"use client";

import { MapPin, Code2, Database, Globe } from "lucide-react";
import Image from "next/image";

interface Skill {
  name: string;
  icon?: string;
  iconSvg?: string;
}

export function About() {
  // Skills data with categories and devicon classes or SVG urls
  const skills: {
    frontend: Skill[];
    backend: Skill[];
    tools: Skill[];
  } = {
    frontend: [
      { name: "React", icon: "devicon-react-original colored" },
      {
        name: "Next.js",
        iconSvg:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
      },
      { name: "TypeScript", icon: "devicon-typescript-plain colored" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-original colored" },
      { name: "JavaScript", icon: "devicon-javascript-plain colored" },
      { name: "HTML5", icon: "devicon-html5-plain colored" },
      { name: "CSS3", icon: "devicon-css3-plain colored" },
    ],
    backend: [
      { name: "Node.js", icon: "devicon-nodejs-plain colored" },
      {
        name: "Express",
        iconSvg:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
      },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
      { name: "Supabase", icon: "devicon-supabase-plain colored" },
      { name: "REST API", icon: "devicon-fastapi-plain colored" },
      { name: "GraphQL", icon: "devicon-graphql-plain colored" },
    ],
    tools: [
      { name: "Git", icon: "devicon-git-plain colored" },
      { name: "Docker", icon: "devicon-docker-plain colored" },
      { name: "VS Code", icon: "devicon-vscode-plain colored" },
      {
        name: "Vercel",
        iconSvg:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
      },
      {
        name: "GitHub",
        iconSvg:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
      },
      { name: "npm", icon: "devicon-npm-original-wordmark colored" },
    ],
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Profile Photo */}
            <div className="lg:col-span-4 animate-fade-in-up delay-200">
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
            </div>

            {/* Right Column - Information */}
            <div className="lg:col-span-8 space-y-6 animate-fade-in-up delay-400">
              {/* Name and Title */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Muhammad Raihan Rafliansyah
                </h3>
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
              </div>

              {/* Bio Text */}
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  I&apos;m a passionate Fullstack Developer with a love for
                  creating beautiful, functional, and user-friendly web
                  applications. With expertise in both frontend and backend
                  technologies, I bring ideas to life through clean code and
                  modern design.
                </p>

                <p>
                  When I&apos;m not coding, you&apos;ll find me exploring new
                  frameworks, contributing to open-source projects, or sharing
                  knowledge with the developer community.
                </p>
              </div>

              {/* Skills Section */}
              <div className="pt-6">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Skills & Technologies
                </h4>

                <div className="space-y-6">
                  {/* Frontend Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        Frontend Development
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.frontend.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.iconSvg ? (
                            <img
                              src={skill.iconSvg}
                              alt={skill.name}
                              className="w-5 h-5 dark:invert"
                            />
                          ) : (
                            <i className={`${skill.icon} text-xl`}></i>
                          )}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Backend Skills */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        Backend Development
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.backend.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.iconSvg ? (
                            <img
                              src={skill.iconSvg}
                              alt={skill.name}
                              className="w-5 h-5 dark:invert"
                            />
                          ) : (
                            <i className={`${skill.icon} text-xl`}></i>
                          )}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Others */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="h-5 w-5 text-primary-600 dark:text-primary-500" />
                      <h5 className="font-semibold text-gray-900 dark:text-white">
                        Tools & Others
                      </h5>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.tools.map((skill) => (
                        <span
                          key={skill.name}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
                        >
                          {skill.iconSvg ? (
                            <img
                              src={skill.iconSvg}
                              alt={skill.name}
                              className="w-5 h-5 dark:invert"
                            />
                          ) : (
                            <i className={`${skill.icon} text-xl`}></i>
                          )}
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
