"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const coupon_model_1 = require("./coupon.model");
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const getSearchQuery_1 = require("../../utils/getSearchQuery");
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_model_1.Coupon.create(payload);
    return result;
});
const getAllCoupons = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { page, skip, limit, search, sortBy, sortOrder } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const { type, status, expiry } = query;
    const searchQuery = (0, getSearchQuery_1.getSearchQuery)(search, ["code"]);
    const matchStage = Object.assign({}, searchQuery);
    if (type !== undefined)
        matchStage.discountType = type;
    if (status === "active")
        matchStage.isActive = true;
    else if (status === "inactive")
        matchStage.isActive = false;
    const now = new Date();
    if (expiry === "expired")
        matchStage.expiryDate = { $lt: now };
    else if (expiry === "active")
        matchStage.expiryDate = { $gte: now };
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortableFields = {
        code: { code: sortDirection },
        discount: { discountAmount: sortDirection },
        minOrder: { minOrderValue: sortDirection },
        createdAt: { createdAt: sortDirection },
    };
    const sortStage = ((_a = sortableFields[sortBy]) !== null && _a !== void 0 ? _a : { createdAt: -1 });
    const pipeline = [{ $match: matchStage }, { $sort: sortStage }];
    const countResult = yield coupon_model_1.Coupon.aggregate([...pipeline, { $count: "total" }]);
    const total = (_c = (_b = countResult[0]) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0;
    const coupons = yield coupon_model_1.Coupon.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);
    const meta = { page, limit, skip, total };
    return { coupons, meta };
});
const validateCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.Coupon.findOne({ code: payload.code, isActive: true });
    if (!coupon) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Invalid or inactive coupon code");
    }
    if (coupon.expiryDate < new Date()) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon code has expired");
    }
    if (coupon.usedCount >= coupon.usageLimit) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon usage limit has been reached");
    }
    if (coupon.hasPerUserLimit && payload.userId) {
        const { Order } = require("../Order/order.model");
        const userUsageCount = yield Order.countDocuments({
            userId: payload.userId,
            "coupon.couponId": coupon._id,
        });
        if (userUsageCount >= coupon.perUserUsageLimit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `You have already used this coupon ${coupon.perUserUsageLimit} time(s). Further usage is not allowed.`);
        }
    }
    if (coupon.minOrderValue && payload.subtotal < coupon.minOrderValue) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Minimum order value to use this coupon is ৳${coupon.minOrderValue}`);
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = (payload.subtotal * coupon.discountAmount) / 100;
    }
    else {
        discount = coupon.discountAmount;
    }
    if (discount > payload.subtotal) {
        discount = payload.subtotal;
    }
    return {
        couponId: coupon._id,
        code: coupon.code,
        discountAmount: Math.round(discount),
    };
});
const deleteCoupon = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield coupon_model_1.Coupon.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Coupon not found");
    }
    return result;
});
exports.CouponServices = {
    createCoupon,
    getAllCoupons,
    validateCoupon,
    deleteCoupon,
};
