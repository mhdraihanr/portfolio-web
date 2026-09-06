import { z } from "zod";

export const certificateSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be less than 200 characters"),
  provider: z
    .string()
    .min(2, "Provider must be at least 2 characters")
    .max(100, "Provider must be less than 100 characters"),
  issue_date: z.string().optional().or(z.literal("")),
  credential_id: z.string().optional().or(z.literal("")),
  credential_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(500, "Description too long")
    .optional()
    .or(z.literal("")),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sort_order: z
    .number()
    .int("Must be a whole number")
    .min(0, "Order must be 0 or greater"),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;
