import httpStatus from "http-status-codes";
import mongoose, { ClientSession, Types } from "mongoose";
import AppError from "../../errorHelpers/AppError";
import { Payment } from "./payment.model";
import { IPayment, PaymentMethod, PaymentStatus } from "./payment.interface";
import { IMeta } from "../../utils/sendResponse";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { Order } from "../Order/order.model";
import { User } from "../User/user.model";
import { Role } from "../User/user.interface";
import { OrderStatus } from "../Order/order.interface";
import { SslCommerzService } from "../SslCommerz/SslCommerz.service";

const createPayment = async (
  orderId: Types.ObjectId,
  amount: number,
  paymentMethod: PaymentMethod,
  transactionId: string,
  session?: ClientSession,
): Promise<IPayment> => {
  const [payment] = await Payment.create(
    [
      {
        orderId,
        amount,
        totalPaid: 0,
        dueAmount: amount,
        paymentMethod,
        transactionId,
        status: PaymentStatus.UNPAID,
      },
    ],
    { session },
  );
  return payment;
};

const getPaymentByOrderId = async (orderId: string, email?: string, role?: string): Promise<IPayment> => {
  const payment = await Payment.findOne({ orderId: new Types.ObjectId(orderId) });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found for this order");
  }

  // Admins and super-admins can view any payment
  const isAdmin = role === Role.ADMIN || role === Role.SUPER_ADMIN;
  if (!isAdmin) {
    // Resolve the order to check ownership
    const order = await Order.findById(orderId).select("userId").lean();
    if (!order || !order.userId) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this payment");
    }

    if (!email) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Authentication required to view this payment");
    }

    const user = await User.findOne({ email }).select("_id").lean();
    if (!user || !user._id.equals(order.userId)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this payment");
    }
  }

  return payment;
};

const getPaymentById = async (id: string): Promise<IPayment> => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};

const getPaymentByTransactionId = async (transactionId: string): Promise<IPayment> => {
  const payment = await Payment.findOne({ transactionId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  return payment;
};

const getAllPayments = async (query: Record<string, string>) => {
  const { page, skip, limit } = extractSearchQuery(query);

  const payments = await Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("orderId");
  const total = await Payment.countDocuments();

  const meta: IMeta = { page, limit, skip, total };
  return { payments, meta };
};

const updatePaymentStatus = async (id: string, status: PaymentStatus): Promise<IPayment> => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.status === PaymentStatus.CANCELLED) {
    throw new AppError(httpStatus.CONFLICT, "This payment has been cancelled and cannot be modified");
  }

  payment.status = status;
  await payment.save();
  return payment;
};

const paymentSuccess = async (query: Record<string, string>) => {
  const transactionId = query.transactionId;
  const amount = query.amount;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        {
          status: PaymentStatus.PAID,
          totalPaid: amount,
          dueAmount: 0,
        },
        { session },
      );

      await Order.findByIdAndUpdate(
        payment?.orderId,
        {
          orderStatus: OrderStatus.CONFIRMED,
        },
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { success: true };
};

const paymentFail = async (query: Record<string, string>) => {
  const transactionId = query.transactionId;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        {
          status: PaymentStatus.FAILED,
        },
        { session },
      );

      await Order.findByIdAndUpdate(
        payment?.orderId,
        {
          orderStatus: OrderStatus.FAILED,
        },
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { success: false };
};

const paymentCancel = async (query: Record<string, string>) => {
  const transactionId = query.transactionId;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const payment = await Payment.findOneAndUpdate(
        { transactionId },
        {
          status: PaymentStatus.CANCELLED,
        },
        { session },
      );

      await Order.findByIdAndUpdate(
        payment?.orderId,
        {
          orderStatus: OrderStatus.CANCELLED,
        },
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { success: false };
};

const initiatePayment = async (orderId: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail }).select("_id");

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const order = await Order.findById(orderId).populate("userId").populate("billingDetailsId");

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (String(order.userId?._id) !== String(user._id)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to pay for the order");
  }

  const payment = await Payment.findOne({ orderId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  if (payment.paymentMethod === PaymentMethod.COD) {
    throw new AppError(httpStatus.BAD_REQUEST, "Pay upon delivery");
  }

  if (payment.status === PaymentStatus.PAID) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already Paid");
  }

  const billing = order.billingDetails;

  const paymentResponse = await SslCommerzService.sslPaymentInit({
    amount: order.total,
    transactionId: payment.transactionId,
    name: billing.firstName + " " + billing.lastName,
    email: billing.email,
    streetAddress: billing.streetAddress,
    city: billing.city,
    district: billing.district,
    postcode: billing.postcode,
    phone: billing.phone,
  });

  return { GatewayPageURL: paymentResponse.GatewayPageURL };
};

export const PaymentServices = {
  createPayment,
  getPaymentByOrderId,
  getPaymentById,
  getPaymentByTransactionId,
  getAllPayments,
  updatePaymentStatus,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  initiatePayment,
};
