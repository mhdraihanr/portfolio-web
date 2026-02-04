import type { Database } from "./database.types";

export type WorkExperience =
  Database["public"]["Tables"]["work_experience"]["Row"];
export type WorkExperienceInsert =
  Database["public"]["Tables"]["work_experience"]["Insert"];
export type WorkExperienceUpdate =
  Database["public"]["Tables"]["work_experience"]["Update"];

export interface ExperienceFormData {
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  order_index: number;
}
