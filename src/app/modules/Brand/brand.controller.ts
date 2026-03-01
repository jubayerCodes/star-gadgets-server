import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IBrand } from "./brand.interface";
import { BrandServices } from "./brand.services";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: IBrand = {
    ...req.body,
    image: req.file?.path,
  };

  const brand = await BrandServices.createBrand(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand created successfully",
    data: brand,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const payload: Partial<IBrand> = {
    ...req.body,
    image: req.file?.path,
  };

  const brand = await BrandServices.updateBrand(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand updated successfully",
    data: brand,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteBrand = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  await BrandServices.deleteBrand(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand deleted successfully",
    data: null,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getBrandsAdmin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { brands, meta } = await BrandServices.getBrandsAdmin(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brands fetched successfully",
    data: brands,
    meta,
  });
});

export const BrandController = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandsAdmin,
};
