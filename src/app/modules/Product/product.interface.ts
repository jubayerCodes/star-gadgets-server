import { Types } from "mongoose";

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
  attributes: {
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
  attributes: IProductAttribute[];
  variants: IVariant[];
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
