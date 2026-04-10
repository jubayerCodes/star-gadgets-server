import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { IProduct } from "./product.interface";
import { ProductServices } from "./product.service";

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
  const query = req.query.q as string;
  const products = query ? await ProductServices.searchProducts(query) : [];

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products searched successfully",
    data: products,
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
};
