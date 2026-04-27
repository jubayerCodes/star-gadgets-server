import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import { PaymentStatus } from "./payment.interface";
import { getUserFromReq } from "../../utils/getUserFromReq";
import { envVars } from "../../config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPaymentByOrderId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = getUserFromReq(req);
  const result = await PaymentServices.getPaymentByOrderId(
    req.params.orderId as string,
    user?.email as string | undefined,
    user?.role as string | undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment fetched successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentServices.getPaymentById(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment fetched successfully",
    data: result,
  });
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPaymentByTransactionId = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentServices.getPaymentByTransactionId(req.params.transactionId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment fetched successfully",
    data: result,
  });
});


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { payments, meta } = await PaymentServices.getAllPayments(req.query as Record<string, string>);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payments fetched successfully",
    data: payments,
    meta,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updatePaymentStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await PaymentServices.updatePaymentStatus(req.params.id as string, req.body.status as PaymentStatus);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment status updated successfully",
    data: result,
  });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paymentSuccess = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as Record<string, string>;

  const result = await PaymentServices.paymentSuccess(query);

  if (result.success) {
    return res.redirect(
      `${envVars.CLIENT_URL}${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}`,
    );
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paymentFail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as Record<string, string>;

  const result = await PaymentServices.paymentFail(query);

  if (!result.success) {
    return res.redirect(
      `${envVars.CLIENT_URL}${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}`,
    );
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const paymentCancel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const query = req.query as Record<string, string>;
  const result = await PaymentServices.paymentCancel(query);

  if (!result.success) {
    return res.redirect(
      `${envVars.CLIENT_URL}${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}`,
    );
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initiatePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

  const user = getUserFromReq(req);
  const result = await PaymentServices.initiatePayment(req.params.orderId as string, user.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

export const PaymentController = {
  getPaymentByOrderId,
  getPaymentByTransactionId,
  getPaymentById,
  getAllPayments,
  updatePaymentStatus,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  initiatePayment,
};
