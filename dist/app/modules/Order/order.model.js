"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const order_interface_1 = require("./order.interface");
const billingDetailsSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postcode: { type: String },
    phone: { type: String, required: true },
}, { _id: false });
const orderItemSchema = new mongoose_1.Schema({
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    attributes: [{ name: String, value: String }],
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    subtotal: { type: Number, required: true },
}, { _id: false });
const couponSnapshotSchema = new mongoose_1.Schema({
    couponId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Coupon", required: true },
    code: { type: String, required: true },
    discountAmount: { type: Number, required: true },
}, { _id: false });
const getNextOrderNumber = () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const rand = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    return `SG-${dateStr}-${rand}`;
};
const orderSchema = new mongoose_1.Schema({
    orderNumber: { type: String, unique: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    billingDetails: { type: billingDetailsSchema, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingMethod: { type: String, required: true },
    shippingCost: { type: Number, required: true },
    coupon: { type: couponSnapshotSchema },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    orderStatus: {
        type: String,
        enum: Object.values(order_interface_1.OrderStatus),
        default: order_interface_1.OrderStatus.PENDING,
    },
    orderNotes: { type: String },
}, { timestamps: true, versionKey: false });
orderSchema.pre("save", function () {
    if (!this.orderNumber) {
        this.orderNumber = getNextOrderNumber();
    }
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
