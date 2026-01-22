import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { UserServices } from "./user.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await UserServices.createUser(req.body);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.CREATED,
    data: user,
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

export const UserControllers = {
  createUser,
  getAllUsers,
};
