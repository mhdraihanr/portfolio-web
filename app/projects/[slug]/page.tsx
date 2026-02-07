import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Database } from "@/types/database.types";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

async function getProject(slug: string): Promise<Project | null> {
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
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Project;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/#projects">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Button>
          </Link>

          {/* Project Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              {project.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {project.github_url && (
                <Link
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2">
                    <Github className="w-4 h-4" />
                    View Code
                  </Button>
                </Link>
              )}
              {project.project_url && (
                <Link
                  href={project.project_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Visit Project
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Project Image */}
          {project.image_url && (
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Technologies */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Technologies Used
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-sm flex items-center gap-2"
                  >
                    {tech.icon_svg ? (
                      <img
                        src={tech.icon_svg}
                        alt={tech.name}
                        className="w-4 h-4 object-contain"
                      />
                    ) : tech.icon ? (
                      <i className={`${tech.icon} text-base`}></i>
                    ) : null}
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Problem Section */}
          {project.problem && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Problem
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.problem}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Solution Section */}
          {project.solution && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Solution
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.solution}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Impact Section */}
          {project.impact && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Impact
                </h2>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {project.impact}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Back to Projects Link */}
          <div className="text-center mt-12">
            <Link href="/#projects">
              <Button variant="outline" className="group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to All Projects
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
