import { Router } from "express";
import { ConfigController } from "./config.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateHeaderConfigValidation, updateHeroConfigValidation } from "./config.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const ConfigRoutes = Router();

ConfigRoutes.patch(
  "/header/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateHeaderConfigValidation),
  ConfigController.updateHeaderConfig,
);

ConfigRoutes.patch(
  "/hero/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateHeroConfigValidation),
  ConfigController.updateHeroConfig,
);

ConfigRoutes.get("/", ConfigController.getConfig);
