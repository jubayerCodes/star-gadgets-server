"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softAuth = void 0;
const env_1 = require("../config/env");
const getUserFromReq_1 = require("../utils/getUserFromReq");
const jwt_1 = require("../utils/jwt");
const softAuth = (req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.accessToken;
        if (token) {
            const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_SECRET);
            (0, getUserFromReq_1.setUserToReq)(req, verifiedToken);
        }
    }
    catch (_a) {
    }
    next();
});
exports.softAuth = softAuth;
