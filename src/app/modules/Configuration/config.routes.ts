import { Router } from "express";
import { ConfigServices } from "./config.servces";

export const ConfigRoutes = Router();

ConfigRoutes.patch("/", ConfigServices.updateConfig);
