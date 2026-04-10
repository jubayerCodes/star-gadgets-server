import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { IBadge } from "./badge.interface";
import { BadgeServices } from "./badge.service";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBadge = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const payload: IBadge = { ...req.body };

  const badge = await BadgeServices.createBadge(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Badge created successfully",
    data: badge,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateBadge = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;
  const payload: Partial<IBadge> = { ...req.body };

  const badge = await BadgeServices.updateBadge(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Badge updated successfully",
    data: badge,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deleteBadge = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  await BadgeServices.deleteBadge(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Badge deleted successfully",
    data: null,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllBadges = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { badges, meta } = await BadgeServices.getAllBadges(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Badges fetched successfully",
    data: badges,
    meta,
  });
});

export const BadgeController = {
  createBadge,
  updateBadge,
  deleteBadge,
  getAllBadges,
};
