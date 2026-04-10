import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../User/user.interface";
import { BadgeController } from "./badge.controller";
import { createBadgeZodSchema, updateBadgeZodSchema } from "./badge.validation";

export const BadgeRoutes = Router();

BadgeRoutes.post("/", checkAuth(Role.ADMIN), validateRequest(createBadgeZodSchema), BadgeController.createBadge);

BadgeRoutes.patch("/:id", checkAuth(Role.ADMIN), validateRequest(updateBadgeZodSchema), BadgeController.updateBadge);

BadgeRoutes.delete("/:id", checkAuth(Role.ADMIN), BadgeController.deleteBadge);

BadgeRoutes.get("/", checkAuth(Role.ADMIN), BadgeController.getAllBadges);
