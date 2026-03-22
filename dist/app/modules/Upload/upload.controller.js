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
exports.UploadController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const upload_service_1 = require("./upload.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const uploadSingle = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No file uploaded");
    }
    const url = upload_service_1.UploadServices.uploadSingleFile(req.file.path);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "File uploaded successfully",
        data: { url },
    });
}));
const uploadMultiple = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files || files.length === 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No files uploaded");
    }
    const urls = upload_service_1.UploadServices.uploadMultipleFiles(files.map((file) => file.path));
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Files uploaded successfully",
        data: { urls },
    });
}));
const getAllFiles = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { files, meta } = yield upload_service_1.UploadServices.getAllFiles(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Files fetched successfully",
        data: files,
        meta,
    });
}));
const deleteFile = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const publicId = req.params.publicId;
    yield upload_service_1.UploadServices.deleteFile(publicId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "File deleted successfully",
        data: null,
    });
}));
exports.UploadController = {
    uploadSingle,
    uploadMultiple,
    getAllFiles,
    deleteFile,
};
