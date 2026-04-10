"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const category_route_1 = require("../modules/Category/category.route");
const sub_category_route_1 = require("../modules/Sub-Category/sub-category.route");
const config_routes_1 = require("../modules/Configuration/config.routes");
const brand_route_1 = require("../modules/Brand/brand.route");
const upload_route_1 = require("../modules/Upload/upload.route");
const product_route_1 = require("../modules/Product/product.route");
const badge_route_1 = require("../modules/Badge/badge.route");
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
        path: "/brands",
        route: brand_route_1.BrandRoutes,
    },
    {
        path: "/uploads",
        route: upload_route_1.UploadRoutes,
    },
    {
        path: "/config",
        route: config_routes_1.ConfigRoutes,
    },
    {
        path: "/products",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/badges",
        route: badge_route_1.BadgeRoutes,
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
