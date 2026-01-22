"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errorHelpers/handleZodError"));
const handleValidationError_1 = __importDefault(require("../errorHelpers/handleValidationError"));
const handleCastError_1 = __importDefault(require("../errorHelpers/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../errorHelpers/handleDuplicateError"));
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const env_1 = require("../config/env");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something Went Wrong!";
    let errorSources = undefined;
    if (err instanceof zod_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        status: statusCode,
        success: false,
        message,
        errorSources: (env_1.envVars === null || env_1.envVars === void 0 ? void 0 : env_1.envVars.NODE_ENV) === "development" ? errorSources : null,
        err: (env_1.envVars === null || env_1.envVars === void 0 ? void 0 : env_1.envVars.NODE_ENV) === "development" ? err : null,
        stack: (env_1.envVars === null || env_1.envVars === void 0 ? void 0 : env_1.envVars.NODE_ENV) === "development" ? err === null || err === void 0 ? void 0 : err.stack : null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
