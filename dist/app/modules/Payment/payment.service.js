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
exports.PaymentServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const payment_model_1 = require("./payment.model");
const payment_interface_1 = require("./payment.interface");
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const order_model_1 = require("../Order/order.model");
const user_model_1 = require("../User/user.model");
const user_interface_1 = require("../User/user.interface");
const order_interface_1 = require("../Order/order.interface");
const createPayment = (orderId, amount, paymentMethod, transactionId, session) => __awaiter(void 0, void 0, void 0, function* () {
    const [payment] = yield payment_model_1.Payment.create([
        {
            orderId,
            amount,
            totalPaid: 0,
            dueAmount: amount,
            paymentMethod,
            transactionId,
            status: payment_interface_1.PaymentStatus.UNPAID,
        },
    ], { session });
    return payment;
});
const getPaymentByOrderId = (orderId, email, role) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ orderId: new mongoose_1.Types.ObjectId(orderId) });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found for this order");
    }
    const isAdmin = role === user_interface_1.Role.ADMIN || role === user_interface_1.Role.SUPER_ADMIN;
    if (!isAdmin) {
        const order = yield order_model_1.Order.findById(orderId).select("userId").lean();
        if (!order || !order.userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this payment");
        }
        if (!email) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Authentication required to view this payment");
        }
        const user = yield user_model_1.User.findOne({ email }).select("_id").lean();
        if (!user || !user._id.equals(order.userId)) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to view this payment");
        }
    }
    return payment;
});
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(id);
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
    }
    return payment;
});
const getAllPayments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const payments = yield payment_model_1.Payment.find().sort({ createdAt: -1 }).skip(skip).limit(limit).populate("orderId");
    const total = yield payment_model_1.Payment.countDocuments();
    const meta = { page, limit, skip, total };
    return { payments, meta };
});
const updatePaymentStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(id);
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Payment not found");
    }
    if (payment.status === payment_interface_1.PaymentStatus.CANCELLED) {
        throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "This payment has been cancelled and cannot be modified");
    }
    payment.status = status;
    yield payment.save();
    return payment;
});
const paymentSuccess = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = query.transactionId;
    const amount = query.amount;
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
                status: payment_interface_1.PaymentStatus.PAID,
                totalPaid: amount,
                dueAmount: 0,
            }, { session });
            yield order_model_1.Order.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.orderId, {
                orderStatus: order_interface_1.OrderStatus.CONFIRMED,
            }, { session });
        }));
    }
    finally {
        session.endSession();
    }
    return { success: true };
});
const paymentFail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = query.transactionId;
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
                status: payment_interface_1.PaymentStatus.FAILED,
            }, { session });
            yield order_model_1.Order.findOneAndUpdate({ transactionId }, {
                orderStatus: order_interface_1.OrderStatus.FAILED,
            }, { session });
        }));
    }
    finally {
        session.endSession();
    }
    return { success: true };
});
const paymentCancel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = query.transactionId;
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, {
                status: payment_interface_1.PaymentStatus.CANCELLED,
            }, { session });
            yield order_model_1.Order.findOneAndUpdate({ transactionId }, {
                orderStatus: order_interface_1.OrderStatus.CANCELLED,
            }, { session });
        }));
    }
    finally {
        session.endSession();
    }
    return { success: true };
});
exports.PaymentServices = {
    createPayment,
    getPaymentByOrderId,
    getPaymentById,
    getAllPayments,
    updatePaymentStatus,
    paymentSuccess,
    paymentFail,
    paymentCancel,
};
