"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const user_interface_1 = require("../User/user.interface");
const auth_controller_1 = require("./auth.controller");
const checkAuth_1 = require("../../middlewares/checkAuth");
const passport_1 = __importDefault(require("passport"));
exports.AuthRoutes = (0, express_1.Router)();
exports.AuthRoutes.post("/login", auth_controller_1.AuthControllers.credentialsLogin);
exports.AuthRoutes.post("/refresh-token", auth_controller_1.AuthControllers.getNewAccessToken);
exports.AuthRoutes.post("/logout", auth_controller_1.AuthControllers.logout);
exports.AuthRoutes.post("/reset-password", (0, checkAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_controller_1.AuthControllers.resetPassword);
exports.AuthRoutes.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
exports.AuthRoutes.get("/google/callback", passport_1.default.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
}), auth_controller_1.AuthControllers.googleCallback);
