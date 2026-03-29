"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.heroCarouselItemSchema = exports.heroFixedItemSchema = void 0;
const mongoose_1 = require("mongoose");
const heroFixedItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
}, { _id: false });
exports.heroFixedItemSchema = heroFixedItemSchema;
const heroCarouselItemSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    image: { type: String, required: true },
    button: { type: String, required: true },
    buttonLink: { type: String, required: true },
}, { _id: false });
exports.heroCarouselItemSchema = heroCarouselItemSchema;
const configSchema = new mongoose_1.Schema({
    header: {
        navLinks: [{ type: mongoose_1.Types.ObjectId, ref: "Category" }],
    },
    hero: {
        heroType: {
            type: String,
            enum: ["fixed", "carousel"],
            default: "fixed",
        },
        fixedContent: {
            type: [heroFixedItemSchema],
            default: [],
        },
        carouselContent: {
            type: [heroCarouselItemSchema],
            default: [],
        },
    },
}, { timestamps: true, versionKey: false });
exports.Config = (0, mongoose_1.model)("Config", configSchema);
