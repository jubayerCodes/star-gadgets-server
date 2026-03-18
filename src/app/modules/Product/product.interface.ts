import { Types } from "mongoose";
import { ISubCategory } from "../Sub-Category/sub-category.interface";
import { ICategory } from "../Category/category.interface";
import { IBrand } from "../Brand/brand.interface";

export enum ProductStatus {
  PRE_ORDER = "Pre Order",
  COMING_SOON = "Coming Soon",
  IN_STOCK = "In Stock",
  OUT_OF_STOCK = "Out of Stock",
}

export interface IProductAttribute {
  name: string;
  values: string[];
}

export interface IVariant {
  _id?: Types.ObjectId;
  // Variant attributes are optional — empty array is valid (e.g. product has no attribute groups)
  attributes?: {
    name: string;
    value: string;
  }[];
  price?: number;
  regularPrice: number;
  stock: number;
  status: ProductStatus;
  sku: string;
  images: string[];
  featuredImage: string;
  featured?: boolean;
  isActive?: boolean;
}

export interface ISpecification {
  heading: string;
  specifications: {
    name: string;
    value: string;
  }[];
}

export interface IProductAdmin {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  featuredImage: string;
  productCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  priceRange: number | { min: number; max: number };
  stock: number;
  variants: IVariant[];
  subCategoryId: ISubCategory;
  categoryId: ICategory;
  brandId: IBrand;
}

export interface IProduct {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  featuredImage: string;
  subCategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  categoryId: Types.ObjectId;
  isDeleted?: boolean;
  productCode: string;
  keyFeatures: string;
  specifications: ISpecification[];
  isActive?: boolean;
  // Top-level attributes are optional — a product may have no attribute groups
  attributes?: IProductAttribute[];
  variants: IVariant[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
