"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentStatusValidation = void 0;
const zod_1 = require("zod");
const payment_interface_1 = require("./payment.interface");
exports.updatePaymentStatusValidation = zod_1.z.object({
    status: zod_1.z.enum(Object.values(payment_interface_1.PaymentStatus)),
});
