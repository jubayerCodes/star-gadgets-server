import { Router } from "express";
import { ConfigController } from "./config.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateHeaderConfigValidation } from "./config.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const ConfigRoutes = Router();

ConfigRoutes.patch(
  "/header/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateHeaderConfigValidation),
  ConfigController.updateHeaderConfig,
);

ConfigRoutes.get("/", ConfigController.getConfig);
