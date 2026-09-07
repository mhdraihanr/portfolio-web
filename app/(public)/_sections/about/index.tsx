import type { Skill } from "@/types/skill";
import { getVisibleSkills, getProfile } from "@/lib/supabase/public-data";
import { AboutClient } from "./about-client";

export type HomepageSkill = Pick<
  Skill,
  "name" | "icon" | "icon_svg" | "category"
>;

export interface HomepageSkillsByCategory {
  frontend: HomepageSkill[];
  backend: HomepageSkill[];
  tools: HomepageSkill[];
}

export async function About() {
  const [visibleSkills, profile] = await Promise.all([
    getVisibleSkills(),
    getProfile(),
  ]);
  const skills: HomepageSkillsByCategory = {
    frontend: visibleSkills.filter((skill) => skill.category === "frontend"),
    backend: visibleSkills.filter((skill) => skill.category === "backend"),
    tools: visibleSkills.filter(
      (skill) => skill.category === "tools" || skill.category === "others",
    ),
  };

  return <AboutClient skills={skills} profile={profile} />;
}
