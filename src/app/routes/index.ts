import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { CategoryRoutes } from "../modules/Category/category.route";
import { SubCategoryRoutes } from "../modules/Sub-Category/sub-category.route";
import { ConfigRoutes } from "../modules/Configuration/config.routes";

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
    path: "/config",
    route: ConfigRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
