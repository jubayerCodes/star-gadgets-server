"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const product_interface_1 = require("./product.interface");
const productAttributeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    values: {
        type: [String],
        required: true,
    },
}, { _id: false });
const variantSchema = new mongoose_1.Schema({
    attributes: {
        type: [
            {
                name: { type: String },
                value: { type: String },
            },
        ],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(product_interface_1.ProductStatus),
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    featuredImage: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});
const specificationSchema = new mongoose_1.Schema({
    heading: {
        type: String,
        required: true,
    },
    specifications: {
        type: [
            {
                name: { type: String, required: true },
                value: { type: String, required: true },
            },
        ],
        required: true,
    },
});
const badgeSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    value: { type: String },
}, { _id: false });
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    featuredImage: {
        type: String,
        required: true,
    },
    subCategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    brandId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Brand",
        required: true,
    },
    categoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    productCode: {
        type: String,
        required: true,
        unique: true,
    },
    keyFeatures: {
        type: String,
        required: true,
    },
    specifications: {
        type: [specificationSchema],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        required: true,
        default: false,
    },
    attributes: {
        type: [productAttributeSchema],
        default: [],
    },
    badges: {
        type: [badgeSchema],
        default: [],
    },
    variants: {
        type: [variantSchema],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true, versionKey: false });
exports.Product = (0, mongoose_1.model)("Product", productSchema);
