"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductZodSchema = exports.createProductZodSchema = void 0;
const zod_1 = require("zod");
const product_interface_1 = require("./product.interface");
const productAttributeZodSchema = zod_1.z.object({
    name: zod_1.z.string({ error: "Attribute name is required" }),
    values: zod_1.z
        .array(zod_1.z.string({ error: "Attribute value must be a string" }), {
        error: "Attribute values are required",
    })
        .min(1, "At least one attribute value is required"),
});
const variantAttributeZodSchema = zod_1.z.object({
    name: zod_1.z.string(),
    value: zod_1.z.string(),
});
const variantZodSchema = zod_1.z.object({
    attributes: zod_1.z.array(variantAttributeZodSchema).optional().default([]),
    price: zod_1.z.number({ error: "Price is required" }).nonnegative("Price must be a non-negative number").optional(),
    regularPrice: zod_1.z
        .number({ error: "Regular price is required" })
        .nonnegative("Regular price must be a non-negative number"),
    stock: zod_1.z
        .number({ error: "Stock is required" })
        .int("Stock must be an integer")
        .nonnegative("Stock must be a non-negative number"),
    status: zod_1.z.enum(Object.values(product_interface_1.ProductStatus), {
        error: "Invalid product status",
    }),
    sku: zod_1.z.string({ error: "SKU is required" }),
    images: zod_1.z
        .array(zod_1.z.string({ error: "Image must be a string" }), {
        error: "Images are required",
    })
        .min(1, "At least one image is required"),
    featuredImage: zod_1.z.string({ error: "Featured image is required" }),
    featured: zod_1.z.boolean().default(false),
    isActive: zod_1.z.boolean().default(true),
});
const specificationZodSchema = zod_1.z.object({
    heading: zod_1.z.string({ error: "Specification heading is required" }),
    specifications: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string({ error: "Specification name is required" }),
        value: zod_1.z.string({ error: "Specification value is required" }),
    }), { error: "Specifications are required" })
        .min(1, "At least one specification is required"),
});
exports.createProductZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(200, "Title must be at most 200 characters long"),
    slug: zod_1.z
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(200, "Slug must be at most 200 characters long"),
    featuredImage: zod_1.z.string({ error: "Featured image is required" }),
    subCategoryId: zod_1.z.string({ error: "Sub-category ID is required" }),
    brandId: zod_1.z.string({ error: "Brand ID is required" }),
    categoryId: zod_1.z.string({ error: "Category ID is required" }),
    productCode: zod_1.z.string({ error: "Product code is required" }),
    keyFeatures: zod_1.z.string({ error: "Key features are required" }),
    specifications: zod_1.z.array(specificationZodSchema).min(1, "At least one specification group is required"),
    description: zod_1.z.string({ error: "Description is required" }),
    isActive: zod_1.z.boolean().default(true),
    isDeleted: zod_1.z.boolean().default(false),
    attributes: zod_1.z.array(productAttributeZodSchema).optional().default([]),
    variants: zod_1.z.array(variantZodSchema).min(1, "At least one variant is required"),
});
exports.updateProductZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({ error: "Title is required" })
        .min(2, "Title must be at least 2 characters long")
        .max(200, "Title must be at most 200 characters long")
        .optional(),
    slug: zod_1.z
        .string({ error: "Slug is required" })
        .min(2, "Slug must be at least 2 characters long")
        .max(200, "Slug must be at most 200 characters long")
        .optional(),
    featuredImage: zod_1.z.string({ error: "Featured image is required" }).optional(),
    subCategoryId: zod_1.z.string({ error: "Sub-category ID is required" }).optional(),
    brandId: zod_1.z.string({ error: "Brand ID is required" }).optional(),
    categoryId: zod_1.z.string({ error: "Category ID is required" }).optional(),
    productCode: zod_1.z.string({ error: "Product code is required" }).optional(),
    keyFeatures: zod_1.z.string({ error: "Key features are required" }).optional(),
    specifications: zod_1.z.array(specificationZodSchema).min(1, "At least one specification group is required").optional(),
    description: zod_1.z.string({ error: "Description is required" }).optional(),
    isActive: zod_1.z.boolean().optional(),
    isDeleted: zod_1.z.boolean().optional(),
    attributes: zod_1.z.array(productAttributeZodSchema).optional(),
    variants: zod_1.z
        .array(variantZodSchema)
        .min(1, "At least one variant is required")
        .optional(),
});
