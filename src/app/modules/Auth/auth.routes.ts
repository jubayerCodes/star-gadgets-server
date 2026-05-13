import { Router } from "express";
import { Role } from "../User/user.interface";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import passport from "passport";

export const AuthRoutes = Router();

AuthRoutes.post("/login", AuthControllers.credentialsLogin);
AuthRoutes.post("/refresh-token", AuthControllers.getNewAccessToken);
AuthRoutes.post("/logout", AuthControllers.logout);
AuthRoutes.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword);

// Google Auth
AuthRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

AuthRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  AuthControllers.googleCallback,
);
