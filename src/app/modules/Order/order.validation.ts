import { z } from "zod";
import { OrderStatus } from "./order.interface";

const billingDetailsValidation = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  streetAddress: z.string().min(1),
  city: z.string().min(1),
  district: z.string().min(1),
  postcode: z.string().optional(),
  phone: z.string().min(1),
});

const orderItemValidation = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

const couponValidation = z.object({
  couponId: z.string().min(1),
  code: z.string().min(1),
});

export const createOrderValidation = z.object({
  billingDetails: billingDetailsValidation,
  items: z.array(orderItemValidation).min(1, "Order must have at least one item"),
  shippingMethod: z.string().min(1),
  /** paymentMethod is used only to initialise the linked Payment document */
  paymentMethod: z.enum(["cod", "online"]),
  coupon: couponValidation.nullable().optional(),
  orderNotes: z.string().optional(),
});

export const updateOrderStatusValidation = z.object({
  orderStatus: z.enum(Object.values(OrderStatus) as [string, ...string[]]),
});
