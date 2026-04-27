import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { CategoryRoutes } from "../modules/Category/category.route";
import { SubCategoryRoutes } from "../modules/Sub-Category/sub-category.route";
import { ConfigRoutes } from "../modules/Configuration/config.routes";
import { BrandRoutes } from "../modules/Brand/brand.route";
import { UploadRoutes } from "../modules/Upload/upload.route";
import { ProductRoutes } from "../modules/Product/product.route";
import { BadgeRoutes } from "../modules/Badge/badge.route";
import { CouponRoutes } from "../modules/Coupon/coupon.routes";
import { OrderRoutes } from "../modules/Order/order.routes";
import { PaymentRoutes } from "../modules/Payment/payment.routes";

export const router = Router();

const moduleRoutes: {
  path: string;
  route: Router;
}[] = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/sub-categories",
    route: SubCategoryRoutes,
  },
  {
    path: "/brands",
    route: BrandRoutes,
  },
  {
    path: "/uploads",
    route: UploadRoutes,
  },
  {
    path: "/config",
    route: ConfigRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/badges",
    route: BadgeRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
