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
exports.SslCommerzService = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const ship = payload.shipping;
        const data = {
            store_id: env_1.envVars.SSL.SSL_STORE_ID,
            store_passwd: env_1.envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            product_category: "Gadgets",
            product_name: "Star Gadgets",
            success_url: `${env_1.envVars.SERVER_URL}${env_1.envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}`,
            fail_url: `${env_1.envVars.SERVER_URL}${env_1.envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}`,
            cancel_url: `${env_1.envVars.SERVER_URL}${env_1.envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}`,
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.streetAddress,
            cus_city: payload.city,
            cus_state: payload.district,
            cus_postcode: payload.postcode || "N/A",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            ship_name: (_a = ship === null || ship === void 0 ? void 0 : ship.name) !== null && _a !== void 0 ? _a : payload.name,
            ship_add1: (_b = ship === null || ship === void 0 ? void 0 : ship.streetAddress) !== null && _b !== void 0 ? _b : payload.streetAddress,
            ship_city: (_c = ship === null || ship === void 0 ? void 0 : ship.city) !== null && _c !== void 0 ? _c : payload.city,
            ship_state: (_d = ship === null || ship === void 0 ? void 0 : ship.district) !== null && _d !== void 0 ? _d : payload.district,
            ship_postcode: (_f = (_e = ship === null || ship === void 0 ? void 0 : ship.postcode) !== null && _e !== void 0 ? _e : payload.postcode) !== null && _f !== void 0 ? _f : "N/A",
            ship_country: "Bangladesh",
            multi_card_name: "mobilebank,internetbank,mastercard,visacard,amexcard",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: env_1.envVars.SSL.SSL_PAYMENT_API,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        });
        return response.data;
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
exports.SslCommerzService = {
    sslPaymentInit,
};
