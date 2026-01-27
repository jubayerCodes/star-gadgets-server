import { Router } from "express";
import { HeaderConfigControllers } from "./header-config.controller";

export const HeaderConfigRoutes = Router();

HeaderConfigRoutes.get("/", HeaderConfigControllers.getHeaderConfig);
