"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
    amount: { type: Number, required: true },
    totalPaid: { type: Number, default: 0 },
    dueAmount: { type: Number, required: true },
    paymentMethod: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentMethod),
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PaymentStatus),
        default: payment_interface_1.PaymentStatus.UNPAID,
    },
    transactionId: { type: String },
    paymentGatewayData: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: true, versionKey: false });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
