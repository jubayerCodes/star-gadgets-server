"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBadgeZodSchema = exports.createBadgeZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBadgeZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ error: "Title is required" })
        .min(1, "Title must be at least 1 character long")
        .max(50, "Title must be at most 50 characters long"),
    editable: zod_1.default.boolean().optional(),
});
exports.updateBadgeZodSchema = zod_1.default.object({
    title: zod_1.default
        .string({ error: "Title is required" })
        .min(1, "Title must be at least 1 character long")
        .max(50, "Title must be at most 50 characters long")
        .optional(),
    editable: zod_1.default.boolean().optional(),
});
