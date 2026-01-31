import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ConfigServices } from "./config.servces";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateHeaderConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id as string;

  const updatedConfig = await ConfigServices.updateHeaderConfig(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Config updated successfully",
    data: updatedConfig,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const config = await ConfigServices.getConfig();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Config fetched successfully",
    data: config,
  });
});

export const ConfigController = {
  updateHeaderConfig,
  getConfig,
};
