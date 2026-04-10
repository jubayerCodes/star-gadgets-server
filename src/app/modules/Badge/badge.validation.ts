import z from "zod";

export const createBadgeZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title must be at least 1 character long")
    .max(50, "Title must be at most 50 characters long"),
  editable: z.boolean().optional(),
});

export const updateBadgeZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(1, "Title must be at least 1 character long")
    .max(50, "Title must be at most 50 characters long")
    .optional(),
  editable: z.boolean().optional(),
});
