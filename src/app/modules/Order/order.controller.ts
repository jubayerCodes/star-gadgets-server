import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import { getUserFromReq } from "../../utils/getUserFromReq";
import { OrderStatus } from "./order.interface";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Attach userId if the request is authenticated (softAuth sets req.user)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userEmail = (req as any).user?.email as string | undefined;
  const result = await OrderServices.createOrder(req.body, userEmail);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order placed successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orders, meta } = await OrderServices.getAllOrders(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMyOrders = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = getUserFromReq(req);
  const { orders, meta } = await OrderServices.getMyOrders(
    user.email,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Orders fetched successfully",
    data: orders,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getOrderById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqUser = (req as any).user;
  const result = await OrderServices.getOrderById(
    req.params.id as string,
    reqUser?.email,
    reqUser?.role
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order fetched successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateOrderStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await OrderServices.updateOrderStatus(
    req.params.id as string,
    req.body.orderStatus as OrderStatus
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
