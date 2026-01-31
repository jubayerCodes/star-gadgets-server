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
exports.ConfigServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const config_model_1 = require("./config.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const updateHeaderConfig = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isConfigExist = yield config_model_1.Config.findById(id);
    if (!isConfigExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Config not found");
    }
    const updatedConfig = yield config_model_1.Config.findByIdAndUpdate(id, {
        header: payload === null || payload === void 0 ? void 0 : payload.header,
    }, { new: true });
    return updatedConfig;
});
const getConfig = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = yield config_model_1.Config.aggregate([
        {
            $lookup: {
                from: "categories",
                let: { navLinks: "$header.navLinks" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ["$_id", "$$navLinks"] },
                        },
                    },
                    {
                        $lookup: {
                            from: "subcategories",
                            let: { categoryId: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: { $eq: ["$categoryId", "$$categoryId"] },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        title: 1,
                                        slug: 1,
                                    },
                                },
                            ],
                            as: "subCategories",
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            slug: 1,
                            subCategories: 1,
                        },
                    },
                ],
                as: "header.navLinks",
            },
        },
    ]);
    if (!config.length) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Config not found");
    }
    return config[0];
});
exports.ConfigServices = {
    updateHeaderConfig,
    getConfig,
};
