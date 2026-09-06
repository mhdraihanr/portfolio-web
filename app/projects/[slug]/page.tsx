import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Database } from "@/types/database.types";
import type { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCarousel } from "@/components/ui/image-carousel";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { localizeIconSvgUrl } from "@/lib/devicon";

// ponytail: cookie-free cached client keeps detail pages static; switch back to
// SSR client only when per-user data is needed on this route.
function createPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

async function fetchProjectSlugs(): Promise<string[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase.from("projects").select("slug");
  if (error || !data) return [];
  return data.map((p) => p.slug);
}

async function fetchProject(slug: string): Promise<Project | null> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data as Project;
}

const getProject = (slug: string) =>
  unstable_cache(fetchProject.bind(null, slug), [`project-${slug}`], {
    revalidate: 300,
    tags: [`project-${slug}`, "all-projects"],
  })();

export async function generateStaticParams() {
  const slugs = await unstable_cache(fetchProjectSlugs, ["project-slugs"], {
    revalidate: 300,
    tags: ["all-projects"],
  })();
  return slugs.map((slug) => ({ slug }));
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
              Back to Home
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
                    Demo
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Project Images */}
          {project.images && project.images.length > 0 ? (
            <ImageCarousel
              images={project.images}
              alt={project.title}
              className="mb-8"
            />
          ) : (
            project.image_url && (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden mb-8 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover"
                  priority
                />
              </div>
            )
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
                      <Image
                        src={localizeIconSvgUrl(tech.icon_svg) ?? tech.icon_svg}
                        alt={tech.name}
                        width={16}
                        height={16}
                        unoptimized
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

          {/* Back to Projects Link */}
          <div className="text-center mt-12">
            <Link href="/projects">
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
