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
exports.CategoryServices = void 0;
const category_model_1 = require("./category.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield category_model_1.Category.findOne({ slug: payload.slug });
    if (isCategoryExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Category already exists");
    }
    const category = yield category_model_1.Category.create(payload);
    return category;
});
const updateCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isCategoryExist = yield category_model_1.Category.findById(id);
    if (!isCategoryExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Category not found");
    }
    const category = yield category_model_1.Category.findByIdAndUpdate(id, payload, { new: true });
    return category;
});
const getCategoriesWithSubCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.Category.aggregate([
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
    ]);
    return categories;
});
exports.CategoryServices = {
    createCategory,
    updateCategory,
    getCategoriesWithSubCategories,
};
