import { Router } from "express";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { Role } from "./user.interface";
import { UserControllers } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

export const UserRoutes = Router();

UserRoutes.post("/", validateRequest(createUserZodSchema), UserControllers.createUser);
UserRoutes.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
UserRoutes.get("/me", checkAuth(...Object.values(Role)), UserControllers.getProfile);
UserRoutes.patch(
  "/me",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserControllers.updateProfile,
);
