"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "PRODUCTION",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "PRODUCTION",
            sameSite: "none",
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
    }
};
exports.setAuthCookie = setAuthCookie;
