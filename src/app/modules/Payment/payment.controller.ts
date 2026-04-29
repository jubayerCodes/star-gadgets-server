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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validatePayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const notification = req.body;

  await PaymentServices.validatePayment(notification);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment validated successfully",
    data: {},
  });
});

// {
//   amount: '1049.00',
//   bank_tran_id: '260429114348QUuPusz3Zr6RSLR',
//   base_fair: '0.00',
//   card_brand: 'MOBILEBANKING',
//   card_issuer: 'BKash Mobile Banking',
//   card_issuer_country: 'Bangladesh',
//   card_issuer_country_code: 'BD',
//   card_no: '',
//   card_sub_brand: 'Classic',
//   card_type: 'BKASH-BKash',
//   currency: 'BDT',
//   currency_amount: '1049.00',
//   currency_rate: '1.0000',
//   currency_type: 'BDT',
//   error: '',
//   risk_level: '0',
//   risk_title: 'Safe',
//   status: 'VALID',
//   store_amount: '1022.78',
//   store_id: 'jubay69ed82cf07c84',
//   tran_date: '2026-04-29 11:43:41',
//   tran_id: 'tran_1777441419621_408395',
//   val_id: '260429114348ADDiNMNPJqBALuG',
//   value_a: '',
//   value_b: '',
//   value_c: '',
//   value_d: '',
//   verify_sign: '542e96fc645841a96aecb1cbe0b2ea13',
//   verify_sign_sha2: 'b1b895e3958763a0a785e1e62fb436e27ddf77036a113d654c7b24151f29412e',
//   verify_key: 'amount,bank_tran_id,base_fair,card_brand,card_issuer,card_issuer_country,card_issuer_country_code,card_no,card_sub_brand,card_type,currency,currency_amount,currency_rate,currency_type,error,risk_level,risk_title,status,store_amount,store_id,tran_date,tran_id,val_id,value_a,value_b,value_c,value_d'
// }

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
  validatePayment,
};
