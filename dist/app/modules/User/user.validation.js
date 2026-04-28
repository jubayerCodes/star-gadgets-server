"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
const validations_1 = require("../../validations");
const addressSchema = zod_1.default.object({
    fullName: zod_1.default.string({ error: "Full name must be a string" }).min(2, { message: "Full name must be at least 2 characters." }),
    phone: validations_1.PhoneNumberSchema,
    addressLine: zod_1.default.string({ error: "Address line must be a string" }).min(3, { message: "Address line is required." }),
    city: zod_1.default.string({ error: "City must be a string" }).min(1, { message: "City is required." }),
    district: zod_1.default.string({ error: "District must be a string" }).min(1, { message: "District is required." }),
    country: zod_1.default.string({ error: "Country must be a string" }).min(1, { message: "Country is required." }),
    zipCode: zod_1.default.string().optional(),
});
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: validations_1.PhoneNumberSchema,
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isDeleted: zod_1.default.boolean({ error: "isDeleted must be true or false" }).optional(),
    phone: validations_1.PhoneNumberSchema.optional(),
    billingAddress: addressSchema.optional(),
    shippingAddress: addressSchema.optional(),
});
