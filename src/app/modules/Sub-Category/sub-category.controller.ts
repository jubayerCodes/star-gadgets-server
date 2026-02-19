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
    image: req.file?.path,
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
  const payload: ISubCategory = {
    ...req.body,
    image: req.file?.path,
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
  const subCategories = await SubCategoryServices.getSubCategoriesAdmin();

  sendResponse(res, {
    success: true,
    message: "Sub-Categories retrieved successfully",
    statusCode: httpStatus.OK,
    data: subCategories,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  updateSubCategory,
  getSubCategoriesAdmin,
};
