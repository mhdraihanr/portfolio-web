import type { Database } from "./database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

export interface Technology {
  name: string;
  icon?: string | null; // Devicon font class (e.g., "devicon-react-original colored")
  icon_svg?: string | null; // SVG URL for icons not available in Devicon font
}

export interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  technologies: Technology[];
  image_url?: string;
  project_url?: string;
  github_url?: string;
  featured: boolean;
  order_index: number;
}
