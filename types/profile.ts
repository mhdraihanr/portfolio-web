/**
 * Profile Type Definitions
 *
 * Single-row table holding editable site-wide profile settings
 * (photo, CV link, name, tagline, hero/about text).
 */

import type { Database } from "./database.types";

export type Profile = Database["public"]["Tables"]["profile"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profile"]["Update"];

export interface ProfileFormData {
  full_name: string;
  tagline: string;
  hero_greeting?: string;
  hero_title: string;
  hero_tagline: string;
  about_text: string;
  photo_url?: string;
  cv_url?: string;
}
