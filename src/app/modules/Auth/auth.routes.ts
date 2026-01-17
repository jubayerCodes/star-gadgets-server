import { Router } from "express";
import { Role } from "../User/user.interface";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";

export const AuthRoutes = Router();

AuthRoutes.post("/login", AuthControllers.credentialsLogin);
AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);
