import { z } from "zod";

export const createCouponValidation = z.object({
  code: z.string().min(3),
  discountType: z.enum(["percentage", "fixed"]),
  discountAmount: z.number().positive(),
  minOrderValue: z.number().min(0).optional(),
  expiryDate: z.string().datetime(),
  usageLimit: z.number().int().positive(),
  isActive: z.boolean().optional(),
  hasPerUserLimit: z.boolean().optional(),
  perUserUsageLimit: z.number().int().positive().optional(),
});

export const validateCouponValidation = z.object({
  code: z.string(),
  subtotal: z.number().positive(),
  userId: z.string().optional(),
});
