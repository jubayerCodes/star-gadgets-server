import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Coupon } from "./coupon.model";
import { ICoupon } from "./coupon.interface";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { getSearchQuery } from "../../utils/getSearchQuery";
import { IMeta } from "../../utils/sendResponse";

const createCoupon = async (payload: Partial<ICoupon>) => {
  const result = await Coupon.create(payload);
  return result;
};

const getAllCoupons = async (query: Record<string, string>) => {
  const { page, skip, limit, search, sortBy, sortOrder } = extractSearchQuery(query);
  const { type, status, expiry } = query;

  // ── Search ────────────────────────────────────────────────────────────────
  const searchQuery = getSearchQuery(search, ["code"]);

  // ── Match stage ───────────────────────────────────────────────────────────
  const matchStage: Record<string, unknown> = { ...searchQuery };

  // Filter by discount type (percentage | fixed)
  if (type !== undefined) matchStage.discountType = type;

  // Filter by active status
  if (status === "active") matchStage.isActive = true;
  else if (status === "inactive") matchStage.isActive = false;

  // Filter by expiry date
  const now = new Date();
  if (expiry === "expired") matchStage.expiryDate = { $lt: now };
  else if (expiry === "active") matchStage.expiryDate = { $gte: now };

  // ── Sorting ───────────────────────────────────────────────────────────────
  const sortDirection = sortOrder === "asc" ? 1 : -1;
  const sortableFields: Record<string, unknown> = {
    code: { code: sortDirection },
    discount: { discountAmount: sortDirection },
    minOrder: { minOrderValue: sortDirection },
    createdAt: { createdAt: sortDirection },
  };

  const sortStage = (sortableFields[sortBy] ?? { createdAt: -1 }) as Record<string, 1 | -1>;

  // ── Pipeline ──────────────────────────────────────────────────────────────
  const pipeline = [{ $match: matchStage }, { $sort: sortStage }];

  // Count total before pagination
  const countResult = await Coupon.aggregate([...pipeline, { $count: "total" }]);
  const total = countResult[0]?.total ?? 0;

  const coupons = await Coupon.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);

  const meta: IMeta = { page, limit, skip, total };

  return { coupons, meta };
};

const validateCoupon = async (payload: { code: string; subtotal: number; userId?: string }) => {
  const coupon = await Coupon.findOne({ code: payload.code, isActive: true });

  if (!coupon) {
    throw new AppError(httpStatus.NOT_FOUND, "Invalid or inactive coupon code");
  }

  if (coupon.expiryDate < new Date()) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon code has expired");
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new AppError(httpStatus.BAD_REQUEST, "Coupon usage limit has been reached");
  }

  // Per-user usage limit check (usage is derived from order history, not stored on the coupon)
  if (coupon.hasPerUserLimit && payload.userId) {
    // TODO: import Order model once the Order module is created
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Order } = require("../Order/order.model");
    const userUsageCount: number = await Order.countDocuments({
      userId: payload.userId,
      "coupon.couponId": coupon._id,
    });
    if (userUsageCount >= coupon.perUserUsageLimit) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `You have already used this coupon ${coupon.perUserUsageLimit} time(s). Further usage is not allowed.`
      );
    }
  }

  if (coupon.minOrderValue && payload.subtotal < coupon.minOrderValue) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Minimum order value to use this coupon is ৳${coupon.minOrderValue}`
    );
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (payload.subtotal * coupon.discountAmount) / 100;
  } else {
    discount = coupon.discountAmount;
  }

  // Prevent discount from exceeding subtotal
  if (discount > payload.subtotal) {
    discount = payload.subtotal;
  }

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountAmount: Math.round(discount),
  };
};

const deleteCoupon = async (id: string) => {
  const result = await Coupon.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Coupon not found");
  }
  return result;
};

export const CouponServices = {
  createCoupon,
  getAllCoupons,
  validateCoupon,
  deleteCoupon,
};
