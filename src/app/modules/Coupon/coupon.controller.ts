import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { CouponServices } from "./coupon.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CouponServices.createCoupon(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllCoupons = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { coupons, meta } = await CouponServices.getAllCoupons(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupons fetched successfully",
    data: coupons,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validateCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await CouponServices.validateCoupon(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon is valid",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  await CouponServices.deleteCoupon(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon deleted successfully",
    data: null,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateCoupon = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const result = await CouponServices.updateCoupon(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  deleteCoupon,
  updateCoupon,
};
