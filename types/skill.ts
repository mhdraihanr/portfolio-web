import type { Database } from "./database.types";

export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type SkillInsert = Database["public"]["Tables"]["skills"]["Insert"];
export type SkillUpdate = Database["public"]["Tables"]["skills"]["Update"];

export interface SkillFormData {
  name: string;
  category: SkillCategory;
  icon?: string;
  icon_svg?: string;
  order_index: number;
  is_visible: boolean;
}

export type SkillCategory = "frontend" | "backend" | "tools" | "others";

export const SKILL_CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "frontend", label: "Frontend Development" },
  { value: "backend", label: "Backend Development" },
  { value: "tools", label: "Tools & Others" },
  { value: "others", label: "Others" },
];

export interface SkillsByCategory {
  frontend: Skill[];
  backend: Skill[];
  tools: Skill[];
  others: Skill[];
}
