import { getWorkExperiences } from "@/lib/supabase/public-data";
import { LazyExperienceClient } from "./lazy-experience-client";

export async function Experience() {
  const experiences = await getWorkExperiences();

  return <LazyExperienceClient experiences={experiences} />;
}
