"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSearchQuery = exports.getSkip = void 0;
const constants_1 = require("../constants/constants");
const getSkip = (page, limit) => {
    const skip = (page - 1) * limit;
    return skip;
};
exports.getSkip = getSkip;
const extractSearchQuery = (query) => {
    const { page, limit, sortBy = constants_1.DEFAULT_SORT_BY, sortOrder = constants_1.DEFAULT_SORT_ORDER, search = "" } = query;
    const skip = (0, exports.getSkip)(parseInt(page) || constants_1.DEFAULT_PAGE, parseInt(limit) || constants_1.DEFAULT_LIMIT);
    const pageNumber = parseInt(page) || constants_1.DEFAULT_PAGE;
    const limitNumber = parseInt(limit) || constants_1.DEFAULT_LIMIT;
    return { page: pageNumber, limit: limitNumber, skip, sortBy, sortOrder, search };
};
exports.extractSearchQuery = extractSearchQuery;
