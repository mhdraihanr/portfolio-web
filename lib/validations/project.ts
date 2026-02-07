import { z } from "zod";

export const technologySchema = z.object({
  name: z
    .string()
    .min(1, "Technology name is required")
    .max(50, "Technology name must be less than 50 characters"),
  icon: z.string().optional().or(z.literal("")).nullable(),
  icon_svg: z.string().url().optional().or(z.literal("")).nullable(),
});

export const projectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  problem: z
    .string()
    .min(10, "Problem must be at least 10 characters")
    .max(1000, "Problem must be less than 1000 characters"),
  solution: z
    .string()
    .min(10, "Solution must be at least 10 characters")
    .max(1000, "Solution must be less than 1000 characters"),
  impact: z
    .string()
    .min(10, "Impact must be at least 10 characters")
    .max(1000, "Impact must be less than 1000 characters"),
  technologies: z
    .array(technologySchema)
    .min(1, "At least one technology is required")
    .max(20, "Maximum 20 technologies allowed"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  project_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  featured: z.boolean(),
  order_index: z
    .number()
    .int("Must be a whole number")
    .min(0, "Order must be 0 or greater"),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
