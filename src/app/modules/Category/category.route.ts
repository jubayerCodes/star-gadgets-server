import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { CategoryControllers } from "./category.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCategoryZodSchema, updateCategoryZodSchema } from "./category.validation";

export const CategoryRoutes = Router();

CategoryRoutes.post(
  "/",
  multerUpload.single("file"),
  validateRequest(createCategoryZodSchema),
  CategoryControllers.createCategory,
);

CategoryRoutes.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateCategoryZodSchema),
  CategoryControllers.updateCategory,
);

CategoryRoutes.get("/populated", CategoryControllers.getCategoriesWithSubCategories);
