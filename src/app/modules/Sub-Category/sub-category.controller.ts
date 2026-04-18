import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ISubCategory } from "./sub-category.interface";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { SubCategoryServices } from "./sub-category.services";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createSubCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: ISubCategory = {
    ...req.body,
  };

  const subCategory = await SubCategoryServices.createSubCategory(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Sub Category created successfully",
    data: subCategory,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateSubCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: Partial<ISubCategory> = {
    ...req.body,
  };

  const subCategory = await SubCategoryServices.updateSubCategory(req.params.id as string, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub Category updated successfully",
    data: subCategory,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubCategoriesAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { subCategories, meta } = await SubCategoryServices.getSubCategoriesAdmin(req.query as Record<string, string>);

  sendResponse(res, {
    success: true,
    message: "Sub-Categories retrieved successfully",
    statusCode: httpStatus.OK,
    data: subCategories,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubCategoriesList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as Record<string, string>;

  const { subCategories, meta } = await SubCategoryServices.getSubCategoriesList(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-Categories fetched successfully",
    data: subCategories,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubCategoryBySlug = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug as string;
  const subCategory = await SubCategoryServices.getSubCategoryBySlug(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-category fetched successfully",
    data: subCategory,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSubCategoryProductFilters = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug as string;
  const result = await SubCategoryServices.getSubCategoryProductFilters(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sub-category filters fetched successfully",
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  updateSubCategory,
  getSubCategoriesAdmin,
  getSubCategoriesList,
  getSubCategoryBySlug,
  getSubCategoryProductFilters,
};
