"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const category_route_1 = require("../modules/Category/category.route");
const sub_category_route_1 = require("../modules/Sub-Category/sub-category.route");
const config_routes_1 = require("../modules/Configuration/config.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/categories",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/sub-categories",
        route: sub_category_route_1.SubCategoryRoutes,
    },
    {
        path: "/config",
        route: config_routes_1.ConfigRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
