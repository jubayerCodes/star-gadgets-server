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
exports.SubCategoryServices = void 0;
const sub_category_model_1 = require("./sub-category.model");
const category_model_1 = require("../Category/category.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const getSearchQuery_1 = require("../../utils/getSearchQuery");
const createSubCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isSubCategoryExist = yield sub_category_model_1.SubCategory.findOne({ slug: payload.slug });
    if (isSubCategoryExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sub Category already exists");
    }
    const subCategory = yield sub_category_model_1.SubCategory.create(payload);
    return subCategory;
});
const updateSubCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isSubCategoryExist = yield sub_category_model_1.SubCategory.findById(id);
    if (!isSubCategoryExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sub Category not found");
    }
    const subCategory = yield sub_category_model_1.SubCategory.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
    });
    return subCategory;
});
const getSubCategoriesAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, search, sortBy, sortOrder } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const filter = {};
    if (search) {
        Object.assign(filter, (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug"]));
    }
    if (query.featured !== undefined) {
        filter.featured = query.featured === "true";
    }
    if (query.category) {
        const category = yield category_model_1.Category.findOne({ slug: query.category }).select("_id");
        if (!category) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Category '${query.category}' not found`);
        }
        filter.categoryId = category._id;
    }
    else if (query.categoryId) {
        filter.categoryId = query.categoryId;
    }
    const subCategories = yield sub_category_model_1.SubCategory.find(filter)
        .populate("categoryId")
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(limit);
    const total = yield sub_category_model_1.SubCategory.countDocuments(filter);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { subCategories, meta };
});
const getSubCategoriesList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, skip, search, page } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const filter = Object.assign({}, (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug"]));
    if (query.category) {
        const category = yield category_model_1.Category.findOne({ slug: query.category }).select("_id");
        if (!category) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, `Category '${query.category}' not found`);
        }
        filter.categoryId = category._id;
    }
    else if (query.categoryId) {
        filter.categoryId = query.categoryId;
    }
    const subCategories = yield sub_category_model_1.SubCategory.find(filter).select("title slug").sort({ title: 1 }).skip(skip).limit(limit);
    const total = yield sub_category_model_1.SubCategory.countDocuments(filter);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { subCategories, meta };
});
exports.SubCategoryServices = {
    createSubCategory,
    updateSubCategory,
    getSubCategoriesAdmin,
    getSubCategoriesList,
};
