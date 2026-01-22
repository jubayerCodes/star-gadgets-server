import { z } from "zod";

export const createCategoryZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(50, "Slug must be at most 50 characters long"),
  featured: z.boolean().default(false),
});
export const updateCategoryZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(30, "Title must be at most 30 characters long")
    .optional(),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(50, "Slug must be at most 50 characters long")
    .optional(),
  featured: z.boolean().optional(),
});
