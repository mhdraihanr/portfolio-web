import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import type { Project } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Code2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

async function getAllProjects(): Promise<Project[]> {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server component - read-only cookies
        },
      },
    },
  );

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data as Project[]) || [];
}

export const metadata = {
  title: "All Projects | Portfolio",
  description:
    "Browse all my projects — applications and solutions built with modern technologies.",
};

export default async function AllProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <ScrollReveal direction="down" duration={0.5}>
            <Link href="/#projects">
              <Button variant="ghost" className="mb-8 group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Button>
            </Link>
          </ScrollReveal>

          {/* Section Header */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">Portfolio</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              All Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete collection of my work, featuring applications and
              innovative solutions built with modern technologies.
            </p>
          </ScrollReveal>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No projects available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <ScrollReveal
                  key={project.id}
                  delay={index * 0.1}
                  duration={0.6}
                >
                  <Card className="group relative overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                    {/* Project Image with Overlay */}
                    {project.image_url && (
                      <div className="relative h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Overlay with See Details Button */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Link href={`/projects/${project.slug}`}>
                            <Button
                              size="lg"
                              className="shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 hover:bg-white dark:hover:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                              rightIcon={
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              }
                            >
                              See Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        <span>{project.title}</span>
                        <div className="flex gap-2 flex-shrink-0">
                          {project.github_url && (
                            <Link
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                              aria-label={`View ${project.title} on GitHub`}
                            >
                              <Github className="w-5 h-5" />
                            </Link>
                          )}
                          {project.project_url && (
                            <Link
                              href={project.project_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
                              aria-label={`Visit ${project.title} live site`}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </Link>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 min-h-[32px] mt-auto">
                            {project.technologies
                              .slice(0, 4)
                              .map((tech, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs flex items-center gap-1.5"
                                >
                                  {tech.icon_svg ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={tech.icon_svg}
                                      alt={tech.name}
                                      className="w-3.5 h-3.5 object-contain"
                                    />
                                  ) : tech.icon ? (
                                    <i className={`${tech.icon} text-sm`}></i>
                                  ) : null}
                                  {tech.name}
                                </Badge>
                              ))}
                            {project.technologies.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.technologies.length - 4} more
                              </Badge>
                            )}
                          </div>
                        )}
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
