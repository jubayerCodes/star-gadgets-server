import { Router } from "express";
import { ProductControllers } from "./product.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createProductZodSchema, updateProductZodSchema } from "./product.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const ProductRoutes = Router();

ProductRoutes.post(
  "/",
  checkAuth(Role.ADMIN),
  validateRequest(createProductZodSchema),
  ProductControllers.createProduct,
);

ProductRoutes.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateProductZodSchema),
  ProductControllers.updateProduct,
);

ProductRoutes.get("/admin", checkAuth(Role.ADMIN), ProductControllers.getProductsAdmin);

ProductRoutes.get("/featured", ProductControllers.getFeaturedProducts);

ProductRoutes.get("/search", ProductControllers.searchProducts);

ProductRoutes.get("/listing", ProductControllers.getPublicProducts);

ProductRoutes.get("/slug/:slug", ProductControllers.getProductBySlug);

ProductRoutes.get("/:id", ProductControllers.getProductById);

ProductRoutes.delete("/:id", checkAuth(Role.ADMIN), ProductControllers.deleteProduct);

ProductRoutes.get("/", ProductControllers.getAllProducts);
