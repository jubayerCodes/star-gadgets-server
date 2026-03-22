"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brand = void 0;
const mongoose_1 = require("mongoose");
const brandSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, versionKey: false });
exports.Brand = (0, mongoose_1.model)("Brand", brandSchema);
