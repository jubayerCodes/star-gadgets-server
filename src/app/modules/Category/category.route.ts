import { Router } from "express";
import { CategoryControllers } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./category.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const CategoryRoutes = Router();

CategoryRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory,
);

CategoryRoutes.patch(
  "/:id",
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory,
);

CategoryRoutes.get("/admin", checkAuth(Role.ADMIN), CategoryControllers.getCategoriesAdmin);

CategoryRoutes.delete("/:id", checkAuth(Role.ADMIN), CategoryControllers.deleteCategory);

CategoryRoutes.get("/list", CategoryControllers.getCategoriesList);
