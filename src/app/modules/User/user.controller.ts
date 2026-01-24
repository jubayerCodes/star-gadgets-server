import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { getUserFromReq } from "../../utils/getUserFromReq";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await UserServices.createUser(req.body);

  setAuthCookie(res, result);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    data: result.user,
    message: "User created successfully",
    success: true,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const users = await UserServices.getAllUsers();
  const totalUsers = await User.countDocuments();

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    data: users,
    message: "Users retrieved successfully",
    success: true,
    meta: {
      total: totalUsers,
    },
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = getUserFromReq(req);
  const profile = await UserServices.getProfile(user.email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    data: profile,
    message: "User retrieved successfully",
    success: true,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getProfile,
};
