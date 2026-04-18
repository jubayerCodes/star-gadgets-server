"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coupon = void 0;
const mongoose_1 = require("mongoose");
const couponSchema = new mongoose_1.Schema({
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
}, { timestamps: true, versionKey: false });
exports.Coupon = (0, mongoose_1.model)("Coupon", couponSchema);
