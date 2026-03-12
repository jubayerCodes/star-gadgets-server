import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { createSubCategoryZodSchema, updateSubCategoryZodSchema } from "./sub-category.validation";
import { SubCategoryControllers } from "./sub-category.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const SubCategoryRoutes = Router();

SubCategoryRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createSubCategoryZodSchema),
  SubCategoryControllers.createSubCategory,
);

SubCategoryRoutes.patch(
  "/:id",
  validateRequest(updateSubCategoryZodSchema),
  SubCategoryControllers.updateSubCategory,
);

SubCategoryRoutes.get("/admin", checkAuth(Role.ADMIN), SubCategoryControllers.getSubCategoriesAdmin);

SubCategoryRoutes.get("/list", SubCategoryControllers.getSubCategoriesList);
