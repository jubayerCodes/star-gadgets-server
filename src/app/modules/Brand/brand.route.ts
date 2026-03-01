import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBrandZodSchema, updateBrandZodSchema } from "./brand.validation";
import { BrandController } from "./brand.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const BrandRoutes = Router();

BrandRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(createBrandZodSchema),
  BrandController.createBrand,
);

BrandRoutes.patch(
  "/:id",
  multerUpload.single("file"),
  validateRequest(updateBrandZodSchema),
  BrandController.updateBrand,
);

BrandRoutes.delete("/:id", checkAuth(Role.ADMIN), BrandController.deleteBrand);

BrandRoutes.get("/admin", checkAuth(Role.ADMIN), BrandController.getBrandsAdmin);
