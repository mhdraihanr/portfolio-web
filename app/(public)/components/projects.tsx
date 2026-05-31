import { getFeaturedProjects } from "../../../lib/supabase/public-data";
import { LazyProjectsClient } from "./lazy-projects-client";

export async function Projects() {
  const projects = await getFeaturedProjects();

  return <LazyProjectsClient projects={projects} />;
}
