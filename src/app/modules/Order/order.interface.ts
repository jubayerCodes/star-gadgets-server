import { Types } from "mongoose";
import { PaymentMethod } from "../Payment/payment.interface";

// Re-export from Payment module so existing imports keep working
export { PaymentStatus } from "../Payment/payment.interface";

export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export interface IBillingDetails {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  district: string;
  postcode?: string;
  phone: string;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  title: string;
  image: string;
  attributes?: { name: string; value: string }[];
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ICouponSnapshot {
  couponId: Types.ObjectId;
  code: string;
  discountAmount: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  orderNumber: string;
  userId?: Types.ObjectId;
  billingDetails: IBillingDetails;
  items: IOrderItem[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  coupon?: ICouponSnapshot;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  /** Reference to the linked Payment document */
  paymentId?: Types.ObjectId;
  orderStatus: OrderStatus;
  orderNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
