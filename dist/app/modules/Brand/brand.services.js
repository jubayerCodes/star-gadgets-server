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
exports.BrandServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const getSearchQuery_1 = require("../../utils/getSearchQuery");
const brand_model_1 = require("./brand.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createBrand = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findOne({ title: payload.title });
    if (isBrandExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Brand already exists");
    }
    const brand = yield brand_model_1.Brand.create(payload);
    return brand;
});
const updateBrand = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(id);
    if (!isBrandExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Brand not found");
    }
    const brand = yield brand_model_1.Brand.findByIdAndUpdate(id, payload, { new: true });
    return brand;
});
const deleteBrand = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrandExist = yield brand_model_1.Brand.findById(id);
    if (!isBrandExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Brand not found");
    }
    yield brand_model_1.Brand.findByIdAndDelete(id);
    return null;
});
const getBrandsAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, search, sortBy, sortOrder } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const filter = {};
    if (search) {
        Object.assign(filter, (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug"]));
    }
    if (query.featured !== undefined) {
        filter.featured = query.featured === "true";
    }
    const brands = yield brand_model_1.Brand.find(filter).sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }).skip(skip).limit(limit);
    const total = yield brand_model_1.Brand.countDocuments(filter);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { brands, meta };
});
const getBrandsList = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, skip, search, page } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const searchQuery = (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug"]);
    const brands = yield brand_model_1.Brand.find(searchQuery).select("title slug").sort({ title: 1 }).skip(skip).limit(limit);
    const total = yield brand_model_1.Brand.countDocuments(searchQuery);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { brands, meta };
});
exports.BrandServices = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrandsAdmin,
    getBrandsList,
};
