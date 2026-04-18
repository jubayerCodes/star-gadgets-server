import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IProduct } from "./product.interface";
import { ProductServices } from "./product.service";
import { PRODUCT_LISTING } from "../../constants/constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: IProduct = {
    ...req.body,
  };

  const product = await ProductServices.createProduct(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { products, meta } = await ProductServices.getAllProducts(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: products,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  const product = await ProductServices.getProductById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug as string;

  const product = await ProductServices.getProductBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const payload: Partial<IProduct> = {
    ...req.body,
  };

  const product = await ProductServices.updateProduct(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  await ProductServices.deleteProduct(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product deleted successfully",
    data: null,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductsAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { products, meta } = await ProductServices.getProductsAdmin(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: products,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getFeaturedProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const products = await ProductServices.getFeaturedProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Featured products fetched successfully",
    data: products,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = (req.query.query || req.query.q) as string;
  const page = parseInt(req.query.page as string) || PRODUCT_LISTING.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || PRODUCT_LISTING.DEFAULT_LIMIT;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const availability = req.query.availability as "inStock" | "outOfStock" | undefined;
  const brandSlug = req.query.brand as string | undefined;
  const subCategorySlug = req.query.subCategory as string | undefined;
  const sortBy = req.query.sortBy as "relevance" | "priceAsc" | "priceDesc" | "newest" | undefined;

  const emptyResult = { products: [], meta: { page, limit, skip: 0, total: 0 } };
  const result = query
    ? await ProductServices.searchProducts(query, { page, limit, minPrice, maxPrice, availability, brandSlug, subCategorySlug, sortBy })
    : emptyResult;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products searched successfully",
    data: { products: result.products },
    meta: result.meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSearchFilters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = (req.query.query || req.query.q) as string;

  const result = query ? await ProductServices.getSearchFilters(query) : { brands: [], subCategories: [] };

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Search filters fetched successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPublicProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || PRODUCT_LISTING.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || PRODUCT_LISTING.DEFAULT_LIMIT;
  const search = req.query.search as string | undefined;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const availability = req.query.availability as "inStock" | "outOfStock" | undefined;
  const brandSlug = req.query.brand as string | undefined;
  const categorySlug = req.query.category as string | undefined;
  const subCategorySlug = req.query.subCategory as string | undefined;
  const sortBy = req.query.sortBy as "newest" | "priceAsc" | "priceDesc" | "popularity" | undefined;

  const result = await ProductServices.getPublicProducts({
    page,
    limit,
    search,
    minPrice,
    maxPrice,
    availability,
    brandSlug,
    categorySlug,
    subCategorySlug,
    sortBy,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: { products: result.products },
    meta: result.meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getListingFilters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await ProductServices.getListingFilters();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Listing filters fetched successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProductsByCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categorySlug = req.params.slug as string;
  const page = parseInt(req.query.page as string) || PRODUCT_LISTING.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || PRODUCT_LISTING.DEFAULT_LIMIT;
  const search = req.query.search as string | undefined;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const availability = req.query.availability as "inStock" | "outOfStock" | undefined;
  const brandSlug = req.query.brand as string | undefined;
  const subCategorySlug = req.query.subCategory as string | undefined;
  const sortBy = req.query.sortBy as "newest" | "priceAsc" | "priceDesc" | "popularity" | undefined;

  const result = await ProductServices.getProductsByCategory(categorySlug, {
    page,
    limit,
    search,
    minPrice,
    maxPrice,
    availability,
    brandSlug,
    subCategorySlug,
    sortBy,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: {
      category: result.category,
      products: result.products,
    },
    meta: result.meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoryFilters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categorySlug = req.params.slug as string;

  const result = await ProductServices.getCategoryFilters(categorySlug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category filters fetched successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubCategoryProducts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const subCategorySlug = req.params.slug as string;
  const page = parseInt(req.query.page as string) || PRODUCT_LISTING.DEFAULT_PAGE;
  const limit = parseInt(req.query.limit as string) || PRODUCT_LISTING.DEFAULT_LIMIT;
  const search = req.query.search as string | undefined;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const availability = req.query.availability as "inStock" | "outOfStock" | undefined;
  const brandSlug = req.query.brand as string | undefined;
  const sortBy = req.query.sortBy as "newest" | "priceAsc" | "priceDesc" | "popularity" | undefined;

  const result = await ProductServices.getProductsBySubCategory(subCategorySlug, {
    page, limit, search, minPrice, maxPrice, availability, brandSlug, sortBy,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully",
    data: { subCategory: result.subCategory, products: result.products },
    meta: result.meta,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getProductsAdmin,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  searchProducts,
  getSearchFilters,
  getPublicProducts,
  getListingFilters,
  getProductsByCategory,
  getCategoryFilters,
  getSubCategoryProducts,
};
