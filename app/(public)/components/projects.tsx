import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import type { Project } from "@/types/project";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Code2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getProjects(): Promise<Project[]> {
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
          // Cannot set cookies in server component, only in Server Actions or Route Handlers
        },
      },
    },
  );

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return (data as Project[]) || [];
}

export async function Projects() {
  const projects = await getProjects();

  return (
    <section id="projects" className="pt-12 pb-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">Portfolio</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A showcase of my recent work, featuring applications and
              innovative solutions built with modern technologies.
            </p>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No featured projects available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className="group relative overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Project Image */}
                  {project.image_url && (
                    <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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

                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies
                            .slice(0, 5)
                            .map((tech: string) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tech}
                              </Badge>
                            ))}
                          {project.technologies.length > 5 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                  </CardContent>

                  {/* See Details Button - Fade in on hover, right aligned */}
                  <CardFooter className="justify-end opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-20 transition-all duration-300 overflow-hidden">
                    <Link href={`/projects/${project.slug}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group/btn"
                        rightIcon={
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        }
                      >
                        See Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* View All Projects Link (Optional) */}
          {projects.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium transition-colors"
              >
                View All Projects
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
