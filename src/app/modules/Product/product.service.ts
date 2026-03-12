import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { IMeta } from "../../utils/sendResponse";

const createProduct = async (payload: IProduct) => {
  const isProductExist = await Product.findOne({ slug: payload.slug });

  if (isProductExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product with this slug already exists");
  }

  const isProductCodeExist = await Product.findOne({ productCode: payload.productCode });

  if (isProductCodeExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Product with this code already exists");
  }

  const product = await Product.create(payload);

  return product;
};

const getAllProducts = async (query: Record<string, string>) => {
  const { page, skip, limit, search } = extractSearchQuery(query);

  const searchQuery = getSearchQuery(search, ["title", "slug", "productCode"]);

  const filterQuery = { ...searchQuery, isDeleted: false };

  const products = await Product.find(filterQuery)
    .populate("categoryId brandId subCategoryId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(filterQuery);

  const meta: IMeta = {
    page,
    limit,
    skip,
    total,
  };

  return { products, meta };
};

const getProductById = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false }).populate("categoryId brandId subCategoryId");

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  return product;
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const isProductExist = await Product.findOne({ _id: id, isDeleted: false });

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.slug && payload.slug !== isProductExist.slug) {
    const isSlugExist = await Product.findOne({ slug: payload.slug });
    if (isSlugExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product with this slug already exists");
    }
  }

  if (payload.productCode && payload.productCode !== isProductExist.productCode) {
    const isCodeExist = await Product.findOne({ productCode: payload.productCode });
    if (isCodeExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "Product with this code already exists");
    }
  }

  const product = await Product.findByIdAndUpdate(id, payload, { new: true });

  return product;
};

const deleteProduct = async (id: string) => {
  const isProductExist = await Product.findOne({ _id: id, isDeleted: false });

  if (!isProductExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Soft delete
  await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

  return null;
};

export const ProductServices = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
