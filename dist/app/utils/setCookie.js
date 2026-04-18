"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const isProduction = env_1.envVars.NODE_ENV === "PRODUCTION";
const setAuthCookie = (res, tokenInfo) => {
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: (isProduction ? "none" : "lax"),
    };
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, Object.assign(Object.assign({}, cookieOptions), { maxAge: 7 * 24 * 60 * 60 * 1000 }));
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, Object.assign(Object.assign({}, cookieOptions), { maxAge: 30 * 24 * 60 * 60 * 1000 }));
    }
};
exports.setAuthCookie = setAuthCookie;
