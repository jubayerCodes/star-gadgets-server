"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCouponValidation = exports.validateCouponValidation = exports.createCouponValidation = void 0;
const zod_1 = require("zod");
exports.createCouponValidation = zod_1.z.object({
    code: zod_1.z.string().min(3),
    discountType: zod_1.z.enum(["percentage", "fixed"]),
    discountAmount: zod_1.z.number().positive(),
    minOrderValue: zod_1.z.number().min(0).optional(),
    expiryDate: zod_1.z.string().datetime(),
    usageLimit: zod_1.z.number().int().positive(),
    isActive: zod_1.z.boolean().optional(),
    hasPerUserLimit: zod_1.z.boolean().optional(),
    perUserUsageLimit: zod_1.z.number().int().positive().optional(),
});
exports.validateCouponValidation = zod_1.z.object({
    code: zod_1.z.string(),
    subtotal: zod_1.z.number().positive(),
    userId: zod_1.z.string().optional(),
});
exports.updateCouponValidation = exports.createCouponValidation.partial();
