import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCouponValidation, validateCouponValidation } from "./coupon.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

export const CouponRoutes = Router();

CouponRoutes.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCouponValidation),
  CouponController.createCoupon
);

CouponRoutes.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponController.getAllCoupons
);

CouponRoutes.post(
  "/validate",
  validateRequest(validateCouponValidation),
  CouponController.validateCoupon
);

CouponRoutes.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  CouponController.deleteCoupon
);
