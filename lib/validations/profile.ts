import { z } from "zod";

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name too long"),
  tagline: z
    .string()
    .min(2, "Tagline must be at least 2 characters")
    .max(120, "Tagline too long"),
  hero_title: z
    .string()
    .min(2, "Hero title must be at least 2 characters")
    .max(200, "Hero title too long"),
  hero_tagline: z
    .string()
    .min(2, "Hero tagline must be at least 2 characters")
    .max(600, "Hero tagline too long"),
  about_text: z
    .string()
    .min(10, "About text must be at least 10 characters")
    .max(2000, "About text too long"),
  photo_url: z.string().optional().or(z.literal("")),
  cv_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
