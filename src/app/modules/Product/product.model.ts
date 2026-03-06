import { Schema, model } from "mongoose";
import { IProduct, IProductAttribute, IVariant, ProductStatus } from "./product.interface";

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
  attributes: {
    type: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    required: true,
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
      type: Map,
      of: String,
      required: true,
    },
    specifications: {
      type: Map,
      of: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attributes: {
      type: [productAttributeSchema],
      required: true,
    },
    variants: {
      type: [variantSchema],
      required: true,
    },
    description: {
      type: Map,
      of: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Product = model<IProduct>("Product", productSchema);
