import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ICategory } from "./category.interface";
import { CategoryServices } from "./category.services";
import { Category } from "./category.model";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: ICategory = {
    ...req.body,
    image: req.file?.path,
  };

  const category = await CategoryServices.createCategory(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const payload: Partial<ICategory> = {
    ...req.body,
    image: req.file?.path,
  };

  const category = await CategoryServices.updateCategory(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoriesAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await CategoryServices.getCategoriesAdmin();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoriesWithSubCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await CategoryServices.getCategoriesWithSubCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  await CategoryServices.deleteCategory(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getCategoriesList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as Record<string, string>;

  const categories = await CategoryServices.getCategoriesList(query);

  const { page, skip, limit, search } = extractSearchQuery(query);

  const searchQuery = getSearchQuery(search, ["title", "slug"]);

  const total = await Category.countDocuments(searchQuery);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories fetched successfully",
    data: categories,
    meta: {
      page,
      limit,
      skip,
      total,
    },
  });
});

export const CategoryControllers = {
  createCategory,
  updateCategory,
  getCategoriesWithSubCategories,
  deleteCategory,
  getCategoriesList,
  getCategoriesAdmin,
};
