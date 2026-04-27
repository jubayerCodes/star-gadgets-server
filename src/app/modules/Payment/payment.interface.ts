import { Types } from "mongoose";

export enum PaymentMethod {
  COD = "cod",
  ONLINE = "online",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

export interface IPayment {
  _id?: Types.ObjectId;
  orderId: Types.ObjectId;
  amount: number;
  /** Amount paid so far (supports partial / advance payments) */
  totalPaid: number;
  /** Remaining balance due (amount - totalPaid) */
  dueAmount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paymentGatewayData?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
