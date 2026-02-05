import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";
import type { WorkExperience } from "@/types/experience";
import { ExperienceClient } from "@/app/(public)/components/experience-client";

async function getExperiences(): Promise<WorkExperience[]> {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Server component - read-only cookies
          // Cannot set cookies in server component, only in Server Actions or Route Handlers
        },
      },
    },
  );

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

export async function Experience() {
  const experiences = await getExperiences();

  return <ExperienceClient experiences={experiences} />;
}
