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
const orderCounterSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
}, { versionKey: false });
const OrderCounter = (0, mongoose_1.model)("OrderCounter", orderCounterSchema);
const getNextOrderNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");
    const counterId = `order-${dateStr}`;
    const counter = yield OrderCounter.findByIdAndUpdate(counterId, { $inc: { seq: 1 } }, { upsert: true, new: true });
    const seq = String(counter.seq).padStart(4, "0");
    return `SG-${dateStr}-${seq}`;
});
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
    paymentMethod: { type: String, enum: ["cod", "online"], required: true },
    paymentStatus: {
        type: String,
        enum: Object.values(order_interface_1.PaymentStatus),
        default: order_interface_1.PaymentStatus.UNPAID,
    },
    orderStatus: {
        type: String,
        enum: Object.values(order_interface_1.OrderStatus),
        default: order_interface_1.OrderStatus.PENDING,
    },
    orderNotes: { type: String },
}, { timestamps: true, versionKey: false });
orderSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.orderNumber) {
            this.orderNumber = yield getNextOrderNumber();
        }
    });
});
exports.Order = (0, mongoose_1.model)("Order", orderSchema);
