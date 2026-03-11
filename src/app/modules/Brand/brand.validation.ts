import z from "zod";

export const createBrandZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(30, "Title must be at most 30 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(50, "Slug must be at most 50 characters long"),
  featured: z.boolean().default(false),
  image: z.string({ error: "Image is required" }).min(1, "Image is required"),
});

export const updateBrandZodSchema = z.object({
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
  image: z.string().optional(),
});
