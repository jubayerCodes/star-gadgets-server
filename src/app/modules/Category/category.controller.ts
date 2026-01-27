import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { ICategory } from "./category.interface";
import { CategoryServices } from "./category.services";

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
const getCategoriesWithSubCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const categories = await CategoryServices.getCategoriesWithSubCategories();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Categories with sub-categories fetched successfully",
    data: categories,
  });
});

export const CategoryControllers = {
  createCategory,
  updateCategory,
  getCategoriesWithSubCategories,
};
