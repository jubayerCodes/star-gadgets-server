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
exports.ProductControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const product_service_1 = require("./product.service");
const createProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = Object.assign({}, req.body);
    const product = yield product_service_1.ProductServices.createProduct(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: "Product created successfully",
        data: product,
    });
}));
const getAllProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, meta } = yield product_service_1.ProductServices.getAllProducts(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Products fetched successfully",
        data: products,
        meta,
    });
}));
const getProductById = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const product = yield product_service_1.ProductServices.getProductById(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Product fetched successfully",
        data: product,
    });
}));
const getProductBySlug = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const product = yield product_service_1.ProductServices.getProductBySlug(slug);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Product fetched successfully",
        data: product,
    });
}));
const updateProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = Object.assign({}, req.body);
    const product = yield product_service_1.ProductServices.updateProduct(id, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Product updated successfully",
        data: product,
    });
}));
const deleteProduct = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield product_service_1.ProductServices.deleteProduct(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Product deleted successfully",
        data: null,
    });
}));
const getProductsAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { products, meta } = yield product_service_1.ProductServices.getProductsAdmin(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Products fetched successfully",
        data: products,
        meta,
    });
}));
const getFeaturedProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_service_1.ProductServices.getFeaturedProducts();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Featured products fetched successfully",
        data: products,
    });
}));
const searchProducts = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = (req.query.query || req.query.q);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
    const availability = req.query.availability;
    const brandSlug = req.query.brand;
    const sortBy = req.query.sortBy;
    const emptyResult = { products: [], meta: { page, limit, skip: 0, total: 0 }, brands: [] };
    const result = query
        ? yield product_service_1.ProductServices.searchProducts(query, { page, limit, minPrice, maxPrice, availability, brandSlug, sortBy })
        : emptyResult;
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Products searched successfully",
        data: { products: result.products, brands: result.brands },
        meta: result.meta,
    });
}));
exports.ProductControllers = {
    createProduct,
    getAllProducts,
    getProductsAdmin,
    getProductById,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    searchProducts,
};
