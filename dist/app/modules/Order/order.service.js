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
exports.OrderServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const order_model_1 = require("./order.model");
const coupon_model_1 = require("../Coupon/coupon.model");
const config_model_1 = require("../Configuration/config.model");
const product_model_1 = require("../Product/product.model");
const user_model_1 = require("../User/user.model");
const order_interface_1 = require("./order.interface");
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const mongoose_1 = require("mongoose");
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
    const orderData = {
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
        const resolvedId = yield resolveUserIdFromEmail(userEmail);
        if (resolvedId)
            orderData.userId = resolvedId;
    }
    if (payload.paymentMethod === "cod") {
        orderData.orderStatus = order_interface_1.OrderStatus.CONFIRMED;
        orderData.paymentStatus = order_interface_1.PaymentStatus.PAID;
    }
    const order = yield order_model_1.Order.create(orderData);
    if (payload.paymentMethod === "cod") {
        for (const item of payload.items) {
            yield product_model_1.Product.updateOne({ _id: item.productId, "variants._id": item.variantId }, { $inc: { "variants.$.stock": -item.quantity } });
        }
        if (couponSnapshot) {
            yield coupon_model_1.Coupon.findByIdAndUpdate(couponSnapshot.couponId, {
                $inc: { usedCount: 1 },
            });
        }
    }
    return order;
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
    const meta = { page, limit, skip, total };
    return { orders, meta };
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
    const meta = { page, limit, skip, total };
    return { orders, meta };
});
const getOrderById = (id, userEmail, role) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(id);
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
    return order;
});
exports.OrderServices = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};
