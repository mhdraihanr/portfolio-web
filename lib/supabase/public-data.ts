import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Project } from "@/types/project";
import type { WorkExperience } from "@/types/experience";
import type { Skill } from "@/types/skill";

export const HOMEPAGE_PUBLIC_DATA_REVALIDATE_SECONDS = 300;

function createPublicSupabaseClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

async function fetchFeaturedProjects(): Promise<Project[]> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("featured", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching featured projects:", error);
    return [];
  }

  return (data as Project[]) || [];
}

async function fetchWorkExperiences(): Promise<WorkExperience[]> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("work_experience")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching work experience:", error);
    return [];
  }

  return (data as WorkExperience[]) || [];
}

async function fetchVisibleSkills(): Promise<Skill[]> {
  const supabase = createPublicSupabaseClient();

  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .eq("is_visible", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching visible skills:", error);
    return [];
  }

  return (data as Skill[]) || [];
}

export const getFeaturedProjects = unstable_cache(
  fetchFeaturedProjects,
  ["homepage-featured-projects"],
  {
    revalidate: HOMEPAGE_PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["homepage-projects"],
  },
);

export const getWorkExperiences = unstable_cache(
  fetchWorkExperiences,
  ["homepage-work-experiences"],
  {
    revalidate: HOMEPAGE_PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["homepage-experience"],
  },
);

export const getVisibleSkills = unstable_cache(
  fetchVisibleSkills,
  ["homepage-visible-skills"],
  {
    revalidate: HOMEPAGE_PUBLIC_DATA_REVALIDATE_SECONDS,
    tags: ["homepage-skills"],
  },
);
