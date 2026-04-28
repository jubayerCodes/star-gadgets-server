"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.OrderServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const order_model_1 = require("./order.model");
const coupon_model_1 = require("../Coupon/coupon.model");
const config_model_1 = require("../Configuration/config.model");
const product_model_1 = require("../Product/product.model");
const user_model_1 = require("../User/user.model");
const order_interface_1 = require("./order.interface");
const payment_interface_1 = require("../Payment/payment.interface");
const payment_service_1 = require("../Payment/payment.service");
const payment_model_1 = require("../Payment/payment.model");
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const mongoose_1 = __importStar(require("mongoose"));
const SslCommerz_service_1 = require("../SslCommerz/SslCommerz.service");
const resolveUserIdFromEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email }).select("_id");
    return user === null || user === void 0 ? void 0 : user._id;
});
const createOrder = (payload, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const config = yield config_model_1.Config.findOne();
    if (!config) {
        throw new AppError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Store configuration not found");
    }
    const shippingMethodConfig = config.shippingMethods.find((m) => m.name === payload.shippingMethod);
    if (!shippingMethodConfig) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid shipping method");
    }
    const shippingCost = shippingMethodConfig.cost;
    const resolvedItems = [];
    let subtotal = 0;
    for (const item of payload.items) {
        const product = yield product_model_1.Product.findById(item.productId);
        if (!product) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Product not found: ${item.productId}`);
        }
        const variant = product.variants.find((v) => String(v._id) === String(item.variantId));
        if (!variant) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Variant not found: ${item.variantId}`);
        }
        if (variant.stock < item.quantity) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Insufficient stock for "${product.title}". Available: ${variant.stock}`);
        }
        const unitPrice = (_a = variant.price) !== null && _a !== void 0 ? _a : variant.regularPrice;
        const itemSubtotal = unitPrice * item.quantity;
        subtotal += itemSubtotal;
        resolvedItems.push({
            productId: new mongoose_1.Types.ObjectId(item.productId),
            variantId: new mongoose_1.Types.ObjectId(item.variantId),
            title: product.title,
            image: variant.featuredImage || product.featuredImage,
            attributes: variant.attributes,
            quantity: item.quantity,
            price: unitPrice,
            subtotal: itemSubtotal,
        });
    }
    let discount = 0;
    let couponSnapshot;
    if ((_b = payload.coupon) === null || _b === void 0 ? void 0 : _b.couponId) {
        const coupon = yield coupon_model_1.Coupon.findById(payload.coupon.couponId);
        if (!coupon || !coupon.isActive) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon is no longer valid");
        }
        if (coupon.expiryDate < new Date()) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon has expired");
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Coupon usage limit has been reached");
        }
        if (coupon.discountType === "percentage") {
            discount = (subtotal * coupon.discountAmount) / 100;
        }
        else {
            discount = coupon.discountAmount;
        }
        if (discount > subtotal)
            discount = subtotal;
        discount = Math.round(discount);
        couponSnapshot = {
            couponId: coupon._id,
            code: coupon.code,
            discountAmount: discount,
        };
    }
    const total = subtotal + shippingCost - discount;
    let resolvedUserId;
    if (userEmail) {
        resolvedUserId = yield resolveUserIdFromEmail(userEmail);
    }
    const transactionId = `tran_${Date.now()}_${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
    const session = yield mongoose_1.default.startSession();
    let paymentUrl;
    let orderId;
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const orderData = Object.assign(Object.assign(Object.assign({ billingDetails: payload.billingDetails }, (payload.shippingDetails && { shippingDetails: payload.shippingDetails })), { items: resolvedItems, subtotal, shippingMethod: payload.shippingMethod, shippingCost, coupon: couponSnapshot, discount,
                total, orderStatus: order_interface_1.OrderStatus.PENDING, orderNotes: payload.orderNotes }), (resolvedUserId && { userId: resolvedUserId }));
            const [order] = yield order_model_1.Order.create([orderData], { session });
            orderId = order._id;
            const paymentMethodEnum = payload.paymentMethod === "cod" ? payment_interface_1.PaymentMethod.COD : payment_interface_1.PaymentMethod.ONLINE;
            const payment = yield payment_service_1.PaymentServices.createPayment(orderId, total, paymentMethodEnum, transactionId, session);
            if (payload.paymentMethod === payment_interface_1.PaymentMethod.ONLINE) {
                const billing = payload.billingDetails;
                const shipping = payload.shippingDetails;
                const result = yield SslCommerz_service_1.SslCommerzService.sslPaymentInit(Object.assign({ amount: total, transactionId, name: `${billing.firstName} ${billing.lastName}`, email: billing.email, streetAddress: billing.streetAddress, city: billing.city, district: billing.district, postcode: billing.postcode, phone: billing.phone }, (shipping && {
                    shipping: {
                        name: `${shipping.firstName} ${shipping.lastName}`,
                        streetAddress: shipping.streetAddress,
                        city: shipping.city,
                        district: shipping.district,
                        postcode: shipping.postcode,
                    },
                })));
                paymentUrl = result.GatewayPageURL;
            }
            yield order_model_1.Order.updateOne({ _id: orderId }, { $set: { paymentId: payment._id } }, { session });
            for (const item of payload.items) {
                yield product_model_1.Product.updateOne({ _id: item.productId, "variants._id": item.variantId }, { $inc: { "variants.$.stock": -item.quantity } }, { session });
            }
            if (couponSnapshot) {
                yield coupon_model_1.Coupon.updateOne({ _id: couponSnapshot.couponId }, { $inc: { usedCount: 1 } }, { session });
            }
        }));
    }
    finally {
        session.endSession();
    }
    const orderWithPayment = yield order_model_1.Order.findById(orderId).populate("paymentId");
    return {
        paymentUrl,
        orderPayload: orderWithPayment,
    };
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { page, skip, limit } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const { status } = query;
    const matchStage = {};
    if (status)
        matchStage.orderStatus = status;
    const pipeline = [{ $match: matchStage }, { $sort: { createdAt: -1 } }];
    const countResult = yield order_model_1.Order.aggregate([...pipeline, { $count: "total" }]);
    const total = (_b = (_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
    const orders = yield order_model_1.Order.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);
    const populated = yield order_model_1.Order.populate(orders, { path: "paymentId" });
    const meta = { page, limit, skip, total };
    return { orders: populated, meta };
});
const getMyOrders = (userEmail, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { page, skip, limit } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const user = yield user_model_1.User.findOne({ email: userEmail }).select("_id");
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    const pipeline = [{ $match: { userId: user._id } }, { $sort: { createdAt: -1 } }];
    const countResult = yield order_model_1.Order.aggregate([...pipeline, { $count: "total" }]);
    const total = (_b = (_a = countResult[0]) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0;
    const orders = yield order_model_1.Order.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);
    const populated = yield order_model_1.Order.populate(orders, { path: "paymentId" });
    const meta = { page, limit, skip, total };
    return { orders: populated, meta };
});
const getOrderById = (id, userEmail, role) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(id).populate("paymentId");
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found");
    }
    if (role === "USER" && userEmail) {
        const user = yield user_model_1.User.findOne({ email: userEmail }).select("_id");
        if (!user || String(order.userId) !== String(user._id)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this order");
        }
    }
    return order;
});
const updateOrderStatus = (id, orderStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(id);
    if (!order) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found");
    }
    if (order.orderStatus === order_interface_1.OrderStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "This order has been cancelled and can no longer be modified.");
    }
    if (orderStatus === order_interface_1.OrderStatus.CANCELLED && order.orderStatus === order_interface_1.OrderStatus.CONFIRMED) {
        for (const item of order.items) {
            yield product_model_1.Product.updateOne({ _id: item.productId, "variants._id": item.variantId }, { $inc: { "variants.$.stock": item.quantity } });
        }
        if (order.coupon) {
            yield coupon_model_1.Coupon.findByIdAndUpdate(order.coupon.couponId, {
                $inc: { usedCount: -1 },
            });
        }
    }
    order.orderStatus = orderStatus;
    yield order.save();
    return order.populate("paymentId");
});
const cancelOrder = (id, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userEmail }).select("_id");
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    const order = yield order_model_1.Order.findById(id);
    if (!order)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Order not found");
    if (String(order.userId) !== String(user._id)) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to cancel this order");
    }
    const nonCancellableStatuses = [order_interface_1.OrderStatus.SHIPPED, order_interface_1.OrderStatus.DELIVERED, order_interface_1.OrderStatus.CANCELLED];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, `Order cannot be cancelled — current status: ${order.orderStatus}`);
    }
    if (order.paymentId) {
        const payment = yield payment_model_1.Payment.findById(order.paymentId);
        if (payment && payment.paymentMethod === payment_interface_1.PaymentMethod.ONLINE && payment.status === payment_interface_1.PaymentStatus.PAID) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "This order cannot be cancelled because the online payment has already been completed. Please contact support for a refund.");
        }
    }
    for (const item of order.items) {
        yield product_model_1.Product.updateOne({ _id: item.productId, "variants._id": item.variantId }, { $inc: { "variants.$.stock": item.quantity } });
    }
    if (order.coupon) {
        yield coupon_model_1.Coupon.findByIdAndUpdate(order.coupon.couponId, {
            $inc: { usedCount: -1 },
        });
    }
    order.orderStatus = order_interface_1.OrderStatus.CANCELLED;
    yield order.save();
    return order.populate("paymentId");
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
};
