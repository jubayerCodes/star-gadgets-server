import { Schema, model } from "mongoose";
import { IProduct, IProductAttribute, ISpecification, IVariant, ProductStatus } from "./product.interface";

const productAttributeSchema = new Schema<IProductAttribute>(
  {
    name: {
      type: String,
      required: true,
    },
    values: {
      type: [String],
      required: true,
    },
  },
  { _id: false },
);

const variantSchema = new Schema<IVariant>({
  // Variant attributes are optional — empty array is valid
  attributes: {
    type: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(ProductStatus),
    required: true,
  },
  sku: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const specificationSchema = new Schema<ISpecification>({
  heading: {
    type: String,
    required: true,
  },
  specifications: {
    type: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    required: true,
  },
});

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
    keyFeatures: {
      type: String,
      required: true,
    },
    specifications: {
      type: [specificationSchema],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Top-level attributes are optional — a product may have no attribute groups
    attributes: {
      type: [productAttributeSchema],
      default: [],
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model<IProduct>("Product", productSchema);
