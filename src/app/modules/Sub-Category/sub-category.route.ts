import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createSubCategoryZodSchema, updateSubCategoryZodSchema } from "./sub-category.validation";
import { SubCategoryControllers } from "./sub-category.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const SubCategoryRoutes = Router();

SubCategoryRoutes.post(
  "/",
  multerUpload.single("file"),
  validateRequest(createSubCategoryZodSchema),
  SubCategoryControllers.createSubCategory,
);

SubCategoryRoutes.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateSubCategoryZodSchema),
  SubCategoryControllers.updateSubCategory,
);

SubCategoryRoutes.get("/admin", checkAuth(Role.ADMIN), SubCategoryControllers.getSubCategoriesAdmin);
