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
exports.ProductServices = void 0;
const product_model_1 = require("./product.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const extractSearchQuery_1 = require("../../utils/extractSearchQuery");
const getSearchQuery_1 = require("../../utils/getSearchQuery");
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.Product.findOne({ slug: payload.slug });
    if (isProductExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Product with this slug already exists");
    }
    const isProductCodeExist = yield product_model_1.Product.findOne({ productCode: payload.productCode });
    if (isProductCodeExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Product with this code already exists");
    }
    const product = yield product_model_1.Product.create(payload);
    return product;
});
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, skip, limit, search } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const searchQuery = (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug", "productCode"]);
    const filterQuery = Object.assign(Object.assign({}, searchQuery), { isDeleted: false });
    const products = yield product_model_1.Product.find(filterQuery)
        .populate("categoryId brandId subCategoryId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const total = yield product_model_1.Product.countDocuments(filterQuery);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { products, meta };
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ _id: id, isDeleted: false }).populate("categoryId brandId subCategoryId");
    if (!product) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Product not found");
    }
    return product;
});
const getProductBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.Product.findOne({ slug, isDeleted: false }).populate("categoryId brandId subCategoryId");
    if (!product) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Product not found");
    }
    return product;
});
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.Product.findOne({ _id: id, isDeleted: false });
    if (!isProductExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Product not found");
    }
    if (payload.slug && payload.slug !== isProductExist.slug) {
        const isSlugExist = yield product_model_1.Product.findOne({ slug: payload.slug });
        if (isSlugExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Product with this slug already exists");
        }
    }
    if (payload.productCode && payload.productCode !== isProductExist.productCode) {
        const isCodeExist = yield product_model_1.Product.findOne({ productCode: payload.productCode });
        if (isCodeExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Product with this code already exists");
        }
    }
    const product = yield product_model_1.Product.findByIdAndUpdate(id, payload, { returnDocument: "after" });
    return product;
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExist = yield product_model_1.Product.findOne({ _id: id, isDeleted: false });
    if (!isProductExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Product not found");
    }
    yield product_model_1.Product.findByIdAndUpdate(id, { isDeleted: true }, { returnDocument: "after" });
    return null;
});
const getProductsAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { page, skip, limit, search, sortBy, sortOrder } = (0, extractSearchQuery_1.extractSearchQuery)(query);
    const { minPrice, maxPrice, category, subCategory, brand, isActive, isFeatured } = query;
    const searchQuery = (0, getSearchQuery_1.getSearchQuery)(search, ["title", "slug", "productCode"]);
    const matchStage = Object.assign(Object.assign({}, searchQuery), { isDeleted: false });
    if (isActive !== undefined)
        matchStage.isActive = isActive === "true";
    if (isFeatured !== undefined)
        matchStage.isFeatured = isFeatured === "true";
    const priceMatchConditions = {};
    if (minPrice)
        priceMatchConditions.minPrice = { $gte: Number(minPrice) };
    if (maxPrice)
        priceMatchConditions.maxPrice = { $lte: Number(maxPrice) };
    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortableFields = {
        priceRange: { minPrice: sortDirection },
        stock: { stock: sortDirection },
        createdAt: { createdAt: sortDirection },
        updatedAt: { updatedAt: sortDirection },
        title: { title: sortDirection },
    };
    const refMatchStage = {};
    if (category)
        refMatchStage["categoryId.slug"] = category;
    if (subCategory)
        refMatchStage["subCategoryId.slug"] = subCategory;
    if (brand)
        refMatchStage["brandId.slug"] = brand;
    const sortStage = (_a = sortableFields[sortBy]) !== null && _a !== void 0 ? _a : { createdAt: -1 };
    const pipeline = [
        { $match: matchStage },
        {
            $addFields: {
                minPrice: { $min: "$variants.price" },
                maxPrice: { $max: "$variants.price" },
                stock: { $sum: "$variants.stock" },
            },
        },
        {
            $addFields: {
                priceRange: {
                    $cond: {
                        if: { $eq: ["$minPrice", "$maxPrice"] },
                        then: "$minPrice",
                        else: { min: "$minPrice", max: "$maxPrice" },
                    },
                },
            },
        },
        ...(Object.keys(priceMatchConditions).length > 0 ? [{ $match: priceMatchConditions }] : []),
        { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId" } },
        { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: false } },
        { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
        { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: false } },
        { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
        { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: false } },
        ...(Object.keys(refMatchStage).length > 0 ? [{ $match: refMatchStage }] : []),
        { $sort: sortStage },
        {
            $project: {
                _id: 1,
                title: 1,
                slug: 1,
                featuredImage: 1,
                productCode: 1,
                isActive: 1,
                isFeatured: 1,
                createdAt: 1,
                updatedAt: 1,
                priceRange: 1,
                stock: 1,
                variants: 1,
                subCategoryId: { _id: "$subCategoryId._id", title: "$subCategoryId.title", slug: "$subCategoryId.slug" },
                categoryId: { _id: "$categoryId._id", title: "$categoryId.title", slug: "$categoryId.slug" },
                brandId: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
            },
        },
    ];
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = yield product_model_1.Product.aggregate(countPipeline);
    const total = (_c = (_b = countResult[0]) === null || _b === void 0 ? void 0 : _b.total) !== null && _c !== void 0 ? _c : 0;
    const products = yield product_model_1.Product.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]);
    const meta = {
        page,
        limit,
        skip,
        total,
    };
    return { products, meta };
});
const getFeaturedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        { $match: { isDeleted: false, isActive: true, isFeatured: true } },
        { $sort: { createdAt: -1 } },
        { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
        { $unwind: { path: "$categoryId", preserveNullAndEmptyArrays: false } },
        { $lookup: { from: "brands", localField: "brandId", foreignField: "_id", as: "brandId" } },
        { $unwind: { path: "$brandId", preserveNullAndEmptyArrays: false } },
        {
            $project: {
                _id: 1,
                title: 1,
                slug: 1,
                badges: 1,
                category: { _id: "$categoryId._id", title: "$categoryId.title", slug: "$categoryId.slug" },
                brand: { _id: "$brandId._id", title: "$brandId.title", slug: "$brandId.slug" },
                featuredVariant: {
                    $let: {
                        vars: {
                            featuredVals: {
                                $filter: {
                                    input: "$variants",
                                    as: "variant",
                                    cond: { $eq: ["$$variant.featured", true] },
                                },
                            },
                        },
                        in: {
                            $cond: {
                                if: { $gt: [{ $size: "$$featuredVals" }, 0] },
                                then: { $arrayElemAt: ["$$featuredVals", 0] },
                                else: { $arrayElemAt: ["$variants", 0] },
                            },
                        },
                    },
                },
            },
        },
    ];
    const products = yield product_model_1.Product.aggregate(pipeline);
    return products;
});
const searchProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = query
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const fuzzyPattern = (token) => token.split("").join("\\w*?");
    const combinedPattern = tokens.length > 0 ? tokens.map((t) => `(?=.*${fuzzyPattern(t)})`).join("") : query;
    const regex = new RegExp(combinedPattern, "i");
    const pipeline = [
        {
            $match: {
                isDeleted: false,
                isActive: true,
                $or: [{ title: regex }, { slug: regex }, { productCode: regex }],
            },
        },
        {
            $addFields: {
                minPrice: { $min: "$variants.price" },
                maxPrice: { $max: "$variants.price" },
            },
        },
        {
            $addFields: {
                priceRange: {
                    $cond: {
                        if: { $eq: ["$minPrice", "$maxPrice"] },
                        then: "$minPrice",
                        else: { min: "$minPrice", max: "$maxPrice" },
                    },
                },
            },
        },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategoryId",
                foreignField: "_id",
                as: "subCategoryId",
            },
        },
        { $unwind: { path: "$subCategoryId", preserveNullAndEmptyArrays: true } },
        { $limit: 20 },
        {
            $project: {
                _id: 1,
                title: 1,
                slug: 1,
                featuredImage: 1,
                priceRange: 1,
                subCategoryId: {
                    _id: "$subCategoryId._id",
                    title: "$subCategoryId.title",
                    slug: "$subCategoryId.slug",
                },
            },
        },
    ];
    const products = yield product_model_1.Product.aggregate(pipeline);
    return products;
});
exports.ProductServices = {
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
