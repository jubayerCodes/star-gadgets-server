"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneNumberSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.PhoneNumberSchema = zod_1.default
    .string({
    message: "Phone Number must be string",
})
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
})
    .transform((val) => {
    if (val.startsWith("+880")) {
        return val;
    }
    if (val.startsWith("01")) {
        return `+880${val.slice(1)}`;
    }
    return val;
});
