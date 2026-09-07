export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: number;
          full_name: string;
          tagline: string;
          hero_title: string;
          hero_tagline: string;
          about_text: string;
          photo_url: string | null;
          cv_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          full_name?: string;
          tagline?: string;
          hero_title?: string;
          hero_tagline?: string;
          about_text?: string;
          photo_url?: string | null;
          cv_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          tagline?: string;
          hero_title?: string;
          hero_tagline?: string;
          about_text?: string;
          photo_url?: string | null;
          cv_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          provider: string;
          issue_date: string | null;
          credential_id: string | null;
          credential_url: string | null;
          description: string | null;
          image: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          provider: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          provider?: string;
          issue_date?: string | null;
          credential_id?: string | null;
          credential_url?: string | null;
          description?: string | null;
          image?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          technologies: {
            name: string;
            icon?: string | null;
            icon_svg?: string | null;
          }[];
          image_url: string | null;
          images: { url: string; fileId: string }[];
          project_url: string | null;
          github_url: string | null;
          featured: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          technologies: {
            name: string;
            icon?: string | null;
            icon_svg?: string | null;
          }[];
          image_url?: string | null;
          images?: { url: string; fileId: string }[];
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          technologies?: {
            name: string;
            icon?: string | null;
            icon_svg?: string | null;
          }[];
          image_url?: string | null;
          images?: { url: string; fileId: string }[];
          project_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: "frontend" | "backend" | "tools" | "others";
          icon: string | null;
          icon_svg: string | null;
          order_index: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: "frontend" | "backend" | "tools" | "others";
          icon?: string | null;
          icon_svg?: string | null;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: "frontend" | "backend" | "tools" | "others";
          icon?: string | null;
          icon_svg?: string | null;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      work_experience: {
        Row: {
          id: string;
          company: string;
          position: string;
          description: string;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          order_index: number;
          logo_url: string | null;
          employment_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          position: string;
          description: string;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          order_index?: number;
          logo_url?: string | null;
          employment_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company?: string;
          position?: string;
          description?: string;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          order_index?: number;
          logo_url?: string | null;
          employment_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
