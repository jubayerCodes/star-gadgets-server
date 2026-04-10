import { z } from "zod";
import { ProductStatus } from "./product.interface";

const productAttributeZodSchema = z.object({
  name: z.string({ error: "Attribute name is required" }),
  values: z
    .array(z.string({ error: "Attribute value must be a string" }), {
      error: "Attribute values are required",
    })
    .min(1, "At least one attribute value is required"),
});

const productBadgeZodSchema = z.object({
  title: z.string({ error: "Badge title is required" }),
  value: z.string().optional(),
});

const variantAttributeZodSchema = z.object({
  name: z.string(),
  value: z.string(),
});

const variantZodSchema = z.object({
  // Variant attributes are optional — an empty array is valid
  attributes: z.array(variantAttributeZodSchema).optional().default([]),
  price: z.number({ error: "Price is required" }).nonnegative("Price must be a non-negative number").optional(),
  regularPrice: z
    .number({ error: "Regular price is required" })
    .nonnegative("Regular price must be a non-negative number"),
  stock: z
    .number({ error: "Stock is required" })
    .int("Stock must be an integer")
    .nonnegative("Stock must be a non-negative number"),
  status: z.enum(Object.values(ProductStatus) as [string, ...string[]], {
    error: "Invalid product status",
  }),
  sku: z.string({ error: "SKU is required" }),
  images: z
    .array(z.string({ error: "Image must be a string" }), {
      error: "Images are required",
    })
    .min(1, "At least one image is required"),
  featuredImage: z.string({ error: "Featured image is required" }),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

const specificationZodSchema = z.object({
  heading: z.string({ error: "Specification heading is required" }),
  specifications: z
    .array(
      z.object({
        name: z.string({ error: "Specification name is required" }),
        value: z.string({ error: "Specification value is required" }),
      }),
      { error: "Specifications are required" },
    )
    .min(1, "At least one specification is required"),
});

export const createProductZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(200, "Title must be at most 200 characters long"),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(200, "Slug must be at most 200 characters long"),
  featuredImage: z.string({ error: "Featured image is required" }),
  subCategoryId: z.string({ error: "Sub-category ID is required" }),
  brandId: z.string({ error: "Brand ID is required" }),
  categoryId: z.string({ error: "Category ID is required" }),
  productCode: z.string({ error: "Product code is required" }),
  keyFeatures: z.string({ error: "Key features are required" }),
  specifications: z.array(specificationZodSchema).min(1, "At least one specification group is required"),
  description: z.string({ error: "Description is required" }),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  isFeatured: z.boolean({ error: "isFeatured property is required" }),
  // Top-level attributes are optional — a product may have no attribute groups
  attributes: z.array(productAttributeZodSchema).optional().default([]),
  badges: z.array(productBadgeZodSchema).optional().default([]),
  variants: z.array(variantZodSchema).min(1, "At least one variant is required"),
});

export const updateProductZodSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, "Title must be at least 2 characters long")
    .max(200, "Title must be at most 200 characters long")
    .optional(),
  slug: z
    .string({ error: "Slug is required" })
    .min(2, "Slug must be at least 2 characters long")
    .max(200, "Slug must be at most 200 characters long")
    .optional(),
  featuredImage: z.string({ error: "Featured image is required" }).optional(),
  subCategoryId: z.string({ error: "Sub-category ID is required" }).optional(),
  brandId: z.string({ error: "Brand ID is required" }).optional(),
  categoryId: z.string({ error: "Category ID is required" }).optional(),
  productCode: z.string({ error: "Product code is required" }).optional(),
  keyFeatures: z.string({ error: "Key features are required" }).optional(),
  specifications: z.array(specificationZodSchema).min(1, "At least one specification group is required").optional(),
  description: z.string({ error: "Description is required" }).optional(),
  isActive: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  attributes: z.array(productAttributeZodSchema).optional(),
  badges: z.array(productBadgeZodSchema).optional(),
  variants: z.array(variantZodSchema).min(1, "At least one variant is required").optional(),
});
