import { model, Schema } from "mongoose";
import { ICoupon } from "./coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountAmount: { type: Number, required: true },
    minOrderValue: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    hasPerUserLimit: { type: Boolean, default: false },
    perUserUsageLimit: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false },
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
