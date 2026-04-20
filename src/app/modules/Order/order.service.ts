import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Order } from "./order.model";
import { Coupon } from "../Coupon/coupon.model";
import { Config } from "../Configuration/config.model";
import { Product } from "../Product/product.model";
import { User } from "../User/user.model";
import { IOrder, IOrderItem, OrderStatus, PaymentStatus } from "./order.interface";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { IMeta } from "../../utils/sendResponse";
import { Types } from "mongoose";

interface CreateOrderPayload {
  billingDetails: IOrder["billingDetails"];
  items: {
    productId: string;
    variantId: string;
    quantity: number;
    price: number;
  }[];
  shippingMethod: string;
  paymentMethod: "cod" | "online";
  coupon?: { couponId: string; code: string } | null;
  orderNotes?: string;
}

// Resolve MongoDB _id from email (JWT only carries email+role)
const resolveUserIdFromEmail = async (email: string): Promise<Types.ObjectId | undefined> => {
  const user = await User.findOne({ email }).select("_id");
  return user?._id as Types.ObjectId | undefined;
};

const createOrder = async (payload: CreateOrderPayload, userEmail?: string) => {
  // ── 1. Fetch config for shipping cost ────────────────────────────────────
  const config = await Config.findOne();
  if (!config) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Store configuration not found");
  }

  const shippingMethodConfig = config.shippingMethods.find((m) => m.name === payload.shippingMethod);
  if (!shippingMethodConfig) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid shipping method");
  }
  const shippingCost = shippingMethodConfig.cost;

  // ── 2. Verify each item: fetch live price + stock ─────────────────────────
  const resolvedItems: IOrderItem[] = [];
  let subtotal = 0;

  for (const item of payload.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new AppError(httpStatus.BAD_REQUEST, `Product not found: ${item.productId}`);
    }

    const variant = product.variants.find((v) => String(v._id) === String(item.variantId));
    if (!variant) {
      throw new AppError(httpStatus.BAD_REQUEST, `Variant not found: ${item.variantId}`);
    }

    if (variant.stock < item.quantity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Insufficient stock for "${product.title}". Available: ${variant.stock}`,
      );
    }

    const unitPrice = variant.price ?? variant.regularPrice;
    const itemSubtotal = unitPrice * item.quantity;
    subtotal += itemSubtotal;

    resolvedItems.push({
      productId: new Types.ObjectId(item.productId),
      variantId: new Types.ObjectId(item.variantId),
      title: product.title,
      image: variant.featuredImage || product.featuredImage,
      attributes: variant.attributes,
      quantity: item.quantity,
      price: unitPrice,
      subtotal: itemSubtotal,
    });
  }

  // ── 3. Validate coupon (if provided) ─────────────────────────────────────
  let discount = 0;
  let couponSnapshot: IOrder["coupon"] | undefined;

  if (payload.coupon?.couponId) {
    const coupon = await Coupon.findById(payload.coupon.couponId);
    if (!coupon || !coupon.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, "Coupon is no longer valid");
    }
    if (coupon.expiryDate < new Date()) {
      throw new AppError(httpStatus.BAD_REQUEST, "Coupon has expired");
    }
    if (coupon.usedCount >= coupon.usageLimit) {
      throw new AppError(httpStatus.BAD_REQUEST, "Coupon usage limit has been reached");
    }

    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountAmount) / 100;
    } else {
      discount = coupon.discountAmount;
    }
    if (discount > subtotal) discount = subtotal;
    discount = Math.round(discount);

    couponSnapshot = {
      couponId: coupon._id as Types.ObjectId,
      code: coupon.code,
      discountAmount: discount,
    };
  }

  const total = subtotal + shippingCost - discount;

  // ── 4. Create the Order document ─────────────────────────────────────────
  const orderData: Partial<IOrder> = {
    billingDetails: payload.billingDetails,
    items: resolvedItems,
    subtotal,
    shippingMethod: payload.shippingMethod,
    shippingCost,
    coupon: couponSnapshot,
    discount,
    total,
    paymentMethod: payload.paymentMethod,
    orderNotes: payload.orderNotes,
  };

  if (userEmail) {
    const resolvedId = await resolveUserIdFromEmail(userEmail);
    if (resolvedId) orderData.userId = resolvedId;
  }

  // COD: confirm immediately
  if (payload.paymentMethod === "cod") {
    orderData.orderStatus = OrderStatus.CONFIRMED;
    orderData.paymentStatus = PaymentStatus.PAID;
  }

  const order = await Order.create(orderData);

  // ── 5. Decrement stock + increment coupon usage (COD only) ───────────────
  if (payload.paymentMethod === "cod") {
    for (const item of payload.items) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } },
      );
    }

    if (couponSnapshot) {
      await Coupon.findByIdAndUpdate(couponSnapshot.couponId, {
        $inc: { usedCount: 1 },
      });
    }
  }

  return order;
};

const getAllOrders = async (query: Record<string, string>) => {
  const { page, skip, limit } = extractSearchQuery(query);
  const { status } = query;

  const matchStage: Record<string, unknown> = {};
  if (status) matchStage.orderStatus = status;

  const pipeline = [{ $match: matchStage }, { $sort: { createdAt: -1 as const } }];

  const countResult = await Order.aggregate([...pipeline, { $count: "total" }]);
  const total = countResult[0]?.total ?? 0;

  const orders = await Order.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);

  const meta: IMeta = { page, limit, skip, total };
  return { orders, meta };
};

const getMyOrders = async (userEmail: string, query: Record<string, string>) => {
  const { page, skip, limit } = extractSearchQuery(query);

  const user = await User.findOne({ email: userEmail }).select("_id");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const pipeline = [{ $match: { userId: user._id } }, { $sort: { createdAt: -1 as const } }];

  const countResult = await Order.aggregate([...pipeline, { $count: "total" }]);
  const total = countResult[0]?.total ?? 0;

  const orders = await Order.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);

  const meta: IMeta = { page, limit, skip, total };
  return { orders, meta };
};

const getOrderById = async (id: string, userEmail?: string, role?: string) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Non-admin users can only view their own orders
  if (role === "USER" && userEmail) {
    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user || String(order.userId) !== String(user._id)) {
      throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to view this order");
    }
  }

  return order;
};

const updateOrderStatus = async (id: string, orderStatus: OrderStatus) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Restore stock if cancelling a confirmed order
  if (orderStatus === OrderStatus.CANCELLED && order.orderStatus === OrderStatus.CONFIRMED) {
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": item.quantity } },
      );
    }
    if (order.coupon) {
      await Coupon.findByIdAndUpdate(order.coupon.couponId, {
        $inc: { usedCount: -1 },
      });
    }
  }

  order.orderStatus = orderStatus;
  await order.save();
  return order;
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
