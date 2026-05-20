import { z } from "zod";

export const adminEventFormSchema = z.object({
  organizationId: z.string().min(1, "Organization is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(64)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  edition: z.string().min(1, "Edition is required"),
  title: z.string().min(1, "Title is required"),
  titleLine2: z.string().min(1, "Headline is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  tagline: z.string().min(1, "Tagline is required"),
  date: z.string().min(1, "Date is required"),
  dateShort: z.string().min(1, "Short date is required"),
  time: z.string().min(1, "Time is required"),
  venue: z.string().min(1, "Venue is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  website: z.string().min(1, "Website is required"),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  about: z.string().min(1, "About text is required"),
  isPublished: z.boolean(),
});

export type AdminEventFormValues = z.infer<typeof adminEventFormSchema>;

export function slugifyEventTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
