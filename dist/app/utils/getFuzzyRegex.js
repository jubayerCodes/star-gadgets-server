"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFuzzyRegex = void 0;
const getFuzzyRegex = (search) => {
    const tokens = search
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const fuzzyPattern = (token) => token.split("").join("\\w*?");
    const combinedPattern = tokens.length > 0 ? tokens.map((t) => `(?=.*${fuzzyPattern(t)})`).join("") : search;
    return new RegExp(combinedPattern, "i");
};
exports.getFuzzyRegex = getFuzzyRegex;
