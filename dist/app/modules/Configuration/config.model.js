"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const mongoose_1 = require("mongoose");
const configSchema = new mongoose_1.Schema({
    header: {
        navLinks: [{ type: mongoose_1.Types.ObjectId, ref: "Category" }],
    },
}, { timestamps: true, versionKey: false });
exports.Config = (0, mongoose_1.model)("Config", configSchema);
