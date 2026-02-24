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
exports.UserControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("./user.model");
const user_services_1 = require("./user.services");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const setCookie_1 = require("../../utils/setCookie");
const getUserFromReq_1 = require("../../utils/getUserFromReq");
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_services_1.UserServices.createUser(req.body);
    (0, setCookie_1.setAuthCookie)(res, result);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        data: result.user,
        message: "User created successfully",
        success: true,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_services_1.UserServices.getAllUsers();
    const totalUsers = yield user_model_1.User.countDocuments();
    const { page, skip, limit } = (0, extractSearchQuery_1.extractSearchQuery)(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        data: users,
        message: "Users retrieved successfully",
        success: true,
        meta: {
            total: totalUsers,
            page,
            limit,
            skip,
        },
    });
}));
const getProfile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (0, getUserFromReq_1.getUserFromReq)(req);
    const profile = yield user_services_1.UserServices.getProfile(user.email);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        data: profile,
        message: "User retrieved successfully",
        success: true,
    });
}));
exports.UserControllers = {
    createUser,
    getAllUsers,
    getProfile,
};
