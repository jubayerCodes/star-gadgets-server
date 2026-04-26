import { model, Schema } from "mongoose";
import { IPayment, PaymentMethod, PaymentStatus } from "./payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    amount: { type: Number, required: true },
    /** Amount paid so far (supports partial / advance payments) */
    totalPaid: { type: Number, default: 0 },
    /** Remaining balance (amount - totalPaid); kept in sync via service logic */
    dueAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    transactionId: { type: String },
    paymentGatewayData: { type: Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
