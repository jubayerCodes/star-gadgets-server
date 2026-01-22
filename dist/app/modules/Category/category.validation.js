"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryZodSchema = exports.createCategoryZodSchema = void 0;
const zod_1 = require("zod");
exports.createCategoryZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(30, "Title must be at most 30 characters long"),
    slug: zod_1.z
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(50, "Slug must be at most 50 characters long"),
    featured: zod_1.z.boolean().default(false),
});
exports.updateCategoryZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(30, "Title must be at most 30 characters long")
        .optional(),
    slug: zod_1.z
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(50, "Slug must be at most 50 characters long")
        .optional(),
    featured: zod_1.z.boolean().optional(),
});
