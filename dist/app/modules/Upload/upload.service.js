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
exports.UploadServices = void 0;
const cloudinary_config_1 = require("../../config/cloudinary.config");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const uploadSingleFile = (filePath) => {
    return filePath;
};
const uploadMultipleFiles = (filePaths) => {
    return filePaths;
};
const getAllFiles = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const result = yield cloudinary_config_1.cloudinaryUpload.api.resources({
        type: "upload",
        max_results: 500,
    });
    const allFiles = result.resources.map((resource) => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        format: resource.format,
        size: resource.bytes,
        createdAt: resource.created_at,
    }));
    const total = allFiles.length;
    const files = allFiles.slice(skip, skip + limit);
    return {
        files,
        meta: {
            page,
            limit,
            skip,
            total,
        },
    };
});
const deleteFile = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cloudinary_config_1.cloudinaryUpload.uploader.destroy(publicId);
    if (result.result !== "ok") {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Failed to delete file. Make sure the public ID is correct.");
    }
    return null;
});
exports.UploadServices = {
    uploadSingleFile,
    uploadMultipleFiles,
    getAllFiles,
    deleteFile,
};
