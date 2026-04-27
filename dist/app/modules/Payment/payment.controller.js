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
exports.PaymentController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const payment_service_1 = require("./payment.service");
const getUserFromReq_1 = require("../../utils/getUserFromReq");
const env_1 = require("../../config/env");
const getPaymentByOrderId = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, getUserFromReq_1.getUserFromReq)(req);
    const result = yield payment_service_1.PaymentServices.getPaymentByOrderId(req.params.orderId, user === null || user === void 0 ? void 0 : user.email, user === null || user === void 0 ? void 0 : user.role);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment fetched successfully",
        data: result,
    });
}));
const getPaymentById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.getPaymentById(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment fetched successfully",
        data: result,
    });
}));
const getPaymentByTransactionId = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.getPaymentByTransactionId(req.params.transactionId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment fetched successfully",
        data: result,
    });
}));
const getAllPayments = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { payments, meta } = yield payment_service_1.PaymentServices.getAllPayments(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payments fetched successfully",
        data: payments,
        meta,
    });
}));
const updatePaymentStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_service_1.PaymentServices.updatePaymentStatus(req.params.id, req.body.status);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment status updated successfully",
        data: result,
    });
}));
const paymentSuccess = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.paymentSuccess(query);
    if (result.success) {
        return res.redirect(`${env_1.envVars.CLIENT_URL}${env_1.envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}`);
    }
}));
const paymentFail = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.paymentFail(query);
    if (!result.success) {
        return res.redirect(`${env_1.envVars.CLIENT_URL}${env_1.envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}`);
    }
}));
const paymentCancel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield payment_service_1.PaymentServices.paymentCancel(query);
    if (!result.success) {
        return res.redirect(`${env_1.envVars.CLIENT_URL}${env_1.envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}`);
    }
}));
const initiatePayment = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, getUserFromReq_1.getUserFromReq)(req);
    const result = yield payment_service_1.PaymentServices.initiatePayment(req.params.orderId, user.email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Payment initiated successfully",
        data: result,
    });
}));
exports.PaymentController = {
    getPaymentByOrderId,
    getPaymentByTransactionId,
    getPaymentById,
    getAllPayments,
    updatePaymentStatus,
    paymentSuccess,
    paymentFail,
    paymentCancel,
    initiatePayment,
};
