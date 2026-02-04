import type { Database } from "./database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  technologies: string[];
  image_url?: string;
  project_url?: string;
  github_url?: string;
  featured: boolean;
  order_index: number;
}
