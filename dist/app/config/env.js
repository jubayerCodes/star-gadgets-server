"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVars = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const loadEnvVariables = () => {
    const reqEnvVariables = [
        "PORT",
        "DB_URL",
        "CLIENT_URL",
        "SERVER_URL",
        "NODE_ENV",
        "JWT_SECRET",
        "JWT_EXPIRES_IN",
        "JWT_REFRESH_SECRET",
        "JWT_REFRESH_EXPIRES_IN",
        "BCRYPT_SALT_ROUNDS",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "SSL_STORE_ID",
        "SSL_STORE_PASS",
        "SSL_PAYMENT_API",
        "SSL_VALIDATION_API",
        "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "SSL_IPN_URL",
    ];
    reqEnvVariables.forEach((envVar) => {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        CLIENT_URL: process.env.CLIENT_URL,
        SERVER_URL: process.env.SERVER_URL,
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
        },
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
            SSL_IPN_URL: process.env.SSL_IPN_URL,
        },
    };
};
exports.envVars = loadEnvVariables();
