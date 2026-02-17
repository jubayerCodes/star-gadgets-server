"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const propertyName = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";
    const errorSources = [
        {
            path: propertyName,
            message: `"${propertyName}" is already exists`,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: `"${propertyName}" is already exists`,
        errorSources,
    };
};
exports.default = handleDuplicateError;
