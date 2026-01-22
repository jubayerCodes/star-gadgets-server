"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, secretKey, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secretKey, {
        expiresIn,
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token, secretKey) => {
    const verifiedToken = jsonwebtoken_1.default.verify(token, secretKey);
    return verifiedToken;
};
exports.verifyToken = verifyToken;
