import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .min(2, "Skill name must be at least 2 characters")
    .max(50, "Skill name must be less than 50 characters"),
  category: z.enum(["frontend", "backend", "tools", "others"]),
  icon: z.string().optional().or(z.literal("")),
  icon_svg: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order_index: z
    .number()
    .int("Must be a whole number")
    .min(0, "Order must be 0 or greater"),
  is_visible: z.boolean(),
});

export type SkillFormData = z.infer<typeof skillSchema>;
