import { z } from "zod";

export const experienceSchema = z
  .object({
    company: z
      .string()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name must be less than 100 characters"),
    position: z
      .string()
      .min(2, "Position must be at least 2 characters")
      .max(100, "Position must be less than 100 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description must be less than 2000 characters"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().or(z.literal("")),
    is_current: z.boolean(),
    order_index: z
      .number()
      .int("Must be a whole number")
      .min(0, "Order must be 0 or greater"),
    logo_url: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    employment_type: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If is_current is false, end_date must be provided
      if (!data.is_current && !data.end_date) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required when position is not current",
      path: ["end_date"],
    },
  )
  .refine(
    (data) => {
      // If end_date is provided, it must be after start_date
      if (data.end_date && data.start_date) {
        return new Date(data.end_date) >= new Date(data.start_date);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

export type ExperienceFormData = z.infer<typeof experienceSchema>;
