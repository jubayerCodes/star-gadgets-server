"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.AuthProviderSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const AddressSchema = new mongoose_1.Schema({
    address: {
        type: String,
        required: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});
exports.AuthProviderSchema = new mongoose_1.Schema({
    provider: { type: String, enum: Object.values(user_interface_1.Provider), required: true },
    providerId: { type: String, required: true },
}, {
    _id: false,
    versionKey: false,
});
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    addresses: [AddressSchema],
    auths: [exports.AuthProviderSchema],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
