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
  const amount = query.amount
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
      await Payment.findOneAndUpdate(
        { transactionId },
        {
          status: PaymentStatus.FAILED,
        },
        { session },
      );

      await Order.findOneAndUpdate(
        { transactionId },
        {
          orderStatus: OrderStatus.FAILED,
        },
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { success: true };
};

const paymentCancel = async (query: Record<string, string>) => {
  const transactionId = query.transactionId;

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await Payment.findOneAndUpdate(
        { transactionId },
        {
          status: PaymentStatus.CANCELLED,
        },
        { session },
      );

      await Order.findOneAndUpdate(
        { transactionId },
        {
          orderStatus: OrderStatus.CANCELLED,
        },
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { success: true };
};

export const PaymentServices = {
  createPayment,
  getPaymentByOrderId,
  getPaymentById,
  getAllPayments,
  updatePaymentStatus,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
