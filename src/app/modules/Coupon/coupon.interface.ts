import { Types } from "mongoose";

export interface ICoupon {
  _id?: Types.ObjectId;
  code: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  minOrderValue?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  hasPerUserLimit: boolean;
  perUserUsageLimit: number;
  createdAt?: Date;
  updatedAt?: Date;
}
