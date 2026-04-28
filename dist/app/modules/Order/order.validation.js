"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatusValidation = exports.createOrderValidation = void 0;
const zod_1 = require("zod");
const order_interface_1 = require("./order.interface");
const addressValidation = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    streetAddress: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    district: zod_1.z.string().min(1),
    postcode: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(1),
});
const shippingAddressValidation = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email().optional(),
    streetAddress: zod_1.z.string().min(1),
    city: zod_1.z.string().min(1),
    district: zod_1.z.string().min(1),
    postcode: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(1),
});
const orderItemValidation = zod_1.z.object({
    productId: zod_1.z.string().min(1),
    variantId: zod_1.z.string().min(1),
    quantity: zod_1.z.number().int().positive(),
    price: zod_1.z.number().positive(),
});
const couponValidation = zod_1.z.object({
    couponId: zod_1.z.string().min(1),
    code: zod_1.z.string().min(1),
});
exports.createOrderValidation = zod_1.z.object({
    billingDetails: addressValidation,
    shippingDetails: shippingAddressValidation.optional(),
    items: zod_1.z.array(orderItemValidation).min(1, "Order must have at least one item"),
    shippingMethod: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.enum(["cod", "online"]),
    coupon: couponValidation.nullable().optional(),
    orderNotes: zod_1.z.string().optional(),
});
exports.updateOrderStatusValidation = zod_1.z.object({
    orderStatus: zod_1.z.enum(Object.values(order_interface_1.OrderStatus)),
});
