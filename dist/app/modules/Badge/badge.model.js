"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Badge = void 0;
const mongoose_1 = require("mongoose");
const badgeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    editable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true, versionKey: false });
exports.Badge = (0, mongoose_1.model)("Badge", badgeSchema);
