import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { HeaderConfigServices } from "./header-config.services";
import { sendResponse } from "../../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getHeaderConfig = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const config = await HeaderConfigServices.getHeaderConfig();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Header config fetched successfully",
    data: config,
  });
});

export const HeaderConfigControllers = {
  getHeaderConfig,
};
