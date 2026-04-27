import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { Order } from "./order.model";
import { Coupon } from "../Coupon/coupon.model";
import { Config } from "../Configuration/config.model";
import { Product } from "../Product/product.model";
import { User } from "../User/user.model";
import { IOrder, IOrderItem, OrderStatus } from "./order.interface";
import { PaymentMethod, PaymentStatus } from "../Payment/payment.interface";
import { PaymentServices } from "../Payment/payment.service";
import { Payment } from "../Payment/payment.model";
import { extractSearchQuery } from "../../utils/extractSearchQuery";
import { IMeta } from "../../utils/sendResponse";
import mongoose, { Types } from "mongoose";
import { SslCommerzService } from "../SslCommerz/SslCommerz.service";

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
  // ── 1. Fetch config for shipping cost (read-only, outside transaction) ────
  const config = await Config.findOne();
  if (!config) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Store configuration not found");
  }

  const shippingMethodConfig = config.shippingMethods.find((m) => m.name === payload.shippingMethod);
  if (!shippingMethodConfig) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid shipping method");
  }
  const shippingCost = shippingMethodConfig.cost;

  // ── 2. Verify each item: fetch live price + stock (read-only) ─────────────
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

  // ── 3. Validate coupon (read-only) ────────────────────────────────────────
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

  // ── 4. Resolve the userId (read-only) ─────────────────────────────────────
  let resolvedUserId: Types.ObjectId | undefined;
  if (userEmail) {
    resolvedUserId = await resolveUserIdFromEmail(userEmail);
  }

  // ── 5. Generate a unique transactionId for this order ────────────────────
  const transactionId = `tran_${Date.now()}_${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;

  // ── 6. Run all writes atomically inside a MongoDB session ─────────────────
  // If any step below throws, withTransaction() aborts and rolls back every write.
  const session = await mongoose.startSession();
  let paymentUrl: string | undefined;
  let orderId: Types.ObjectId | undefined;

  try {
    await session.withTransaction(async () => {
      // 6a. Create the Order document
      const orderData: Partial<IOrder> = {
        billingDetails: payload.billingDetails,
        items: resolvedItems,
        subtotal,
        shippingMethod: payload.shippingMethod,
        shippingCost,
        coupon: couponSnapshot,
        discount,
        total,
        orderStatus: OrderStatus.PENDING,
        orderNotes: payload.orderNotes,
        ...(resolvedUserId && { userId: resolvedUserId }),
      };

      const [order] = await Order.create([orderData], { session });

      // 6b. Create the linked Payment document (same session)
      const paymentMethodEnum = payload.paymentMethod === "cod" ? PaymentMethod.COD : PaymentMethod.ONLINE;
      const payment = await PaymentServices.createPayment(
        order._id as Types.ObjectId,
        total,
        paymentMethodEnum,
        transactionId,
        session,
      );

      if (payload.paymentMethod === PaymentMethod.ONLINE) {
        const result = await SslCommerzService.sslPaymentInit({
          amount: total,
          transactionId,
          name: payload.billingDetails.firstName + " " + payload.billingDetails.lastName,
          email: payload.billingDetails.email,
          streetAddress: payload.billingDetails.streetAddress,
          city: payload.billingDetails.city,
          district: payload.billingDetails.district,
          postcode: payload.billingDetails.postcode,
          phone: payload.billingDetails.phone,
        });

        paymentUrl = result.GatewayPageURL;
      }

      // 6c. Link paymentId back to the order
      await Order.updateOne({ _id: order._id }, { $set: { paymentId: payment._id } }, { session });

      // 6d. Decrement stock for each purchased item
      for (const item of payload.items) {
        await Product.updateOne(
          { _id: item.productId, "variants._id": item.variantId },
          { $inc: { "variants.$.stock": -item.quantity } },
          { session },
        );
      }

      // 6e. Increment coupon usedCount (if a coupon was applied)
      if (couponSnapshot) {
        await Coupon.updateOne({ _id: couponSnapshot.couponId }, { $inc: { usedCount: 1 } }, { session });
      }

      orderId = order._id as Types.ObjectId;
    });
  } finally {
    session.endSession();
  }

  const orderWithPayment = await Order.findById(orderId).populate("paymentId");

  return {
    paymentUrl,
    orderPayload: orderWithPayment,
  };
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

  // Populate paymentId for each order
  const populated = await Order.populate(orders, { path: "paymentId" });

  const meta: IMeta = { page, limit, skip, total };
  return { orders: populated, meta };
};

const getMyOrders = async (userEmail: string, query: Record<string, string>) => {
  const { page, skip, limit } = extractSearchQuery(query);

  const user = await User.findOne({ email: userEmail }).select("_id");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const pipeline = [{ $match: { userId: user._id } }, { $sort: { createdAt: -1 as const } }];

  const countResult = await Order.aggregate([...pipeline, { $count: "total" }]);
  const total = countResult[0]?.total ?? 0;

  const orders = await Order.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);

  const populated = await Order.populate(orders, { path: "paymentId" });

  const meta: IMeta = { page, limit, skip, total };
  return { orders: populated, meta };
};

const getOrderById = async (id: string, userEmail?: string, role?: string) => {
  const order = await Order.findById(id).populate("paymentId");
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

  // ── Freeze guard ─────────────────────────────────────────────────────────
  if (order.orderStatus === OrderStatus.CANCELLED) {
    throw new AppError(httpStatus.CONFLICT, "This order has been cancelled and can no longer be modified.");
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
  return order.populate("paymentId");
};

const cancelOrder = async (id: string, userEmail: string) => {
  const user = await User.findOne({ email: userEmail }).select("_id");
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  const order = await Order.findById(id);
  if (!order) throw new AppError(httpStatus.NOT_FOUND, "Order not found");

  // Ownership check
  if (String(order.userId) !== String(user._id)) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to cancel this order");
  }

  const nonCancellableStatuses: OrderStatus[] = [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED];
  if (nonCancellableStatuses.includes(order.orderStatus)) {
    throw new AppError(httpStatus.CONFLICT, `Order cannot be cancelled — current status: ${order.orderStatus}`);
  }

  // Block cancellation if the payment was made online and is already PAID
  if (order.paymentId) {
    const payment = await Payment.findById(order.paymentId);
    if (payment && payment.paymentMethod === PaymentMethod.ONLINE && payment.status === PaymentStatus.PAID) {
      throw new AppError(
        httpStatus.CONFLICT,
        "This order cannot be cancelled because the online payment has already been completed. Please contact support for a refund.",
      );
    }
  }

  // Restore stock and coupon usage
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

  order.orderStatus = OrderStatus.CANCELLED;
  await order.save();
  return order.populate("paymentId");
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
