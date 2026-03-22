"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBrandZodSchema = exports.createBrandZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBrandZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(30, "Title must be at most 30 characters long"),
    slug: zod_1.default
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(50, "Slug must be at most 50 characters long"),
    featured: zod_1.default.boolean().default(false),
    image: zod_1.default.string({ error: "Image is required" }).min(1, "Image is required"),
});
exports.updateBrandZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(30, "Title must be at most 30 characters long")
        .optional(),
    slug: zod_1.default
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(50, "Slug must be at most 50 characters long")
        .optional(),
    featured: zod_1.default.boolean().optional(),
    image: zod_1.default.string().optional(),
});
