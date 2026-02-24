"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchQuery = void 0;
const getSearchQuery = (search, fields) => {
    return {
        $or: fields.map((field) => ({ [field]: { $regex: search, $options: "i" } })),
    };
};
exports.getSearchQuery = getSearchQuery;
