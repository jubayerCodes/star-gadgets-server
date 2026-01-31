"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigValidation = exports.updateHeaderConfigValidation = void 0;
const zod_1 = require("zod");
exports.updateHeaderConfigValidation = zod_1.z.object({
    header: zod_1.z.object({
        navLinks: zod_1.z.array(zod_1.z.string()),
    }),
});
exports.updateConfigValidation = zod_1.z.object({
    header: zod_1.z.object({
        navLinks: zod_1.z.array(zod_1.z.string()),
    }),
});
